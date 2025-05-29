from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class UniversityCredentials(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    university = db.Column(db.String(255), nullable=False)
    year = db.Column(db.String(4), nullable=False)
    moe_signature_key = db.Column(db.Text, nullable=False)
    university_public_key = db.Column(db.Text, nullable=True)
    
class GraduateRecord(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    university = db.Column(db.String, nullable=False)
    year = db.Column(db.String, nullable=False)
    data = db.Column(db.Text, nullable=False)  # JSON-encoded
    moe_signature_key = db.Column(db.String, nullable=False)
    signature = db.Column(db.Text, nullable=False)

class Certificate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    university = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    national_id = db.Column(db.String, nullable=True)
    filename = db.Column(db.String, nullable=False)
    file_data = db.Column(db.LargeBinary, nullable=False)
    mimetype = db.Column(db.String, nullable=False)