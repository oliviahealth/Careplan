from flask import Blueprint, request, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..database import User, db, SubstanceUseHistory
from datetime import datetime, timezone

substance_use_history_bp = Blueprint('substance_use_history', __name__, url_prefix = '/api')

@substance_use_history_bp.route('/add_substance_use_history', methods = ['POST'])
@jwt_required()
def add_substance_use_history():
    """  
    Adds a record of substance_use_history for a user to the db.
    
    Format for JSONB columns:
    {
        ever_used (string)
        used_during_pregnancy (string)
        date_last_used (string)
        notes (string)
    }
      
    Request JSON Parameters:
        - user_id (String)
        - alcohol (JSONB)
        - cocaine (JSONB)
        - benzodiazepines (JSONB)
        - heroin (JSONB)
        - kush (JSONB)
        - marijuana (JSONB)
        - methamphetamine (JSONB)
        - prescription_drugs (JSONB)
        - tobacco (JSONB)
        - other_drugs (JSONB[])
        - notes (String)
    
    Returns:
        - If successful, adds and returns the user's new substance_use_history record.
        - If the substance_use_history record from this user already exists in the database, returns error messsage with error code 400.
        - If there is an unexpected error, returns error message with the error code 500.
    """
    data = request.get_json()
    
    user_id=get_jwt_identity()
    
    alcohol=data.get('alcohol')
    benzodiazepines=data.get('benzodiazepines')
    cocaine=data.get('cocaine')
    heroin=data.get('heroin')
    kush=data.get('kush')
    marijuana=data.get('marijuana')
    methamphetamine=data.get('methamphetamine')
    prescription_drugs=data.get('prescription_drugs')
    tobacco=data.get('tobacco')
    other_drugs=data.get('other_drugs')
    notes=data.get('notes')
    
    try:
        
        user = db.session.query(User).filter_by(id=user_id).first()
        
        if not user:
            return jsonify("User not found."), 404
        
        new_substance_use_history = SubstanceUseHistory(
            user_id=user_id,
            alcohol=alcohol,
            benzodiazepines=benzodiazepines,
            cocaine=cocaine,
            heroin=heroin,
            kush=kush,
            marijuana=marijuana,
            methamphetamine=methamphetamine,
            prescription_drugs=prescription_drugs,
            tobacco=tobacco,
            other_drugs=other_drugs,
            notes=notes,
            date_created=datetime.now(timezone.utc),
            date_last_modified=datetime.now(timezone.utc)
        )
        
        db.session.add(new_substance_use_history)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({
        "id": new_substance_use_history.id,
        "user_id": new_substance_use_history.user_id,
        "alcohol": new_substance_use_history.alcohol,
        "benzodiazepines": new_substance_use_history.benzodiazepines,
        "cocaine": new_substance_use_history.cocaine,
        "heroin": new_substance_use_history.heroin,
        "kush": new_substance_use_history.kush,
        "marijuana": new_substance_use_history.marijuana,
        "methamphetamine": new_substance_use_history.methamphetamine,
        "prescription_drugs": new_substance_use_history.prescription_drugs,
        "tobacco": new_substance_use_history.tobacco,
        "other_drugs": new_substance_use_history.other_drugs,
        "notes": new_substance_use_history.notes,
        "date_created": new_substance_use_history.date_created,
        "date_last_modified": new_substance_use_history.date_last_modified
    }), 201
    
@substance_use_history_bp.route('/update_substance_use_history/<id>', methods = ['PUT'])
@jwt_required()
def update_substance_use_history(id):
    """  
    Updates a record of substance_use_history for a user to the db.
    
    Format for JSONB columns:
    {
        ever_used (string)
        used_during_pregnancy (string)
        date_last_used (date)
        notes (string)
    }
      
    Request JSON Parameters:
        - user_id (String)
        - id (String)
        - alcohol (JSONB)
        - benzodiazepines (JSONB)
        - cocaine (JSONB)
        - heroin (JSONB)
        - kush (JSONB)
        - marijuana (JSONB)
        - methamphetamine (JSONB)
        - prescription_drugs (JSONB)
        - tobacco (JSONB)
        - other_drugs (JSONB[])
        - notes (String)
    
    Returns:
        - If successful, updates and returns the user's new substance_use_history record.
        - If the substance_use_history record from this user doesn't exist in the database, returns error messsage with error code 400.
        - If there is an unexpected error, returns error message with the error code 500.
    """
    data = request.get_json()
    
    user_id = get_jwt_identity()
    
    alcohol = data.get('alcohol')
    cocaine = data.get('cocaine')
    benzodiazepines = data.get('benzodiazepines')
    heroin = data.get('heroin')
    kush = data.get('kush')
    marijuana = data.get('marijuana')
    methamphetamine = data.get('methamphetamine')
    prescription_drugs = data.get('prescription_drugs')
    tobacco = data.get('tobacco')
    other_drugs = data.get('other_drugs')
    notes = data.get('notes')
    
    try:
        substance_use_history = db.session.query(SubstanceUseHistory).filter_by(user_id=user_id, id=id).first()

        if not substance_use_history:
            return jsonify("substance_use_history record for this user does not exist."), 400
        
        substance_use_history.alcohol=alcohol
        substance_use_history.benzodiazepines=benzodiazepines
        substance_use_history.cocaine=cocaine
        substance_use_history.heroin=heroin
        substance_use_history.kush=kush
        substance_use_history.marijuana=marijuana
        substance_use_history.methamphetamine=methamphetamine
        substance_use_history.prescription_drugs=prescription_drugs
        substance_use_history.tobacco=tobacco
        substance_use_history.other_drugs=other_drugs
        substance_use_history.notes=notes
        substance_use_history.date_last_modified=datetime.now(timezone.utc)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({
        "id": substance_use_history.id,
        "user_id": substance_use_history.user_id,
        "alcohol": substance_use_history.alcohol,
        "benzodiazepines": substance_use_history.benzodiazepines,
        "cocaine": substance_use_history.cocaine,
        "heroin": substance_use_history.heroin,
        "kush": substance_use_history.kush,
        "marijuana": substance_use_history.marijuana,
        "methamphetamine": substance_use_history.methamphetamine,
        "prescription_drugs": substance_use_history.prescription_drugs,
        "tobacco": substance_use_history.tobacco,
        "other_drugs": substance_use_history.other_drugs,
        "notes": substance_use_history.notes,
        "date_created": substance_use_history.date_created,
        "date_last_modified": substance_use_history.date_last_modified
    }), 200
    
@substance_use_history_bp.route('/get_substance_use_history', methods = ['GET'])
@substance_use_history_bp.route('/get_substance_use_history/<id>', methods = ['GET'])
@jwt_required()
def get_substance_use_history(id=None):
    """
    Gets a substance_use_history record for the user.
    
    Returns:
        - If successful, returns a user's substance_use_history record.
        - If the substance_use_history does not exist in the database, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        user = db.session.query(User).filter_by(id=user_id).first()

        if not user:
            return jsonify("User not found."), 404
        
        if id:
            substance_use_history = db.session.query(SubstanceUseHistory).filter_by(user_id=user_id, id=id).first()
            
            if(not substance_use_history):
                return jsonify("Invalid substance_use_history id"), 400

            return jsonify({
                "id": substance_use_history.id,
                "user_id": substance_use_history.user_id,
                "alcohol": substance_use_history.alcohol,
                "benzodiazepines": substance_use_history.benzodiazepines,
                "cocaine": substance_use_history.cocaine,
                "heroin": substance_use_history.heroin,
                "kush": substance_use_history.kush,
                "marijuana": substance_use_history.marijuana,
                "methamphetamine": substance_use_history.methamphetamine,
                "prescription_drugs": substance_use_history.prescription_drugs,
                "tobacco": substance_use_history.tobacco,
                "other_drugs": substance_use_history.other_drugs,
                "notes": substance_use_history.notes,
                "date_created": substance_use_history.date_created,
                "date_last_modified": substance_use_history.date_last_modified
            }), 200
            
        else:
            substance_use_history = db.session.query(SubstanceUseHistory).filter_by(user_id=user_id).all()

            if not substance_use_history:
                return jsonify([]), 200

            substance_use_history_list = [{
                "id": record.id,
                "user_id": record.user_id,
                "alcohol": record.alcohol,
                "benzodiazepines": record.benzodiazepines,
                "cocaine": record.cocaine,
                "heroin": record.heroin,
                "kush": record.kush,
                "marijuana": record.marijuana,
                "methamphetamine": record.methamphetamine,
                "prescription_drugs": record.prescription_drugs,
                "tobacco": record.tobacco,
                "other_drugs": record.other_drugs,
                "notes": record.notes,
                "date_created": record.date_created,
                "date_last_modified": record.date_last_modified
            } for record in substance_use_history]

            return jsonify(substance_use_history_list), 200
        
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
@substance_use_history_bp.route('/delete_substance_use_history/<id>', methods = ['DELETE'])
@jwt_required
def delete_substance_use_history(id):
    """
    Gets a substance_use_history record for the user.
    
    Request JSON Parameters:
        - user_id (string)
    
    Returns:
        - If successful, returns a user's substance_use_history record.
        - If the substance_use_history does not exist in the database, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        substance_use_history = db.session.query(SubstanceUseHistory).filter_by(user_id=user_id, id=id).first()
        
        if not substance_use_history:
            return jsonify("substance_use_history record for this user does not exist."), 400
        
        db.session.delete(substance_use_history)
        db.session.commit()
        
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
        
    return jsonify("substance_use_history record deleted."), 200