import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration class"""

    # Secret key
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'

    # Session
    SESSION_TYPE = os.environ.get('SESSION_TYPE', 'filesystem')
    SESSION_FILE_DIR = os.environ.get('SESSION_FILE_DIR', './flask_session')
    SESSION_PERMANENT = False
    SESSION_USE_SIGNER = True

    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        f"postgresql://{os.environ.get('DB_USER', 'postgres')}:" \
        f"{os.environ.get('DB_PASSWORD', '')}@" \
        f"{os.environ.get('DB_HOST', 'localhost')}:" \
        f"{os.environ.get('DB_PORT', '5432')}/" \
        f"{os.environ.get('DB_NAME', 'myapp')}"

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 280,
        'pool_pre_ping': True,
        'pool_size': 10,
        'max_overflow': 20
    }

    SQLALCHEMY_ECHO = os.environ.get('SQLALCHEMY_ECHO', 'False').lower() == 'true'

    # Mail
    MAIL_SERVER   = os.environ.get('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT     = int(os.environ.get('MAIL_PORT', 465))
    MAIL_USE_SSL  = True
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')

    # JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'

    # SMS — TextSMS
    TEXTSMS_API_KEY    = os.environ.get('TEXTSMS_API_KEY')
    TEXTSMS_PARTNER_ID = os.environ.get('TEXTSMS_PARTNER_ID')
    TEXTSMS_SENDER_ID  = os.environ.get('TEXTSMS_SENDER_ID')

    # SMS — Africa's Talking
    AT_API_KEY   = os.environ.get('AT_API_KEY')
    AT_USERNAME  = os.environ.get('AT_USERNAME')

    # Admin seed credentials
    ADMIN_EMAIL    = os.environ.get('ADMIN_EMAIL')
    ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD')
    ADMIN_NAME     = os.environ.get('ADMIN_NAME')


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG         = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG           = False
    SQLALCHEMY_ECHO = False


class TestingConfig(Config):
    """Testing configuration"""
    TESTING                 = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    SESSION_TYPE            = 'filesystem'


config = {
    'development' : DevelopmentConfig,
    'production'  : ProductionConfig,
    'testing'     : TestingConfig,
    'default'     : DevelopmentConfig
}