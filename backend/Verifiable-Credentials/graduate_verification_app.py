# graduate_verification_app.py

import json
import hashlib
import base64
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.backends import default_backend
from flask import Flask, request, jsonify
from flask_cors import CORS  # Import Flask-CORS
from werkzeug.utils import secure_filename
from flask import send_file
import glob
import os

app = Flask(__name__)
CORS(app)  # Allow all origins by default

# In-memory stores (simulate DBs)
universities = {}
UNIVERSITY_REGISTRY_NAME = "university_registry.json"
GRADUATE_RECORD_FILE = "graduate_records.json"
TEMP_UNIV_PRIVATE_KEY= "temp_univ_private_key.json"
CERTIFICATE_DIR = "certificates"

# Simulate MoE signing a university public key
def moe_sign_data(data):
    return base64.b64encode(hashlib.sha256(data.encode()).digest()).decode()

@app.route('/moe/generate_keys_for_university', methods=['POST'])
def moe_generate_keys_for_university():
    university = request.json['university']
    year = request.json['year']

    # Simulate MoE generating a public key and signature key for this university
    moe_private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    moe_public_key = moe_private_key.public_key()

    moe_public_pem = moe_public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()

    moe_signature_key = base64.b64encode(
        hashlib.sha256(f"{university}_{year}_signature_key".encode()).digest()
    ).decode()

    data = {
        "university": university,
        "year": year,
        "moe_signature_key": moe_signature_key
    }

    save_university_credential_to_file(data)

    return jsonify({
        "university": university,
        "year": year,
        "moe_signature_key": moe_signature_key
    })

def save_university_credential_to_file(data):
    university = data.get("university")
    year = str(data.get("year"))

    if not university or not year:
        raise ValueError("Both 'university' and 'year' must be provided in the data.")

    # Remove university and year from the main data (they become keys)
    entry = {k: v for k, v in data.items() if k not in ["university", "year"]}

    # Load existing data
    if os.path.exists(UNIVERSITY_REGISTRY_NAME):
        with open(UNIVERSITY_REGISTRY_NAME, "r") as f:
            credentials = json.load(f)
    else:
        credentials = {}

    # Create university and year entry
    credentials.setdefault(university, {})
    credentials[university][year] = entry

    # Save back to file
    with open(UNIVERSITY_REGISTRY_NAME, "w") as f:
        json.dump(credentials, f, indent=2)

@app.route('/university/generate_private_key', methods=['POST'])
def university_generate_private_key():
    university_name = request.json['university']
    moe_signature_key = request.json['moe_signature_key']
    year = request.json['year']
    
    try:
        # Generate private key
        private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)

        # Serialize private key (PEM)
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
            ).decode()

        # Serialize public key (PEM)
        public_pem = private_key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        ).decode()

        data = {
            "university": university_name,
            "year": year,
            "moe_signature_key": moe_signature_key,
            "university_public_key": public_pem
        }

        save_university_credential_to_file(data)

        # save the private key temporarily to file
        with open(TEMP_UNIV_PRIVATE_KEY, "w") as f:
            json.dump({"temp_univ_private_key": private_pem}, f, indent=2)
        

        return jsonify({
            "university_private_key": private_pem
        })
    except Exception as e:
        return jsonify({"error": "Invalid MoE signature key", "details": str(e)}), 400


@app.route('/university/sign_graduate', methods=['POST'])
def university_sign_graduates():
    graduate_list = request.json['graduates']  # Expecting a list of graduate data dicts
    #university_private_key_pem = request.json['university_private_key']
    # For now am I've saved the private key to json and loading from there for testing purpose, instead of always copy pasting
    university = request.json['institution_name']
    year = str(request.json['year'])
    #moe_signature_key = request.json['moe_signature_key']
    moe_signature_key = "zzvs1by79EAW2eMphXV9q5tT/ZBdHcd4FRcGpcZd03A="

    # Load private key from temp file
    with open(TEMP_UNIV_PRIVATE_KEY, "r") as f:
        university_private_key_pem = json.load(f)["temp_univ_private_key"]
    
    try:
        university_private_key = serialization.load_pem_private_key(
            university_private_key_pem.encode(),
            password=None,
            backend=default_backend()
        )

        # Load existing graduate records
        try:
            with open(GRADUATE_RECORD_FILE, "r") as f:
                content = f.read().strip()
                records = json.loads(content) if content else {}
        except FileNotFoundError:
            records = {}

        if university not in records:
            records[university] = []

        # If already exists as a dict (old format), convert it into a list
        elif isinstance(records[university], dict):
            records[university] = [records[university]]

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

            record_entry = {
                "year": year,
                "data": graduate_data,
                "moe_signature_key": moe_signature_key,
                "signature": signature
            }

            records[university].append(record_entry)
            added_graduates.append({
                "name": graduate_data.get("name"),
                "signature": signature
            })
        # Save back to file
        with open(GRADUATE_RECORD_FILE, "w") as f:
            json.dump(records, f, indent=2)

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
        with open(GRADUATE_RECORD_FILE, "r") as f:
            graduate_records = json.load(f)

        if university not in graduate_records:
            return jsonify({"error": "No graduates found for this university"}), 404

        return jsonify({
            "university": university,
            "graduates": graduate_records[university]
        }), 200

    except FileNotFoundError:
        return jsonify({"error": "Graduate record file not found"}), 500
    except Exception as e:
        return jsonify({"error": "Error retrieving graduate data", "details": str(e)}), 500

@app.route('/verify_graduate', methods=['POST'])
def verify_graduate():
    name = request.json['name']
    university = request.json['university']
    year = str(request.json['year'])

    try:
        # Normalize input name (lowercase, no spaces)
        normalized_input_name = name.replace(" ", "").lower()

        # Load graduate records
        with open(GRADUATE_RECORD_FILE, "r") as f:
            graduate_records = json.load(f)

        # Load university registry (for public keys)
        with open(UNIVERSITY_REGISTRY_NAME, "r") as f:
            university_registry = json.load(f)

        university_records = graduate_records.get(university)
        if not university_records:
            return jsonify({"error": "Graduate record not found for university"}), 404

        # Search for matching graduate by normalized name and year
        matching_record = None
        for record in university_records:
            grad_name = record["data"]["name"]
            normalized_grad_name = grad_name.replace(" ", "").lower()

            if record["year"] == year and normalized_grad_name == normalized_input_name:
                matching_record = record
                break

        if not matching_record:
            return jsonify({"error": "No matching graduate found"}), 404

        # Get university public key from registry
        university_info = university_registry.get(university, {}).get(year)
        if not university_info:
            return jsonify({"error": "University public key not found for that year"}), 404

        university_public_key_pem = university_info.get("university_public_key")
        if not university_public_key_pem:
            return jsonify({"error": "Missing university public key"}), 404

        # Load public key
        public_key = serialization.load_pem_public_key(
            university_public_key_pem.encode(),
            backend=default_backend()
        )

        # Reconstruct signed payload
        signed_payload = {
            "data": matching_record["data"],
            "moe_signature_key": matching_record["moe_signature_key"]
        }

        # Verify signature
        public_key.verify(
            base64.b64decode(matching_record["signature"]),
            json.dumps(signed_payload).encode(),
            padding.PKCS1v15(),
            hashes.SHA256()
        )

        return jsonify({
            "valid": True,
            "graduate": matching_record["data"],
            "university": university,
            "year": year
        })

    except FileNotFoundError:
        return jsonify({"error": "Graduate or university registry file not found"}), 500
    except Exception as e:
        return jsonify({"valid": False, "error": "Signature invalid", "details": str(e)}), 400

@app.route('/upload_certificate', methods=['POST'])
def upload_certificate():
    university = request.form.get('university')
    name = request.form.get('name')
    national_id = request.form.get('national_id')  # This can now be optional
    file = request.files.get('certificate')

    if not all([university, name, file]):
        return jsonify({"error": "Missing required fields: university, name, or certificate"}), 400

    try:
        # Create a filename, excluding national_id if it's not provided
        filename_parts = [university.strip().replace(" ", "_"),
                          name.strip().replace(" ", "_")]
        if national_id:
            filename_parts.append(national_id.strip())

        filename_parts.append(file.filename)
        filename = secure_filename("_".join(filename_parts))
        filepath = os.path.join(CERTIFICATE_DIR, filename)

        file.save(filepath)

        return jsonify({
            "message": "Certificate uploaded successfully",
            "filename": filename
        }), 200

    except Exception as e:
        return jsonify({
            "error": "Failed to upload certificate",
            "details": str(e)
        }), 500
    

@app.route('/get_certificate', methods=['POST'])
def get_certificate():
    university = request.json.get('university')
    name = request.json.get('name')
    national_id = request.json.get('national_id')  # Optional

    if not university or not name:
        return jsonify({"error": "Missing university or name"}), 400

    # Build base filename parts
    base_parts = [university.strip().replace(" ", "_"),
                  name.strip().replace(" ", "_")]

    if national_id:
        base_parts.append(national_id.strip())

    base_pattern = "_".join(base_parts)
    search_pattern = os.path.join(CERTIFICATE_DIR, f"{base_pattern}_*")

    # Search for matching file(s)
    matching_files = glob.glob(search_pattern)
    if not matching_files:
        return jsonify({"error": "Certificate not found"}), 404

    try:
        return send_file(matching_files[0], as_attachment=True)
    except Exception as e:
        return jsonify({"error": "Failed to send certificate", "details": str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
