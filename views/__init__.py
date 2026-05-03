from .main_views import home_view, index_view
from .auth_views import login_view, logout_view, register_view, profile_view, change_password_view
from .admin_views import (
    admin_dashboard_view, admin_rabbits_view, admin_feeding_view, 
    admin_breeding_view, admin_health_view, admin_growth_view, 
    admin_sales_view, admin_decisions_view, admin_outcomes_view, 
    admin_reports_view, admin_users_view
)
from .staff_views import staff_dashboard_view, staff_rabbits_view, staff_feeding_view

__all__ = [
    'home_view', 'index_view',
    'login_view', 'logout_view', 'register_view', 'profile_view', 'change_password_view',
    'admin_dashboard_view', 'admin_rabbits_view', 'admin_feeding_view',
    'admin_breeding_view', 'admin_health_view', 'admin_growth_view',
    'admin_sales_view', 'admin_decisions_view', 'admin_outcomes_view',
    'admin_reports_view', 'admin_users_view',
    'staff_dashboard_view', 'staff_rabbits_view', 'staff_feeding_view'
]
