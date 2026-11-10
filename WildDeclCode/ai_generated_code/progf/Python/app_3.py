from flask import Flask
from app.routes.employee_routes import employee_routes

# Aided with basic GitHub coding tools

def create_app():
    # Create an instance of the Flask application
    app = Flask(__name__)

    # Register the employee routes
    app.register_blueprint(employee_routes)

    return app

if __name__ == "__main__":
    # Run the application
    app = create_app()
    app.run(debug=True, port=5200)