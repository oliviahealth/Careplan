from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database import MaternalMedicalHistory, db, User
from datetime import datetime, timezone

medical_history_bp = Blueprint('maternal_medical_history', __name__)

@medical_history_bp.route('/add_maternal_medical_history', methods=['POST'])
@jwt_required()
def add_medical_history():
    """
    Create a maternal_medical_history record for a user

    Request JSON Parameters:
        user_id (string)
        gestational_age (Integer)
        anticipated_delivery_date (Date)
        planned_mode_delivery (string)
        actual_mode_delivery (string)
        attended_postpartum_visit (string)
        postpartum_visit_location (string)
        postpartum_visit_date = (Date)
        total_num_pregnancies (Integer) 
        total_num_live_births (Integer)
        total_num_children_with_mother (Integer)
        prior_complications (string)
        med_problems_diagnosis (string)
        current_medication_list [
            {
                name: string
                dose: string
                prescriber: string
                notes: string
            }
        ] || []
        notes (string)

    Returns:
        - If successful, adds and returns the user's new medical history.
        - If medical history from this user already exists, returns error messsage with error code 400.
        - If there is an unexpected error, returns error message with the error code 500.
    """
    data = request.get_json()

    user_id = get_jwt_identity()
    
    gestational_age = data.get('gestational_age')
    anticipated_delivery_date = data.get('anticipated_delivery_date')
    planned_mode_delivery = data.get('planned_mode_delivery')
    actual_mode_delivery = data.get('actual_mode_delivery')
    attended_postpartum_visit = data.get('attended_postpartum_visit')
    postpartum_visit_location = data.get('postpartum_visit_location')
    postpartum_visit_date = data.get('postpartum_visit_date')
    total_num_pregnancies = data.get('total_num_pregnancies')
    total_num_live_births = data.get('total_num_live_births')
    total_num_children_with_mother = data.get('total_num_children_with_mother')
    prior_complications = data.get('prior_complications')
    med_problems_diagnosis = data.get('med_problems_diagnosis')
    current_medication_list = data.get('current_medication_list')
    notes = data.get('notes')

    try:
        user = db.session.query(User).filter_by(id=user_id).first()

        if not user:
            return jsonify("User not found."), 404

        new_maternal_medical_history = MaternalMedicalHistory(
            user_id=user_id,
            gestational_age=gestational_age,
            anticipated_delivery_date=anticipated_delivery_date,
            planned_mode_delivery=planned_mode_delivery,
            actual_mode_delivery=actual_mode_delivery,
            attended_postpartum_visit=attended_postpartum_visit,
            postpartum_visit_location=postpartum_visit_location,
            postpartum_visit_date=postpartum_visit_date,
            total_num_pregnancies=total_num_pregnancies,
            total_num_live_births=total_num_live_births,
            total_num_children_with_mother=total_num_children_with_mother,
            prior_complications=prior_complications,
            med_problems_diagnosis=med_problems_diagnosis,
            current_medication_list=current_medication_list,
            notes=notes,
            date_created=datetime.now(timezone.utc),
            date_last_modified=datetime.now(timezone.utc)
        )

        db.session.add(new_maternal_medical_history)
        db.session.commit()

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify({
        "id": new_maternal_medical_history.id,
        "user_id": new_maternal_medical_history.user_id,
        "gestational_age": new_maternal_medical_history.gestational_age,
        "anticipated_delivery_date": new_maternal_medical_history.anticipated_delivery_date,
        "planned_mode_delivery": new_maternal_medical_history.planned_mode_delivery,
        "actual_mode_delivery": new_maternal_medical_history.actual_mode_delivery,
        "attended_postpartum_visit": new_maternal_medical_history.attended_postpartum_visit,
        "postpartum_visit_location": new_maternal_medical_history.postpartum_visit_location,
        "postpartum_visit_date": new_maternal_medical_history.postpartum_visit_date,
        "total_num_pregnancies": new_maternal_medical_history.total_num_pregnancies,
        "total_num_live_births": new_maternal_medical_history.total_num_live_births,
        "total_num_children_with_mother": new_maternal_medical_history.total_num_children_with_mother,
        "prior_complications": new_maternal_medical_history.prior_complications,
        "med_problems_diagnosis": new_maternal_medical_history.med_problems_diagnosis,
        "current_medication_list": new_maternal_medical_history.current_medication_list,
        "notes": new_maternal_medical_history.notes,
        "date_created": new_maternal_medical_history.date_created,
        "date_last_modified": new_maternal_medical_history.date_last_modified
    }), 201

@medical_history_bp.route('/get_maternal_medical_history', methods = ['GET'])
@medical_history_bp.route('/get_maternal_medical_history/<id>', methods = ['GET'])
@jwt_required()
def get_medical_history(id=None):
    """
        Get a maternal_medical_history record
        
    Returns:
        - If successful, returns the results of a user's maternal medical history form.
        - If the medical history does not exist, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        user = db.session.query(User).filter_by(id=user_id).first()

        if not user:
            return jsonify("User not found."), 404
        
        if id:
            maternal_medical_history = db.session.query(MaternalMedicalHistory).filter_by(user_id=user_id, id=id).first()
            
            if(not maternal_medical_history):
                return jsonify("Invalid maternal_medical_history id"), 400

            return jsonify({
                "id": maternal_medical_history.id,
                "user_id": maternal_medical_history.user_id,
                "gestational_age": maternal_medical_history.gestational_age,
                "anticipated_delivery_date": maternal_medical_history.anticipated_delivery_date,
                "planned_mode_delivery": maternal_medical_history.planned_mode_delivery,
                "actual_mode_delivery": maternal_medical_history.actual_mode_delivery,
                "attended_postpartum_visit": maternal_medical_history.attended_postpartum_visit,
                "postpartum_visit_location": maternal_medical_history.postpartum_visit_location,
                "postpartum_visit_date": maternal_medical_history.postpartum_visit_date,
                "total_num_pregnancies": maternal_medical_history.total_num_pregnancies,
                "total_num_live_births": maternal_medical_history.total_num_live_births,
                "total_num_children_with_mother": maternal_medical_history.total_num_children_with_mother,
                "prior_complications": maternal_medical_history.prior_complications,
                "med_problems_diagnosis": maternal_medical_history.med_problems_diagnosis,
                "current_medication_list": maternal_medical_history.current_medication_list,
                "notes": maternal_medical_history.notes,
                "date_created": maternal_medical_history.date_created,
                "date_last_modified": maternal_medical_history.date_last_modified
            }), 200
            
        else:
            maternal_medical_history = db.session.query(MaternalMedicalHistory).filter_by(user_id=user_id).all()

            if not maternal_medical_history:
                return jsonify([]), 200

            maternal_medical_history_list = [{
                "id": record.id,
                "user_id": record.user_id,
                "gestational_age": record.gestational_age,
                "anticipated_delivery_date": record.anticipated_delivery_date,
                "planned_mode_delivery": record.planned_mode_delivery,
                "actual_mode_delivery": record.actual_mode_delivery,
                "attended_postpartum_visit": record.attended_postpartum_visit,
                "postpartum_visit_location": record.postpartum_visit_location,
                "postpartum_visit_date": record.postpartum_visit_date,
                "total_num_pregnancies": record.total_num_pregnancies,
                "total_num_live_births": record.total_num_live_births,
                "total_num_children_with_mother": record.total_num_children_with_mother,
                "prior_complications": record.prior_complications,
                "med_problems_diagnosis": record.med_problems_diagnosis,
                "current_medication_list": record.current_medication_list,
                "notes": record.notes,
                "date_created": record.date_created,
                "date_last_modified": record.date_last_modified
            } for record in maternal_medical_history]

            return jsonify(maternal_medical_history_list), 200
            
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

@medical_history_bp.route('/update_maternal_medical_history/<id>', methods=['PUT'])
@jwt_required()
def update_medical_history(id):
    """
    Updates a maternal_medical_history record. 

    Request JSON Parameters:
        user_id (string)
        gestational_age (Integer)
        anticipated_delivery_date (Date)
        planned_mode_delivery (string)
        actual_mode_delivery (string)
        attended_postpartum_visit (Boolean)
        postpartum_visit_location (string)
        postpartum_visit_date = (Date)
        total_num_pregnancies (Integer) 
        total_num_live_births (Integer)
        total_num_children_with_mother (Integer)
        prior_complications (string)
        med_problems_diagnosis (string)
        current_medication_list [
            {
                name: string
                dose: string
                prescriber: string
                notes: string
            }
        ] || []
        notes (string)

    Returns:
        - If successful, updates and returns a user's maternal_medical_history form.
        - If there is no medical history in the database, returns a message with error 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    data = request.get_json()

    user_id = get_jwt_identity()
    
    gestational_age = data.get('gestational_age')
    anticipated_delivery_date = data.get('anticipated_delivery_date')
    planned_mode_delivery = data.get('planned_mode_delivery')
    actual_mode_delivery = data.get('actual_mode_delivery')
    attended_postpartum_visit = data.get('attended_postpartum_visit')
    postpartum_visit_location = data.get('postpartum_visit_location')
    postpartum_visit_date = data.get('postpartum_visit_date')
    total_num_pregnancies = data.get('total_num_pregnancies')
    total_num_live_births = data.get('total_num_live_births')
    total_num_children_with_mother = data.get('total_num_children_with_mother')
    prior_complications = data.get('prior_complications')
    med_problems_diagnosis = data.get('med_problems_diagnosis')
    current_medication_list = data.get('current_medication_list')
    notes = data.get('notes')

    try:
        maternal_medical_history = db.session.query(
            MaternalMedicalHistory).filter_by(user_id=user_id, id=id).first()

        if not maternal_medical_history:
            return jsonify("Maternal medical history does not exist."), 400

        maternal_medical_history.gestational_age = gestational_age
        maternal_medical_history.anticipated_delivery_date = anticipated_delivery_date
        maternal_medical_history.planned_mode_delivery = planned_mode_delivery
        maternal_medical_history.actual_mode_delivery = actual_mode_delivery
        maternal_medical_history.attended_postpartum_visit = attended_postpartum_visit
        maternal_medical_history.postpartum_visit_location = postpartum_visit_location
        maternal_medical_history.postpartum_visit_date = postpartum_visit_date
        maternal_medical_history.total_num_pregnancies = total_num_pregnancies
        maternal_medical_history.total_num_live_births = total_num_live_births
        maternal_medical_history.total_num_children_with_mother = total_num_children_with_mother
        maternal_medical_history.prior_complications = prior_complications
        maternal_medical_history.med_problems_diagnosis = med_problems_diagnosis
        maternal_medical_history.current_medication_list = current_medication_list
        maternal_medical_history.notes = notes
        maternal_medical_history.date_last_modified = datetime.now(timezone.utc)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify({
        "id": maternal_medical_history.id,
        "user_id": maternal_medical_history.user_id,
        "gestational_age": maternal_medical_history.gestational_age,
        "anticipated_delivery_date": maternal_medical_history.anticipated_delivery_date,
        "planned_mode_delivery": maternal_medical_history.planned_mode_delivery,
        "actual_mode_delivery": maternal_medical_history.actual_mode_delivery,
        "attended_postpartum_visit": maternal_medical_history.attended_postpartum_visit,
        "postpartum_visit_location": maternal_medical_history.postpartum_visit_location,
        "postpartum_visit_date": maternal_medical_history.postpartum_visit_date,
        "total_num_pregnancies": maternal_medical_history.total_num_pregnancies,
        "total_num_live_births": maternal_medical_history.total_num_live_births,
        "total_num_children_with_mother": maternal_medical_history.total_num_children_with_mother,
        "prior_complications": maternal_medical_history.prior_complications,
        "med_problems_diagnosis": maternal_medical_history.med_problems_diagnosis,
        "current_medication_list": maternal_medical_history.current_medication_list,
        "notes": maternal_medical_history.notes,
        "date_created": maternal_medical_history.date_created,
        "date_last_modified": maternal_medical_history.date_last_modified
    })


"""
    Deletes a maternal_medical_history record. 
    
    Request JSON Parameters:
        - user_id (string)

    Returns:
        - If successful, deletes the user's medical history and returns a confirmation message.
        - If there is no medical history for this user, returns a message with error code 400.
        - If there is an unexpected error, returns an error message with the error code 500.
"""


@medical_history_bp.route('/delete_maternal_medical_history/<id>', methods=['DELETE'])
@jwt_required()
def delete_medical_history(id):

    """
    Deletes a user's maternal maternal medical history. 

    Request JSON Parameters:
        - id (string)

    Returns:
        - If successful, deletes the user's maternal medical history for this form and returns a confirmation message.
        - If there is no maternal medical history for this user in the database, returns a message with error code 400.
        - If there is an unexpected error, returns an error message with the error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        maternal_medical_history = db.session.query(
            MaternalMedicalHistory).filter_by(user_id=user_id, id=id).first()

        if not maternal_medical_history:
            return jsonify('Maternal medical history does not exist.'), 400

        db.session.delete(maternal_medical_history)
        db.session.commit()

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    return jsonify("Medical history deleted."), 200
