from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from database import FamilyAndSupports, db, User
from datetime import datetime, timezone

family_and_supports_bp = Blueprint('family_and_supports', __name__, url_prefix = '/api')

@family_and_supports_bp.route('/add_family_and_supports', methods = ['POST'])
@jwt_required()
def add_family_and_supports():
    """
    Adds a record of user's family and supports to the database.
    
    Request JSON Parameters:
        - user_id (str)
        - people_living_in_home: [
            {
                person (str)
                date_of_birth (str)
                relation (str)
            } 
        ] | []
        - clients_children_not_living_in_home: [
            {
	            person: (str)
	            date_of_birth (str)
	            caregiver (str)
                cargiver_number (str)
            }
        ] || []
        - current_support_system: string
        - strength_of_client_and_support_system: string
        - . string
        - notes string
        
    Returns:
        - If successful, adds and returns the user's family and supports.
        - If the user doesn't exist or user's family and supports already exists, returns error code 400.
        - If there is an error processing the request, returns error code 500.    
    """
    data = request.get_json()
    
    user_id = get_jwt_identity()
    
    people_living_in_home = data.get('people_living_in_home')
    clients_children_not_living_in_home = data.get('clients_children_not_living_in_home')
    current_support_system = data.get('current_support_system')
    strength_of_client_and_support_system = data.get('strength_of_client_and_support_system')
    goals = data.get('goals')
    notes = data.get('notes')
    
    try:
        user = User.query.filter_by(id=user_id).first()

        if(not user):
            return jsonify({ 'Error': 'Invalid user_id' }), 404
        
        new_family_and_supports = FamilyAndSupports(
            user_id=user_id,
            people_living_in_home=people_living_in_home,
            clients_children_not_living_in_home=clients_children_not_living_in_home,
            current_support_system=current_support_system,
            strength_of_client_and_support_system=strength_of_client_and_support_system,
            goals=goals,
            notes=notes,
            date_created=datetime.now(timezone.utc),
            date_last_modified=datetime.now(timezone.utc)
        )
        
        db.session.add(new_family_and_supports)
        db.session.commit()
        
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({
        "id": new_family_and_supports.id,
        "user_id": new_family_and_supports.user_id,
        "people_living_in_home": new_family_and_supports.people_living_in_home,
        "clients_children_not_living_in_home": new_family_and_supports.clients_children_not_living_in_home,
        "current_support_system": new_family_and_supports.current_support_system,
        "strength_of_client_and_support_system": new_family_and_supports.strength_of_client_and_support_system,
        "goals": new_family_and_supports.goals,
        "notes": new_family_and_supports.notes,
        "date_created": new_family_and_supports.date_created,
        "date_last_modified": new_family_and_supports.date_last_modified
    }), 201
    
@family_and_supports_bp.route('/get_family_and_supports', methods=['GET'])
@family_and_supports_bp.route('/get_family_and_supports/<id>', methods=['GET'])
@jwt_required()
def get_family_and_supports_bp(id=None):
    """
    Get a family_and_supports record.
    
    Request JSON Parameters:
        - user_id (string)
    
    Returns:
        - If successful, returns a user's family_and_supports record.
        - If the family_and_supports does not exist in the database, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return jsonify("This user does not exist."), 400

        if id:
            family_and_supports = db.session.query(FamilyAndSupports).filter_by(user_id=user_id, id=id).first()
            
            if(not family_and_supports):
                return jsonify("Invalid family_and_supports id"), 400

            return jsonify({
                "id": family_and_supports.id,
                "user_id": family_and_supports.user_id,
                "people_living_in_home": family_and_supports.people_living_in_home,
                "clients_children_not_living_in_home": family_and_supports.clients_children_not_living_in_home,
                "current_support_system": family_and_supports.current_support_system,
                "strength_of_client_and_support_system": family_and_supports.strength_of_client_and_support_system,
                "goals": family_and_supports.goals,
                "notes": family_and_supports.notes,
                "date_created": family_and_supports.date_created,
                "date_last_modified": family_and_supports.date_last_modified
            }), 200
            
        else:
            family_and_supports = db.session.query(FamilyAndSupports).filter_by(user_id=user_id).all()

            if not family_and_supports:
                return jsonify([]), 200

            family_and_supports_list = [{
                "id": record.id,
                "user_id": record.user_id,
                "people_living_in_home": record.people_living_in_home,
                "clients_children_not_living_in_home": record.clients_children_not_living_in_home,
                "current_support_system": record.current_support_system,
                "strength_of_client_and_support_system": record.strength_of_client_and_support_system,
                "goals": record.goals,
                "notes": record.notes,
                "date_created": record.date_created,
                "date_last_modified": record.date_last_modified
            } for record in family_and_supports]

            return jsonify(family_and_supports_list), 200
            
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
@family_and_supports_bp.route('/update_family_and_supports/<id>', methods = ['PUT'])
@jwt_required()
def update_family_and_supports(id):
    """
    Updates a record of user's family and supports to the database.
    
    Request JSON Parameters:
        - user_id (str)
        - people_living_in_home: {
            person (str)
            date_of_birth (str)
            relation (str)
        }
        - clients_children_not_living_in_home: {
	        person: (str)
	        date_of_birth (str)
	        caregiver_and_contact_number (str)
        }
        - current_support_system (arr)
        - strength_of_client_and_support_system (string)
        - goals (arr)
        - notes (str)
        
    Returns:
        - If successful, updates and returns the user's family and supports.
        - If the user doesn't exist or user's family and supports already exists, returns error code 400.
        - If there is an error processing the request, returns error code 500.    
    """
    data = request.get_json()
    
    user_id = get_jwt_identity()
    
    people_living_in_home = data.get('people_living_in_home')
    clients_children_not_living_in_home = data.get('clients_children_not_living_in_home')
    current_support_system = data.get('current_support_system')
    strength_of_client_and_support_system = data.get('strength_of_client_and_support_system')
    goals = data.get('goals')
    notes = data.get('notes')
    
    try:
        user = User.query.filter_by(id=user_id).first()

        if(not user):
            return jsonify({ 'Error': 'Invalid user_id' }), 403
        
        family_and_supports = db.session.query(FamilyAndSupports).filter_by(user_id=user_id, id=id).first()

        if not family_and_supports:
            return jsonify("This user does not exist."), 400
        
        family_and_supports.user_id=user_id
        family_and_supports.people_living_in_home=people_living_in_home
        family_and_supports.clients_children_not_living_in_home=clients_children_not_living_in_home
        family_and_supports.current_support_system=current_support_system
        family_and_supports.strength_of_client_and_support_system=strength_of_client_and_support_system
        family_and_supports.goals=goals
        family_and_supports.notes=notes
        family_and_supports.date_last_modified=datetime.now(timezone.utc)
        db.session.commit()
        
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({
        "id": family_and_supports.id,
        "user_id": family_and_supports.user_id,
        "people_living_in_home": family_and_supports.people_living_in_home,
        "clients_children_not_living_in_home": family_and_supports.clients_children_not_living_in_home,
        "current_support_system": family_and_supports.current_support_system,
        "strength_of_client_and_support_system": family_and_supports.strength_of_client_and_support_system,
        "goals": family_and_supports.goals,
        "notes": notes,
        "date_created": family_and_supports.date_created,
        "date_last_modified": family_and_supports.date_last_modified
    }), 200
    
@family_and_supports_bp.route('/delete_family_and_supports/<id>', methods = ['DELETE'])
@jwt_required()
def delete_family_and_supports(id):
    """
    Deletes a family_and_supports record.
    
    Request JSON Parameters:
        - user_id (string)
    
    Returns:
        - If successful, deletes a user's family_and_supports record.
        - If the family_and_supports does not exist in the database, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        family_and_supports = FamilyAndSupports.query.filter_by(user_id=user_id, id=id).first()

        db.session.delete(family_and_supports)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request"), 500

    return jsonify("family_and_supports record deleted."), 200