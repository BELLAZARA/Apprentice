from datetime import datetime
from database import db

class Decision(db.Model):
    __tablename__ = 'decisions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Fields
    category = db.Column(db.String(50), nullable=False)  # feeding, breeding, health, sales, recruitment
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    justification = db.Column(db.Text, nullable=False)
    decision_date = db.Column(db.Date, nullable=False)
    responsible_person = db.Column(db.String(150), nullable=False)
    status = db.Column(db.String(20), nullable=False, default='pending')  # pending, implemented, cancelled
    implementation_date = db.Column(db.Date)
    expected_impact = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Decision {self.category}: {self.title[:50]}>'
