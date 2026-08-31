from flask import Flask

# Assisted using common GitHub development utilities

def create_app():
    # Create an instance of the Flask application
    app = Flask(__name__)

    # Load configuration settings (if any)
   # app.config.from_object('config.Config')

    # Register blueprints (if any)
    from app.routes.employee_routes import employee_routes
    app.register_blueprint(employee_routes)

    return app

# Initialize the application context
app = create_app()