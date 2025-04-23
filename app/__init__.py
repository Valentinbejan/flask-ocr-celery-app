# app/__init__.py
from flask import Flask
from .celery_utils import create_celery

def create_app():
    app = Flask(__name__)
    app.config['CELERY_BROKER_URL'] = 'redis://redis:6379/0'
    app.config['CELERY_RESULT_BACKEND'] = 'redis://redis:6379/0'

    # Create celery instance using the factory function
    celery = create_celery(app)

    # Register the blueprint before creating the app object
    from .views import main as main_blueprint
    app.register_blueprint(main_blueprint)

    return app

app = create_app()  # Create the app instance outside the function