from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..database import User, db, PsychiatricHistory
from datetime import datetime, timezone

psychiatric_history_bp = Blueprint('psychiatric_history', __name__, url_prefix = '/api')

@psychiatric_history_bp.route('/add_psychiatric_history', methods = ['POST'])
@jwt_required()
def add_psychiatric_history():
    """
    Adds a record of the user's psychiatric history to the User table in the db.
    
    Request JSON Parameters:
        - user_id (str)
        - diagnosis [
            {
                provider (string)
                phone_number (string)
                diagnosis (string)
                date_of_diagnosis (string)
                taking_medication (boolean)
            }
        ] || []
        - notes (str)
    
    Returns:
        - If successful, adds and returns the user's psychiatric history.
        - If the user doesn't exist or user's psychiatric history already exists, returns error code 400.
        - If there is an error processing the request, returns error code 500.
    """
    data = request.get_json()
    user_id = get_jwt_identity()
    diagnosis = data.get('diagnosis')
    notes = data.get('notes')
    
    try:
        user = User.query.filter_by(id=user_id).first()
        
        if not user:
            return jsonify("This user does not exist."), 400
        
        new_pscyhiatric_history = PsychiatricHistory(
            user_id=user_id,
            diagnosis=diagnosis,
            notes=notes,
            date_created=datetime.now(timezone.utc),
            date_last_modified=datetime.now(timezone.utc)
        )
        db.session.add(new_pscyhiatric_history)
        db.session.commit()

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({
        "id": new_pscyhiatric_history.id, 
        "user_id": new_pscyhiatric_history.user_id,
        "diagnosis": new_pscyhiatric_history.diagnosis,
        "notes": new_pscyhiatric_history.notes,
        "date_created": new_pscyhiatric_history.date_created,
        "date_last_modified": new_pscyhiatric_history.date_last_modified
    }), 201

@psychiatric_history_bp.route('/update_psychiatric_history/<id>', methods = ['PUT'])
@jwt_required()
def update_psychiatric_history(id):
    """
    Updates a record of the user's psychiatric history to the User table in the db.
    
    Request JSON Parameters:
        - user_id (str)
        - diagnosis [
            {
                provider (string)
                phone_number (string)
                diagnosis (string)
                date_of_diagnosis (string)
                taking_medication (boolean)
            }
        ] || []
        - notes (str)
    
    Returns:
        - If successful, updates and returns the user's psychiatric history.
        - If the user doesn't exist, returns error code 400.
        - If there is an error processing the request, returns error code 500.
    """
    data = request.get_json()
    user_id = get_jwt_identity()
    diagnosis = data.get('diagnosis')
    notes = data.get('notes')
    
    try:
        psychiatric_history = db.session.query(PsychiatricHistory).filter_by(user_id=user_id, id=id).first()

        if not psychiatric_history:
            return jsonify("psychiatric_history record does not exist."), 400

        psychiatric_history.diagnosis = diagnosis
        psychiatric_history.notes = notes
        psychiatric_history.date_last_modified=datetime.now(timezone.utc)
        db.session.commit()

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({
        "id": psychiatric_history.id, 
        "user_id": psychiatric_history.user_id,
        "diagnosis": psychiatric_history.diagnosis,
        "notes": psychiatric_history.notes,
        "date_created": psychiatric_history.date_created,
        "date_last_modified": psychiatric_history.date_last_modified
    }), 200
    
@psychiatric_history_bp.route('/get_psychiatric_history', methods = ['GET'])
@psychiatric_history_bp.route('/get_psychiatric_history/<id>', methods = ['GET'])
@jwt_required()
def get_psychiatric_history(id=None):
    """
    Gets a record of the user's psychiatric history from the User table in the db.
    
    Request JSON Parameters:
        - user_id (str)
    
    Returns:
        - If successful, returns the user's psychiatric history.
        - If the user or the psychiatric history doesn't exist, returns error code 400.
        - If there is an error processing the request, returns error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        user = db.session.query(User).filter_by(id=user_id).first()

        if not user:
            return jsonify("User not found."), 404
        
        if id:
            psychiatric_history = db.session.query(PsychiatricHistory).filter_by(user_id=user_id, id=id).first()
            
            if(not psychiatric_history):
                return jsonify("Invalid psychiatric_history id"), 400

            return jsonify({
                "id": psychiatric_history.id, 
                "user_id": psychiatric_history.user_id,
                "diagnosis": psychiatric_history.diagnosis,
                "notes": psychiatric_history.notes,
                "date_created": psychiatric_history.date_created,
                "date_last_modified": psychiatric_history.date_last_modified
            }), 200
            
        else:
            psychiatric_history = db.session.query(PsychiatricHistory).filter_by(user_id=user_id).all()

            if not psychiatric_history:
                return jsonify([]), 200

            psychiatric_history_list = [{
                "id": record.id, 
                "user_id": record.user_id,
                "diagnosis": record.diagnosis,
                "notes": record.notes,
                "date_created": record.date_created,
                "date_last_modified": record.date_last_modified
            } for record in psychiatric_history]

            return jsonify(psychiatric_history_list), 200
            
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
@psychiatric_history_bp.route('/delete_psychiatric_history/<id>', methods = ['DELETE'])
@jwt_required()
def delete_psychiatric_history(id):
    """
    Deletes a record of the user's psychiatric history from the User table in the db.
    
    Request JSON Parameters:
        - user_id (str)
    
    Returns:
        - If successful, deletes the user's psychiatric history.
        - If the psychiatric history doesn't exist returns error code 400.
        - If there is an error processing the request, returns error code 500.
    """
    user_id=get_jwt_identity()
    
    try:
        psychiatric_history = db.session.query(PsychiatricHistory).filter_by(user_id=user_id, id=id).first()
                
        if not psychiatric_history:
            return jsonify("This user does not exist"), 400

        db.session.delete(psychiatric_history)
        db.session.commit()
    
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify(f"Psychiatric history for this user deleted."), 200