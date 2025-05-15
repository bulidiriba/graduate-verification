# graduate_verification_app.py

import json
import hashlib
import base64
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.backends import default_backend
from flask import Flask, request, jsonify

app = Flask(__name__)

# In-memory stores (simulate DBs)
universities = {}
graduate_records = {}

# Simulate MoE signing a university public key
def moe_sign_data(data):
    return base64.b64encode(hashlib.sha256(data.encode()).digest()).decode()

# Endpoint: Register a university
@app.route('/register_university', methods=['POST'])
def register_university():
    name = request.json['name']
    public_key_pem = request.json['public_key']
    signature = moe_sign_data(public_key_pem)
    universities[name] = {
        'public_key': public_key_pem,
        'moe_signature': signature
    }
    return jsonify({"message": "University registered", "moe_signature": signature})

# Endpoint: Add a graduate
@app.route('/add_graduate', methods=['POST'])
def add_graduate():
    university = request.json['university']
    graduate_data = request.json['data']
    signature = request.json['signature']

    if university not in universities:
        return jsonify({"error": "University not found"}), 400

    public_key = serialization.load_pem_public_key(
        universities[university]['public_key'].encode(),
        backend=default_backend()
    )

    try:
        public_key.verify(
            base64.b64decode(signature.encode()),
            json.dumps(graduate_data).encode(),
            padding.PKCS1v15(),
            hashes.SHA256()
        )
        graduate_id = hashlib.sha256(json.dumps(graduate_data).encode()).hexdigest()
        graduate_records[graduate_id] = {
            'university': university,
            'data': graduate_data,
            'signature': signature
        }
        return jsonify({"message": "Graduate added", "id": graduate_id})
    except Exception as e:
        return jsonify({"error": "Signature verification failed", "details": str(e)}), 400

# Endpoint: Verify graduate by details
@app.route('/verify_graduate', methods=['POST'])
def verify_graduate_by_details():
    name = request.json['name']
    university = request.json['university']
    year = request.json['year']

    for record in graduate_records.values():
        data = record['data']
        if (
            data.get('name') == name and
            data.get('year') == year and
            record['university'] == university
        ):
            public_key = serialization.load_pem_public_key(
                universities[university]['public_key'].encode(),
                backend=default_backend()
            )
            try:
                public_key.verify(
                    base64.b64decode(record['signature'].encode()),
                    json.dumps(record['data']).encode(),
                    padding.PKCS1v15(),
                    hashes.SHA256()
                )
                return jsonify({"valid": True, "graduate": record['data'], "university": university})
            except:
                return jsonify({"valid": False, "error": "Signature invalid"})

    return jsonify({"error": "Graduate not found"}), 404

if __name__ == '__main__':
    app.run(debug=True)
