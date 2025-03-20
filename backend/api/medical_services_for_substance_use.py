from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database import MedicalServicesForSubstanceUse, db, User
from datetime import datetime, timezone

medical_services_for_substance_use_bp = Blueprint('medical_services_for_substance_use', __name__, url_prefix = '/api')

@medical_services_for_substance_use_bp.route('/add_medical_services_for_substance_use', methods = ['POST'])
@jwt_required()
def add_medical_services_for_substance_use():
    """
    Creates a medical_services_for_substance_use record for a user.

    Request JSON Parameters:
        - user_id (string)
        - mat_engaged (string)
        - date_used_mat (string)
        - medications [
            {
                medication: string
                dose: string
            }
        ] || []
        - mat_clinic_name (string)
        - mat_clinic_phone (string)
        - used_addiction_medicine_services (string)
        - date_used_medicine_service (string)
        - addiction_medicine_clinic (string)
        - addiction_medicine_clinic_phone (string)
    
    Returns:
        - If successful, adds and returns the user's new medical_services_for_substance_use record.
        - If medical_services_for_substance_use record for this user already exists, returns error message with error code 400.
        - If there is an unexpected error, returns error message with error code 500.
    """
    data = request.get_json()
    
    user_id = get_jwt_identity()
    
    mat_engaged = data.get('mat_engaged')
    date_used_mat = data.get('date_used_mat')
    medications = data.get('medications')
    mat_clinic_name = data.get('mat_clinic_name')
    mat_clinic_phone = data.get('mat_clinic_phone')
    used_addiction_medicine_services = data.get('used_addiction_medicine_services')
    date_used_medicine_service = data.get('date_used_medicine_service')
    addiction_medicine_clinic = data.get('addiction_medicine_clinic')
    addiction_medicine_clinic_phone = data.get('addiction_medicine_clinic_phone')
    
    try:
        
        user = db.session.query(User).filter_by(id=user_id).first()
        
        if not user:
            return jsonify("User not found."), 404
        
        new_medical_services_for_substance_use = MedicalServicesForSubstanceUse(
            user_id=user_id,
            mat_engaged=mat_engaged,
            date_used_mat=date_used_mat,
            medications=medications,
            mat_clinic_name=mat_clinic_name,
            mat_clinic_phone=mat_clinic_phone,
            used_addiction_medicine_services=used_addiction_medicine_services,
            date_used_medicine_service=date_used_medicine_service,
            addiction_medicine_clinic=addiction_medicine_clinic,
            addiction_medicine_clinic_phone=addiction_medicine_clinic_phone,
            date_created=datetime.now(timezone.utc),
            date_last_modified=datetime.now(timezone.utc)
        )
        
        db.session.add(new_medical_services_for_substance_use)
        db.session.commit()
        
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify({
        "id": new_medical_services_for_substance_use.id,
        "user_id": new_medical_services_for_substance_use.user_id,
        "mat_engaged": new_medical_services_for_substance_use.mat_engaged,
        "date_used_mat": new_medical_services_for_substance_use.date_used_mat,
        "medications": new_medical_services_for_substance_use.medications,
        "mat_clinic_name": new_medical_services_for_substance_use.mat_clinic_name,
        "mat_clinic_phone": new_medical_services_for_substance_use.mat_clinic_phone,
        "used_addiction_medicine_services": new_medical_services_for_substance_use.used_addiction_medicine_services,
        "date_used_medicine_service": new_medical_services_for_substance_use.date_used_medicine_service,
        "addiction_medicine_clinic": new_medical_services_for_substance_use.addiction_medicine_clinic,
        "addiction_medicine_clinic_phone": new_medical_services_for_substance_use.addiction_medicine_clinic_phone,
        "date_created": new_medical_services_for_substance_use.date_created,
        "date_last_modified": new_medical_services_for_substance_use.date_last_modified
    }), 201
    
@medical_services_for_substance_use_bp.route('/get_medical_services_for_substance_use', methods = ['GET'])
@medical_services_for_substance_use_bp.route('/get_medical_services_for_substance_use/<id>', methods = ['GET'])
@jwt_required()
def get_medical_services_for_substance_use(id=None):
    """
    Gets a medical_services_for_substance_use record for a user.

    Request JSON Parameters:
        - user_id (string)
    
    Returns:
        - If successful, gets and returns the user's new medical_services_for_substance_use record.
        - If medical_services_for_substance_use record for this user does not exist, returns error message with error code 404.
        - If there is an unexpected error, returns error message with error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        user = db.session.query(User).filter_by(id=user_id).first()

        if not user:
            return jsonify("User not found."), 404
        
        if id:
            medical_services_for_substance_use = db.session.query(MedicalServicesForSubstanceUse).filter_by(user_id=user_id, id=id).first()

            if(not medical_services_for_substance_use):
                return jsonify("Invalid medical_services_for_substance_use id"), 400
            
            return jsonify({
                "id":  medical_services_for_substance_use.id,
                "user_id":  medical_services_for_substance_use.user_id,
                "mat_engaged":  medical_services_for_substance_use.mat_engaged,
                "date_used_mat":  medical_services_for_substance_use.date_used_mat,
                "medications":  medical_services_for_substance_use.medications,
                "mat_clinic_name":  medical_services_for_substance_use.mat_clinic_name,
                "mat_clinic_phone": medical_services_for_substance_use.mat_clinic_phone,
                "used_addiction_medicine_services": medical_services_for_substance_use.used_addiction_medicine_services,
                "date_used_medicine_service": medical_services_for_substance_use.date_used_medicine_service,
                "addiction_medicine_clinic": medical_services_for_substance_use.addiction_medicine_clinic,
                "addiction_medicine_clinic_phone": medical_services_for_substance_use.addiction_medicine_clinic_phone,
                "date_created": medical_services_for_substance_use.date_created,
                "date_last_modified": medical_services_for_substance_use.date_last_modified
            }), 200
            
        else:
            medical_services_for_substance_use = db.session.query(MedicalServicesForSubstanceUse).filter_by(user_id=user_id).all()

            if not medical_services_for_substance_use:
                return jsonify([]), 200

            medical_services_for_substance_use_list = [{
                "id":  record.id,
                "user_id":  record.user_id,
                "mat_engaged":  record.mat_engaged,
                "date_used_mat":  record.date_used_mat,
                "medications":  record.medications,
                "mat_clinic_name":  record.mat_clinic_name,
                "mat_clinic_phone": record.mat_clinic_phone,
                "used_addiction_medicine_services": record.used_addiction_medicine_services,
                "date_used_medicine_service": record.date_used_medicine_service,
                "addiction_medicine_clinic": record.addiction_medicine_clinic,
                "addiction_medicine_clinic_phone": record.addiction_medicine_clinic_phone,
                "date_created": record.date_created,
                "date_last_modified": record.date_last_modified
            } for record in medical_services_for_substance_use]

            return jsonify(medical_services_for_substance_use_list), 200
            
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
@medical_services_for_substance_use_bp.route('/update_medical_services_for_substance_use/<id>', methods = ['PUT'])
@jwt_required()
def update_medical_services_for_substance_use(id):
    """
    Updates a medical_services_for_substance_use record for a user.

    Request JSON Parameters:
        - user_id (string)
        - mat_engaged (string)
        - date_used_mat (string)
        - medications [
            {
                medication: string
                dose: string
            }
        ] || []
        - mat_clinic_name (string)
        - mat_clinic_phone (string)
        - used_addiction_medicine_services (string)
        - date_used_medicine_service (string)
        - addiction_medicine_clinic (string)
        - addiction_medicine_clinic_phone (string)
        
    Returns:
        - If successful, adds and returns the user's new medical_services_for_substance_use record.
        - If medical_services_for_substance_use record for this user already exists, returns error message with error code 404.
        - If there is an unexpected error, returns error message with error code 500.
    """
    data=request.get_json()
    
    user_id = get_jwt_identity()
    
    mat_engaged = data.get('mat_engaged')
    date_used_mat = data.get('date_used_mat')
    medications = data.get('medications')
    mat_clinic_name = data.get('mat_clinic_name')
    mat_clinic_phone = data.get('mat_clinic_phone')
    used_addiction_medicine_services = data.get('used_addiction_medicine_services')
    date_used_medicine_service = data.get('date_used_medicine_service')
    addiction_medicine_clinic = data.get('addiction_medicine_clinic')
    addiction_medicine_clinic_phone = data.get('addiction_medicine_clinic_phone')
    
    try:
        medical_services_for_substance_use = db.session.query(MedicalServicesForSubstanceUse).filter_by(user_id=user_id, id=id).first()
        
        if not medical_services_for_substance_use:
            return jsonify("Medical Services for Substance Use information does not exist for this user."), 404
        
        medical_services_for_substance_use.mat_engaged = mat_engaged
        medical_services_for_substance_use.date_used_mat = date_used_mat
        medical_services_for_substance_use.medications = medications
        medical_services_for_substance_use.mat_clinic_name = mat_clinic_name
        medical_services_for_substance_use.mat_clinic_phone = mat_clinic_phone
        medical_services_for_substance_use.used_addiction_medicine_services = used_addiction_medicine_services
        medical_services_for_substance_use.date_used_medicine_service = date_used_medicine_service
        medical_services_for_substance_use.addiction_medicine_clinic = addiction_medicine_clinic
        medical_services_for_substance_use.addiction_medicine_clinic_phone = addiction_medicine_clinic_phone
        medical_services_for_substance_use.date_last_modified=datetime.now(timezone.utc)
        db.session.commit()
        
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({
        "id":  medical_services_for_substance_use.id,
        "user_id":  medical_services_for_substance_use.user_id,
        "mat_engaged":  medical_services_for_substance_use.mat_engaged,
        "date_used_mat":  medical_services_for_substance_use.date_used_mat,
        "medications":  medical_services_for_substance_use.medications,
        "mat_clinic_name":  medical_services_for_substance_use.mat_clinic_name,
        "mat_clinic_phone": medical_services_for_substance_use.mat_clinic_phone,
        "used_addiction_medicine_services": medical_services_for_substance_use.used_addiction_medicine_services,
        "date_used_medicine_service": medical_services_for_substance_use.date_used_medicine_service,
        "addiction_medicine_clinic": medical_services_for_substance_use.addiction_medicine_clinic,
        "addiction_medicine_clinic_phone": medical_services_for_substance_use.addiction_medicine_clinic_phone,
        "date_created": medical_services_for_substance_use.date_created,
        "date_last_modified": medical_services_for_substance_use.date_last_modified
    }), 200
    
@medical_services_for_substance_use_bp.route('/delete_medical_services_for_substance_use/<id>', methods = ['DELETE'])
@jwt_required()
def delete_medical_services_for_substance_use(id):
    """
    Deletes a medical_services_for_substance_use record for a user.

    Request JSON Parameters:
        - user_id (string)
    
    Returns:
        - If successful, deletes the user's new medical_services_for_substance_use record.
        - If medical_services_for_substance_use record for this user already exists, returns error message with error code 404.
        - If there is an unexpected error, returns error message with error code 500.
    """
    user_id = get_jwt_identity()

    try:

        medical_services_for_substance_use = MedicalServicesForSubstanceUse.query.filter_by(user_id=user_id, id=id).first()
        
        if not medical_services_for_substance_use:
            return jsonify("Medical Services for Substance Use information does not exist for this user."), 404
        
        db.session.delete(medical_services_for_substance_use)
        db.session.commit()
    
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify("Medical Services for Substance Use record for this user deleted."), 200