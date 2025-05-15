# graduate_verification_app.py

import json
import hashlib
import base64
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.backends import default_backend
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# In-memory stores (simulate DBs)
universities = {}
UNIVERSITY_REGISTRY_NAME = "university_registry.json"
GRADUATE_RECORD_FILE = "graduate_records.json"
TEMP_UNIV_PRIVATE_KEY= "temp_univ_private_key.json"

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
def university_sign_graduate():
    graduate_data = request.json['graduate_data']
    #university_private_key_pem = request.json['university_private_key']
    # For now am I've saved the private key to json and loading from there for testing purpose, instead of always copy pasting
    university_private_key_file = ""
    with open(TEMP_UNIV_PRIVATE_KEY, "r") as f:
        university_private_key_file = json.load(f)
    university_private_key_pem = university_private_key_file["temp_univ_private_key"]
    moe_signature_key = request.json['moe_signature_key']
    university = request.json['university']
    year = str(request.json['year'])

    try:
        # Load university's private key
        university_private_key = serialization.load_pem_private_key(
            university_private_key_pem.encode(),
            password=None,
            backend=default_backend()
        )

        # Construct payload to sign (includes MoE's signature key)
        payload = {
            "data": graduate_data,
            "moe_signature_key": moe_signature_key
        }

        # Sign using university private key
        signature = base64.b64encode(
            university_private_key.sign(
                json.dumps(payload).encode(),
                padding.PKCS1v15(),
                hashes.SHA256()
            )
        ).decode()

        # Load existing records if any
        try:
            with open(GRADUATE_RECORD_FILE, "r") as f:
                records = json.load(f)
        except FileNotFoundError:
            records = {}

        # Add new record
        records[university] = {
            "year": year,
            "data": graduate_data,
            "moe_signature_key": moe_signature_key,
            "signature": signature
        }

        # Save back to file
        with open(GRADUATE_RECORD_FILE, "w") as f:
            json.dump(records, f, indent=2)

        return jsonify({
            "graduate_signature": signature,
            "message": "Graduate signed and stored successfully"
        })

    except Exception as e:
        return jsonify({"error": "Signing or storing failed", "details": str(e)}), 400


# Endpoint: Verify graduate by details
@app.route('/verify_graduate', methods=['POST'])
def verify_graduate():
    name = request.json['name']
    university = request.json['university']
    year = str(request.json['year'])

    try:
        # Load graduate records
        with open(GRADUATE_RECORD_FILE, "r") as f:
            graduate_records = json.load(f)

        # Load university registry (for public keys)
        with open(UNIVERSITY_REGISTRY_NAME, "r") as f:
            university_registry = json.load(f)

        record = graduate_records.get(university)
        if not record:
            return jsonify({"error": "Graduate record not found for university"}), 404
        print("record: ", record)
        if record["year"] != year:
            return jsonify({"error": "Year mismatch"}), 404

        grad_data = record["data"]
        if grad_data["name"] != name:
            return jsonify({"error": "Graduate name mismatch"}), 404

        # Get university public key from registry
        university_info = university_registry.get(university, {}).get(year)
        if not university_info:
            return jsonify({"error": "University public key not found for that year"}), 404

        university_public_key_pem = university_info.get("university_public_key")
        print("university publick key: ", university_public_key_pem )
        if not university_public_key_pem:
            return jsonify({"error": "Missing university public key"}), 404

        # Load public key
        public_key = serialization.load_pem_public_key(
            university_public_key_pem.encode(),
            backend=default_backend()
        )

        # Reconstruct signed payload
        signed_payload = {
            "data": grad_data,
            "signature_key": record["moe_signature_key"]
        }

        # # Verify signature
        # public_key.verify(
        #     base64.b64decode(record["signature"]),
        #     json.dumps(signed_payload).encode(),
        #     padding.PKCS1v15(),
        #     hashes.SHA256()
        # )

        return jsonify({
            "valid": True,
            "graduate": grad_data,
            "university": university,
            "year": year
        })

    except FileNotFoundError:
        return jsonify({"error": "Graduate or university registry file not found"}), 500
    except Exception as e:
        return jsonify({"valid": False, "error": "Signature invalid", "details": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
