from flask import Flask
from flask_cors import CORS
from .api.users import users_bp
from .api.maternal_demographics import maternal_demo_bp
from .api.maternal_medical_history import medical_history_bp
from .api.substance_use_history import substance_use_history_bp
from .api.medical_services_for_substance_use import medical_services_for_substance_use_bp
from .api.psychiatric_history import psychiatric_history_bp
from .api.referrals_and_services import referrals_and_services_bp
from .api.infant_information import infant_information_bp
from .api.family_and_supports import family_and_supports_bp
from .api.drug_screening_results import drug_screening_results_bp
from .api.relapse_prevention_plan import relapse_prevention_plan_bp
from .database import db, bcrypt, revoked_tokens
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
from flask_migrate import Migrate
from datetime import timedelta

load_dotenv()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    
    register_blueprints(app)
    db.init_app(app)
    
    migrate = Migrate(app, db)

    CORS(app, supports_credentials=True)
    bcrypt.init_app(app)
    jwt = JWTManager(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        return jwt_payload["jti"] in revoked_tokens
    
    return app

def register_blueprints(app):
    app.register_blueprint(users_bp)
    app.register_blueprint(maternal_demo_bp)
    app.register_blueprint(medical_history_bp)
    app.register_blueprint(medical_services_for_substance_use_bp)
    app.register_blueprint(psychiatric_history_bp)
    app.register_blueprint(referrals_and_services_bp)
    app.register_blueprint(infant_information_bp)
    app.register_blueprint(family_and_supports_bp)
    app.register_blueprint(drug_screening_results_bp)
    app.register_blueprint(relapse_prevention_plan_bp)
    app.register_blueprint(substance_use_history_bp)

def create_all(app):
    with app.app_context():
        db.create_all()

app = create_app()
create_all(app)

if __name__ == "__main__":
    app.run(debug=True)
