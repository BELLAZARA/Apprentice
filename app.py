import os
from flask import Flask
from flask_login import LoginManager
from config import config
from database import db, migrate

login_manager = LoginManager()

def create_app(config_name=None):
    """
    Flask application factory

    Args:
        config_name: Configuration name ('development', 'production', 'testing')
                    If None, uses FLASK_ENV environment variable or 'default'

    Returns:
        Flask application instance
    """
    app = Flask(__name__)

    # Determine configuration
    if config_name is None:
        config_name = os.environ.get('FLASK_ENV', 'default')

    # Load configuration
    app.config.from_object(config[config_name])

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)

    # Initialize Flask-Login
    login_manager.init_app(app)
    login_manager.login_view = 'auth.login'
    login_manager.login_message = 'Please log in to access this page.'
    login_manager.login_message_category = 'warning'

    # Import models and register user_loader
    with app.app_context():
        from models import User

        @login_manager.user_loader
        def load_user(user_id):
            return User.query.get(int(user_id))

    # Register blueprints
    from routes.admin import admin_bp
    from routes.auth import auth_bp
    app.register_blueprint(admin_bp)
    app.register_blueprint(auth_bp)

    return app


# Create app instance for Flask CLI commands
app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    app.run(host='0.0.0.0', port=port, debug=debug)