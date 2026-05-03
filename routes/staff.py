from flask import Blueprint
from views.staff_views import staff_dashboard_view, staff_rabbits_view, staff_feeding_view

staff_bp = Blueprint('staff', __name__, url_prefix='/staff')

@staff_bp.route('/')
def dashboard():
    """Staff dashboard page"""
    return staff_dashboard_view()

@staff_bp.route('/rabbits')
def rabbits():
    """Rabbits management page for staff"""
    return staff_rabbits_view()

@staff_bp.route('/feeding')
def feeding():
    """Feeding operations page for staff"""
    return staff_feeding_view()
