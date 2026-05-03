from flask import Blueprint
from flask_login import login_required
from views.admin_views import (
    admin_dashboard_view, admin_rabbits_view, admin_feeding_view,
    admin_breeding_view, admin_health_view, admin_growth_view,
    admin_sales_view, admin_decisions_view, admin_outcomes_view,
    admin_reports_view, admin_users_view
)

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/')
@login_required
def dashboard():
    """Admin dashboard page"""
    return admin_dashboard_view()

@admin_bp.route('/rabbits')
@login_required
def rabbits():
    """Rabbits management page"""
    return admin_rabbits_view()

@admin_bp.route('/feeding')
@login_required
def feeding():
    """Feeding management page"""
    return admin_feeding_view()

@admin_bp.route('/breeding')
@login_required
def breeding():
    """Breeding management page"""
    return admin_breeding_view()

@admin_bp.route('/health')
@login_required
def health():
    """Health management page"""
    return admin_health_view()

@admin_bp.route('/growth')
@login_required
def growth():
    """Growth tracking page"""
    return admin_growth_view()

@admin_bp.route('/sales')
@login_required
def sales():
    """Sales management page"""
    return admin_sales_view()

@admin_bp.route('/decisions')
@login_required
def decisions():
    """Decision management page"""
    return admin_decisions_view()

@admin_bp.route('/outcomes')
@login_required
def outcomes():
    """Decision outcomes page"""
    return admin_outcomes_view()

@admin_bp.route('/reports')
@login_required
def reports():
    """Reports and analytics page"""
    return admin_reports_view()

@admin_bp.route('/users')
@login_required
def users():
    """User management page"""
    return admin_users_view()