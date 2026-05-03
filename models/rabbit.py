from datetime import datetime
from database import db

class Rabbit(db.Model):
    __tablename__ = 'rabbits'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Fields
    rabbit_id = db.Column(db.String(20), unique=True, nullable=False, index=True)  # RBT-001 format
    breed = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(10), nullable=False)  # male, female
    date_of_birth = db.Column(db.Date, nullable=False)
    cage_location = db.Column(db.String(20), nullable=False)  # Block A, B, C, etc.
    status = db.Column(db.String(20), nullable=False, default='active')  # active, sold, deceased
    source = db.Column(db.String(20), nullable=False)  # born_on_farm, purchased
    source_details = db.Column(db.String(100))  # parent IDs if born, supplier if purchased
    weight_at_birth = db.Column(db.Float)  # in grams
    current_weight = db.Column(db.Float)  # in grams
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Rabbit ID: {self.rabbit_id}, Breed: {self.breed}>'
