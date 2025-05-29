from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.backends import default_backend
from database_model import db, UniversityCredentials, GraduateRecord, Certificate
from werkzeug.utils import secure_filename
import base64
import json
from flask import send_file
import io
import os


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:1234@localhost:5432/GVDatabase'  # Replace with your PostgreSQL URI if needed
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

with app.app_context():
    db.create_all()

CERTIFICATE_DIR = "certificates"

@app.route('/moe/generate_keys_for_university', methods=['POST'])
def moe_generate_keys_for_university():
    university_list = request.json.get('universities', [])

    if not university_list:
        return jsonify({"error": "No university data provided"}), 400

    response_data = []

    for uni in university_list:
        university = uni.get('university')
        year = str(uni.get('year'))
        moe_signature_key = uni.get('moe_signature_key')

        if not university or not year or not moe_signature_key:
            continue

        existing = UniversityCredentials.query.filter_by(university=university, year=year).first()
        if existing:
            existing.moe_signature_key = moe_signature_key
        else:
            new_entry = UniversityCredentials(
                university=university,
                year=year,
                moe_signature_key=moe_signature_key
            )
            db.session.add(new_entry)

        try:
            db.session.commit()
            response_data.append({
                "university": university,
                "year": year,
                "moe_signature_key": moe_signature_key,
                "status": "saved"
            })
        except Exception as e:
            db.session.rollback()
            response_data.append({
                "university": university,
                "year": year,
                "error": str(e),
                "status": "failed"
            })

    return jsonify({"results": response_data})

@app.route('/university/generate_private_key', methods=['POST'])
def university_generate_private_key():
    university_name = request.json['university']
    moe_signature_key = request.json['moe_signature_key']
    year = str(request.json['year'])

    try:
        # Generate keys
        private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        ).decode()

        public_pem = private_key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode()

        # Save public key to DB
        credential = UniversityCredentials(
            university=university_name,
            year=year,
            moe_signature_key=moe_signature_key,
            university_public_key=public_pem
        )
        db.session.merge(credential)
        db.session.commit()

        return jsonify({
            "university_private_key": private_pem
        })

    except Exception as e:
        return jsonify({"error": "Key generation failed", "details": str(e)}), 400


@app.route('/university/sign_graduate', methods=['POST'])
def university_sign_graduates():
    graduate_list = request.json['graduates']
    university = request.json['institution_name']
    year = str(request.json['year'])
    moe_signature_key = request.json['moe_signature_key']
    university_private_key_pem = request.json['university_private_key']

    try:
        university_private_key = serialization.load_pem_private_key(
            university_private_key_pem.encode(),
            password=None,
            backend=default_backend()
        )

        added_graduates = []

        for graduate_data in graduate_list:
            payload = {
                "data": graduate_data,
                "moe_signature_key": moe_signature_key
            }

            signature = base64.b64encode(
                university_private_key.sign(
                    json.dumps(payload).encode(),
                    padding.PKCS1v15(),
                    hashes.SHA256()
                )
            ).decode()

            record = GraduateRecord(
                university=university,
                year=year,
                data=json.dumps(graduate_data),
                moe_signature_key=moe_signature_key,
                signature=signature
            )
            db.session.add(record)
            added_graduates.append({
                "name": graduate_data.get("name"),
                "signature": signature
            })

        db.session.commit()

        return jsonify({
            "message": "Graduates signed and stored successfully",
            "signed_graduates": added_graduates
        })

    except Exception as e:
        return jsonify({"error": "Signing failed", "details": str(e)}), 400

@app.route('/university/graduates', methods=['POST'])
def get_graduates_by_university():
    data = request.json
    university = data.get('university')

    if not university:
        return jsonify({"error": "University name is required"}), 400

    try:
        # Query the database for matching graduates
        graduate_records = GraduateRecord.query.filter_by(university=university).all()

        if not graduate_records:
            return jsonify({"error": "No graduates found for this university"}), 404

        # Decode the JSON-encoded data for each graduate
        graduates_data = []
        for record in graduate_records:
            try:
                graduate_info = json.loads(record.data)
            except json.JSONDecodeError:
                graduate_info = {"error": "Invalid JSON data in record"}
            
            graduates_data.append({
                "data": graduate_info,
                "year": record.year,
                "moe_signature_key": record.moe_signature_key,
                "signature": record.signature
            })

        return jsonify({
            "university": university,
            "graduates": graduates_data
        }), 200

    except Exception as e:
        return jsonify({"error": "Error retrieving graduate data", "details": str(e)}), 500

@app.route('/upload_certificate', methods=['POST'])
def upload_certificate():
    university = request.form.get('university')
    name = request.form.get('name')
    national_id = request.form.get('national_id')  # Optional
    file = request.files.get('certificate')

    if not all([university, name, file]):
        return jsonify({"error": "Missing required fields: university, name, or certificate"}), 400

    try:
        filename_parts = [university.strip().replace(" ", "_"),
                          name.strip().replace(" ", "_")]
        if national_id:
            filename_parts.append(national_id.strip())
        filename_parts.append(file.filename)

        filename = secure_filename("_".join(filename_parts))
        filepath = os.path.join(CERTIFICATE_DIR, filename)
        os.makedirs(CERTIFICATE_DIR, exist_ok=True)
        file.save(filepath)

        # Save record in DB
        new_cert = Certificate(
            university=university,
            name=name,
            national_id=national_id,
            filename=filename,
            filepath=filepath
        )
        db.session.add(new_cert)
        db.session.commit()

        return jsonify({"message": "Certificate uploaded successfully", "filename": filename}), 200

    except Exception as e:
        return jsonify({"error": "Failed to upload certificate", "details": str(e)}), 500

@app.route('/get_certificate', methods=['POST'])
def get_certificate():
    university = request.json.get('university')
    name = request.json.get('name')
    national_id = request.json.get('national_id')

    if not university or not name:
        return jsonify({"error": "Missing university or name"}), 400

    query = Certificate.query.filter_by(university=university, name=name)
    if national_id:
        query = query.filter_by(national_id=national_id)

    cert = query.first()
    if not cert or not os.path.exists(cert.filepath):
        return jsonify({"error": "Certificate not found"}), 404

    try:
        return send_file(cert.filepath, as_attachment=True)
    except Exception as e:
        return jsonify({"error": "Failed to send certificate", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
