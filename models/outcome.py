from datetime import datetime
from database import db

class Outcome(db.Model):
    __tablename__ = 'outcomes'
    
    id = db.Column(db.Integer, primary_key=True)
    decision_id = db.Column(db.Integer, db.ForeignKey('decisions.id'), nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    
    # Fields
    result_description = db.Column(db.Text, nullable=False)
    result_type = db.Column(db.String(20), nullable=False)  # successful, partially_successful, unsuccessful
    impact_assessment = db.Column(db.Text)
    lessons_learned = db.Column(db.Text)
    outcome_date = db.Column(db.Date, nullable=False)
    follow_up_required = db.Column(db.Boolean, default=False)
    follow_up_notes = db.Column(db.Text)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def __repr__(self):
        return f'<Outcome Decision: {self.decision_id}, Result: {self.result_type}>'
