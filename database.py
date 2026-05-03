from flask_sqlalchemy import SQLAlchemy

from flask_migrate import Migrate



# Initialize SQLAlchemy

db = SQLAlchemy()



# Initialize Flask-Migrate

migrate = Migrate()





def init_db(app):

    """

    Initialize database with the Flask app

    

    Args:

        app: Flask application instance

    """

    db.init_app(app)

    migrate.init_app(app, db)

    

    with app.app_context():

        # Import all models to ensure they're registered with SQLAlchemy

        from models import User, Staff, Project, Payment, ResearchField

        

        # Create all tables (only use this in development, use migrations in production)

        # db.create_all()

        

    return db