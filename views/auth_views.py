from flask import render_template, request, redirect, url_for, flash, session
import os

def login_view():
    """Handle login page rendering and form submission"""
    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        
        # Validate input
        if not email or not password:
            flash('Please enter both email and password', 'error')
            return render_template('auth/login.html')
        
        # Check admin credentials from .env
        admin_email = os.environ.get('ADMIN_EMAIL')
        admin_password = os.environ.get('ADMIN_PASSWORD')
        admin_name = os.environ.get('ADMIN_NAME', 'Admin User')
        
        if email == admin_email and password == admin_password:
            # Set session
            session['user_id'] = 1
            session['user_email'] = admin_email
            session['user_role'] = 'admin'
            session['user_name'] = admin_name
            
            flash('Login successful!', 'success')
            return redirect(url_for('admin.dashboard'))
        else:
            flash('Invalid email or password', 'error')
    
    return render_template('auth/login.html')

def logout_view():
    """Handle logout"""
    session.clear()
    flash('You have been logged out', 'info')
    return redirect(url_for('auth.login'))

def register_view():
    """Handle user registration (admin only)"""
    # Check if user is admin
    if session.get('user_role') != 'admin':
        flash('Access denied. Admin privileges required.', 'error')
        return redirect(url_for('auth.login'))
    
    if request.method == 'POST':
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm_password = request.form.get('confirm_password')
        role = request.form.get('role', 'staff')
        
        # Validate input
        if not all([full_name, email, password, confirm_password]):
            flash('Please fill in all fields', 'error')
            return render_template('auth/register.html')
        
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return render_template('auth/register.html')
        
        if len(password) < 8:
            flash('Password must be at least 8 characters long', 'error')
            return render_template('auth/register.html')
        
        # For now, just show success (in real app, would save to database)
        flash(f'User {full_name} created successfully!', 'success')
        return redirect(url_for('admin.users'))
    
    return render_template('auth/register.html')

def profile_view():
    """User profile page"""
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    
    # Mock user data (in real app, would get from database)
    user = {
        'id': session.get('user_id'),
        'full_name': session.get('user_name'),
        'email': session.get('user_email'),
        'role': session.get('user_role'),
        'status': 'active',
        'created_at': '2024-01-15',
        'last_login': '2024-01-20 14:30'
    }
    
    return render_template('auth/profile.html', user=user)

def change_password_view():
    """Handle password change"""
    if 'user_id' not in session:
        return redirect(url_for('auth.login'))
    
    current_password = request.form.get('current_password')
    new_password = request.form.get('new_password')
    confirm_password = request.form.get('confirm_password')
    
    # Validate current password (in real app, would check against database)
    admin_password = os.environ.get('ADMIN_PASSWORD')
    if session.get('user_email') == os.environ.get('ADMIN_EMAIL'):
        if current_password != admin_password:
            flash('Current password is incorrect', 'error')
            return redirect(url_for('auth.profile'))
    
    # Validate new password
    if new_password != confirm_password:
        flash('New passwords do not match', 'error')
        return redirect(url_for('auth.profile'))
    
    if len(new_password) < 8:
        flash('New password must be at least 8 characters long', 'error')
        return redirect(url_for('auth.profile'))
    
    # Update password (in real app, would update in database)
    flash('Password changed successfully!', 'success')
    
    return redirect(url_for('auth.profile'))
