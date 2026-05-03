from flask import render_template, session, redirect, url_for, flash

def staff_dashboard_view():
    """Render staff dashboard page"""
    if 'user_id' not in session:
        flash('Please login to access this page', 'error')
        return redirect(url_for('auth.login'))
    
    if session.get('user_role') not in ['admin', 'staff']:
        flash('Access denied. Staff privileges required.', 'error')
        return redirect(url_for('auth.login'))
    
    # Mock data for staff dashboard
    tasks = {
        'feeding_due': 8,
        'health_checks': 5,
        'births_due': 2,
        'weight_checks': 12
    }
    
    recent_activities = [
        {
            'icon': '🌿',
            'title': 'Feeding Completed',
            'details': 'Block A morning feeding completed',
            'time': '2 hours ago'
        },
        {
            'icon': '🩺',
            'title': 'Health Check',
            'details': 'Checked Doe #123 - healthy',
            'time': '4 hours ago'
        },
        {
            'icon': '📈',
            'title': 'Weight Recorded',
            'details': 'Kit #456 weight: 1.2kg',
            'time': '6 hours ago'
        }
    ]
    
    alerts = [
        {
            'severity': 'warning',
            'icon': '⚠️',
            'title': 'Feeding Overdue',
            'message': 'Block B feeding is 30 minutes overdue',
            'action_text': 'Start Feeding',
            'time': '5 minutes ago'
        },
        {
            'severity': 'info',
            'icon': 'ℹ️',
            'title': 'Health Reminder',
            'message': 'Vaccination scheduled for tomorrow',
            'action_text': 'Prepare',
            'time': '1 hour ago'
        }
    ]
    
    my_rabbits = [
        {
            'id': 'R001',
            'rabbit_id': 'Doe-123',
            'breed': 'New Zealand White',
            'cage_location': 'Block A-1',
            'status': 'Healthy',
            'last_check': '2 hours ago',
            'has_alerts': False
        },
        {
            'id': 'R002',
            'rabbit_id': 'Buck-456',
            'breed': 'California',
            'cage_location': 'Block A-2',
            'status': 'Needs Attention',
            'last_check': '1 day ago',
            'has_alerts': True,
            'alert_message': 'Weight loss detected'
        }
    ]
    
    return render_template('staff/dashboard.html',
                         tasks=tasks,
                         recent_activities=recent_activities,
                         alerts=alerts,
                         my_rabbits=my_rabbits,
                         current_time='2024-01-20 14:30')

def staff_rabbits_view():
    """Render rabbits management page for staff"""
    if 'user_id' not in session:
        flash('Please login to access this page', 'error')
        return redirect(url_for('auth.login'))
    
    if session.get('user_role') not in ['admin', 'staff']:
        flash('Access denied. Staff privileges required.', 'error')
        return redirect(url_for('auth.login'))
    
    return render_template('staff/rabbits/list.html')

def staff_feeding_view():
    """Render feeding operations page for staff"""
    if 'user_id' not in session:
        flash('Please login to access this page', 'error')
        return redirect(url_for('auth.login'))
    
    if session.get('user_role') not in ['admin', 'staff']:
        flash('Access denied. Staff privileges required.', 'error')
        return redirect(url_for('auth.login'))
    
    return render_template('staff/feeding/list.html')
