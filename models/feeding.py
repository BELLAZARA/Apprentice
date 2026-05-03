from datetime import datetime
from database import db

class Feeding(db.Model):
    __tablename__ = 'feeding'
    
    id = db.Column(db.Integer, primary_key=True)
    rabbit_id = db.Column(db.Integer, db.ForeignKey('rabbits.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Fields
    feed_type = db.Column(db.String(50), nullable=False)  # pellets, hay, vegetables, etc.
    quantity = db.Column(db.Float, nullable=False)  # in grams
    unit = db.Column(db.String(10), nullable=False, default='grams')  # grams, kg
    cage_or_block = db.Column(db.String(20), nullable=False)  # Block A, B, C, etc.
    feeding_time = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f'<Feeding {self.feed_type} - {self.quantity}g>'
