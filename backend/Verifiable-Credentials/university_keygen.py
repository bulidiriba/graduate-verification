# Script to generate a key pair and demonstrate signing

import json
import hashlib
import base64
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.backends import default_backend
from flask import Flask, request, jsonify

def generate_key_pair():
    private_key = rsa.generate_private_key(
        public_exponent=65537,
        key_size=2048,
        backend=default_backend()
    )
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode()

    public_pem = private_key.public_key().public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode()

    return private_key, private_pem, public_pem

def sign_graduate_data(private_key, data):
    return base64.b64encode(
        private_key.sign(
            json.dumps(data).encode(),
            padding.PKCS1v15(),
            hashes.SHA256()
        )
    ).decode()

def save_keys_to_file(private_pem, public_pem, filename_prefix):
    with open(f"{filename_prefix}_private.pem", "w") as f:
        f.write(private_pem)
    with open(f"{filename_prefix}_public.pem", "w") as f:
        f.write(public_pem)

def save_signed_graduate_data(data, signature, filename):
    with open(filename, "w") as f:
        json.dump({"data": data, "signature": signature}, f, indent=2)

# Example usage
if __name__ == '__main__':
    private_key, private_pem, public_pem = generate_key_pair()
    print("Private Key:\n", private_pem)
    print("Public Key:\n", public_pem)

    # Save to files
    save_keys_to_file(private_pem, public_pem, "university")

    # Example graduate data
    grad_data = {
        "name": "Alice Smith",
        "degree": "BSc Computer Science",
        "year": 2024
    }

    signature = sign_graduate_data(private_key, grad_data)
    print("Signed Graduate Data:", signature)

    # Save signed graduate data to file
    save_signed_graduate_data(grad_data, signature, "signed_graduate_data.json")