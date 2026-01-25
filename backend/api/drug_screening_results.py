from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database import User, db, DrugScreeningResults
from datetime import datetime, timezone

drug_screening_results_bp = Blueprint('drug_screening_results', __name__)

@drug_screening_results_bp.route('/add_drug_screening_results', methods = ['POST'])
@jwt_required()
def add_drug_screening_results():
    """
    Adds a user's drug_screening_results record to the DrugScreeningResults table in the db.
    
    Request JSON Parameters:
        - user_id (str)
        - tests [
            {
                drug_name (string)
                date_collected (string)
                provider (string)
                provider_location (string)
                results (string)
                specify_results (string)
                provider_reviewed (string)
                date_reviewed (string)
            }
        ] || []
    
    Returns:
        - If successful, adds and returns the user's drug screening results.
        - If the user doesn't exist or user's drug screening results already exists, returns error code 400.
        - If there is an error processing the request, returns error code 500.
    """

    data = request.get_json()
    
    user_id = get_jwt_identity()
    
    tests = data.get('tests')
    
    try:
        user = User.query.filter_by(id=user_id).first()

        # Check if the user exists
        if not user:
            return jsonify("This user does not exist."), 400
        
        new_drug_screening_results = DrugScreeningResults(
            user_id=user_id,
            tests=tests,
            date_created=datetime.now(timezone.utc),
            date_last_modified=datetime.now(timezone.utc)
        )
        db.session.add(new_drug_screening_results)
        db.session.commit()


    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify({
        'id': new_drug_screening_results.id, 
        'user_id': new_drug_screening_results.user_id,
        'tests': new_drug_screening_results.tests,
        "date_created": new_drug_screening_results.date_created,
        "date_last_modified": new_drug_screening_results.date_last_modified
    }), 201

@drug_screening_results_bp.route('/update_drug_screening_results/<id>', methods = ['PUT'])
@jwt_required()
def update_drug_screening_results(id):
    """
    Updates a user's drug_screening_results record to the DrugScreeningResults table in the db.
    
    Request JSON Parameters:
        - user_id (str)
        - id (String)
        - tests [
            {
                drug_name (string)
                date_collected (string)
                provider (string)
                provider_location (string)
                results (string)
                specify_results (string)
                provider_reviewed (string)
                date_reviewed (string)
            }
        ] || []
    
    Returns:
        - If successful, updates and returns the user's drug screening results.
        - If the user doesn't exist, returns error code 400.
        - If there is an error processing the request, returns error code 500.
    """
    data = request.get_json()
    
    user_id = get_jwt_identity()
    
    tests = data.get('tests')

    try:
        
        drug_screening_results = db.session.query(DrugScreeningResults).filter_by(user_id=user_id, id=id).first()
        
        if not drug_screening_results:
            return("drug_screening_results record for this user does not exist.")

        drug_screening_results.tests = tests
        drug_screening_results.date_last_modified = datetime.now(timezone.utc)
        db.session.commit()

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify({
        'id': drug_screening_results.id, 
        'user_id': drug_screening_results.user_id,
        'tests': drug_screening_results.tests,
        'date_created': drug_screening_results.date_created,
        "date_last_modified": drug_screening_results.date_last_modified
    }), 200

@drug_screening_results_bp.route('/get_drug_screening_results', methods = ['GET'])
@drug_screening_results_bp.route('/get_drug_screening_results/<id>', methods = ['GET'])
@jwt_required()
def get_drug_screening_results(id=None):
    """
    Gets a record of the user's drug screening results from the DrugScreeningResults table in the db.
    
    Request JSON Parameters:
        - user_id (str)
    
    Returns:
        - If successful, returns the user's drug screening results.
        - If the user or the drug screening results doesn't exist, returns error code 400.
        - If there is an error processing the request, returns error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return jsonify("This user does not exist."), 400

        if id:
            drug_screening_results = db.session.query(DrugScreeningResults).filter_by(user_id=user_id, id=id).first()
            
            if(not drug_screening_results):
                return jsonify("Invalid drug screening results id"), 400
            
            return jsonify({
                'id': drug_screening_results.id, 
                'user_id': drug_screening_results.user_id,
                'tests': drug_screening_results.tests,
                "date_created": drug_screening_results.date_created,
                "date_last_modified": drug_screening_results.date_last_modified
            }), 200
            
        else:
            drug_screening_results = db.session.query(DrugScreeningResults).filter_by(user_id=user_id).all()

            if not drug_screening_results:
                return jsonify([]), 200

            drug_screening_results_list = [{
                'id': record.id, 
                'user_id': record.user_id,
                'tests': record.tests,
                "date_created": record.date_created,
                "date_last_modified": record.date_last_modified
            } for record in drug_screening_results]

            return jsonify(drug_screening_results_list), 200
        
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

@drug_screening_results_bp.route('/delete_drug_screening_results/<id>', methods = ['DELETE'])
@jwt_required()
def delete_drug_screening_results(id):
    """
    Deletes a user's drug_screening_results record from the DrugScreeningResults table in the db.
    
    Request JSON Parameters:
        - user_id (str)
    
    Returns:
        - If successful, deletes the user's drug screening results.
        - If the user's drug screening results record doesn't exist, returns error code 400.
        - If there is an error processing the request, returns error code 500.
    """
    user_id = get_jwt_identity()

    try:
        drug_screening_results = DrugScreeningResults.query.filter_by(user_id=user_id, id=id).first()

        if not drug_screening_results:
            return jsonify("drug_screening_results record for this user does not exist."), 400

        db.session.delete(drug_screening_results)
        db.session.commit()

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify(f"drug_screening_results record for this user deleted."), 200