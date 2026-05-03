from flask import Blueprint
from views.auth_views import login_view, logout_view, register_view, profile_view, change_password_view

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    """Handle user login"""
    return login_view()

@auth_bp.route('/logout')
def logout():
    """Handle user logout"""
    return logout_view()

@auth_bp.route('/register', methods=['GET', 'POST'])
def register():
    """Handle user registration (admin only)"""
    return register_view()

@auth_bp.route('/profile')
def profile():
    """User profile page"""
    return profile_view()

@auth_bp.route('/change_password', methods=['POST'])
def change_password():
    """Handle password change"""
    return change_password_view()
