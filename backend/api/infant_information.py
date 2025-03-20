from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database import InfantInformation, db, User
from datetime import datetime, timezone

infant_information_bp = Blueprint('infant_information', __name__, url_prefix = '/api')

@infant_information_bp.route('/add_infant_information', methods = ['POST'])
@jwt_required()
def add_infant_information():
    """
    Adds a infant_information record for a user to the database.
    
    Request JSON Parameters:
        - user_id (string)
        - child_name (string)
        - date_of_birth (date)
        - sex (string)
        - birth_weight (string)
        - gestational_age_at_birth (string)
        - NICU_stay (string)
        - NICU_length_of_stay (string)
        - pediatrician_name (string)
        - pediatrician_contact_info (string)
        - infant_urine_drug_screening_at_birth (string)
        - infant_urine_drug_screening_at_birth_specify (string)
        - meconium_results (string)
        - meconium_results_specify (string)
        - neonatal_opiod_withdraw (string)
        - neonatal_opiod_withdraw_treatment_method (string)
        - DX_problems_additional_information (string)
        - infant_care_needs_items: {
            breast_pump: string
            breast_pump_notes: string
            breastfeeding_support: string
            breastfeeding_support_notes: string
            car_seat: string
            car_seat_notes: string
            childcare: string
            childcare_notes: string
            clothing: string
            clothing_notes: string
            crib: string
            crib_notes: string
            diapers: string
            diapers_notes: string
            infant_formula: string
            infant_formula_notes: string
            infant_stroller: string
            infant_stroller_notes: string
            other: string
            other_name: string
            other_notes: string
        }
        - where_will_baby_sleep (string)
        - where_will_baby_sleep_specify (string)
        - infant_care_needs_additional_notes (string)
        - infant_medications: [
            {
                medication: string,
                dose: string,
                prescriber: string,
                notes: string
            }
        ] || []
        - infant_medication_notes (string)
        - father_name (string)
        - father_date_of_birth (string)
        - father_street_address (string)
        - father_city (string)
        - father_state (string)
        - father_zip_code (integer)
        - father_primary_phone_numbers (string)
        - father_involved_in_babys_life (string)
        - father_involved_in_babys_life_comments (string)
        - father_notes (string)
        
    Returns:
        - If successful, adds and returns the user's new infant information.
        - If the infant information from this user already exists in the database, returns error messsage with error code 400.
        - If there is an unexpected error, returns error message with the error code 500.
    """
    
    data = request.get_json()
    
    user_id = get_jwt_identity()
    
    child_name=data.get('child_name')
    date_of_birth=data.get('date_of_birth')
    sex=data.get('sex')
    birth_weight=data.get('birth_weight')
    gestational_age_at_birth=data.get('gestational_age_at_birth')
    NICU_stay=data.get('NICU_stay')
    NICU_length_of_stay=data.get('NICU_length_of_stay')
    pediatrician_name=data.get('pediatrician_name')
    pediatrician_contact_info=data.get('pediatrician_contact_info')
    infant_urine_drug_screening_at_birth=data.get('infant_urine_drug_screening_at_birth')
    infant_urine_drug_screening_at_birth_specify=data.get('infant_urine_drug_screening_at_birth_specify')
    meconium_results=data.get('meconium_results')
    meconium_results_specify=data.get('meconium_results_specify')
    neonatal_opiod_withdraw=data.get('neonatal_opiod_withdraw')
    neonatal_opiod_withdraw_treatment_method=data.get('neonatal_opiod_withdraw_treatment_method')
    DX_problems_additional_information=data.get('DX_problems_additional_information')
    infant_care_needs_items=data.get('infant_care_needs_items')
    where_will_baby_sleep=data.get('where_will_baby_sleep')
    where_will_baby_sleep_specify=data.get('where_will_baby_sleep_specify')
    infant_care_needs_additional_notes=data.get('infant_care_needs_additional_notes')
    infant_medications=data.get('infant_medications')
    infant_medication_notes=data.get('infant_medication_notes')
    father_name=data.get('father_name')
    father_date_of_birth=data.get('father_date_of_birth')
    father_street_address=data.get('father_street_address')
    father_city=data.get('father_city')
    father_state=data.get('father_state')
    father_zip_code=data.get('father_zip_code')
    father_primary_phone_numbers=data.get('father_primary_phone_numbers')
    father_involved_in_babys_life=data.get('father_involved_in_babys_life')
    father_involved_in_babys_life_comments=data.get('father_involved_in_babys_life_comments')
    father_notes=data.get('father_notes')
    
    try:
        user = db.session.query(User).filter_by(id=user_id).first()
        
        if not user:
            return jsonify("User not found."), 404
        
        new_infant_information = InfantInformation(
            user_id=user_id,
            child_name=child_name,
            date_of_birth=date_of_birth,
            sex=sex,
            birth_weight=birth_weight,
            gestational_age_at_birth=gestational_age_at_birth,
            NICU_stay=NICU_stay,
            NICU_length_of_stay=NICU_length_of_stay,
            pediatrician_name=pediatrician_name,
            pediatrician_contact_info=pediatrician_contact_info,
            infant_urine_drug_screening_at_birth=infant_urine_drug_screening_at_birth,
            infant_urine_drug_screening_at_birth_specify=infant_urine_drug_screening_at_birth_specify,
            meconium_results=meconium_results,
            meconium_results_specify=meconium_results_specify,
            neonatal_opiod_withdraw=neonatal_opiod_withdraw,
            neonatal_opiod_withdraw_treatment_method=neonatal_opiod_withdraw_treatment_method,
            DX_problems_additional_information=DX_problems_additional_information,
            infant_care_needs_items=infant_care_needs_items,
            where_will_baby_sleep=where_will_baby_sleep,
            where_will_baby_sleep_specify=where_will_baby_sleep_specify,
            infant_care_needs_additional_notes=infant_care_needs_additional_notes, 
            infant_medications=infant_medications,
            infant_medication_notes=infant_medication_notes, 
            father_name=father_name, 
            father_date_of_birth=father_date_of_birth, 
            father_street_address=father_street_address, 
            father_city=father_city,
            father_state=father_state,
            father_zip_code=father_zip_code,
            father_primary_phone_numbers=father_primary_phone_numbers, 
            father_involved_in_babys_life=father_involved_in_babys_life, 
            father_involved_in_babys_life_comments=father_involved_in_babys_life_comments, 
            father_notes=father_notes,
            date_created=datetime.now(timezone.utc),
            date_last_modified=datetime.now(timezone.utc)
        )
        
        db.session.add(new_infant_information)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({
        "id":new_infant_information.id,
        "user_id":new_infant_information.user_id,
        "child_name":new_infant_information.child_name,
        "date_of_birth":new_infant_information.date_of_birth,
        "sex":new_infant_information.sex,
        "birth_weight":new_infant_information.birth_weight,
        "gestational_age_at_birth":new_infant_information.gestational_age_at_birth,
        "NICU_stay":new_infant_information.NICU_stay,
        "NICU_length_of_stay":new_infant_information.NICU_length_of_stay,
        "pediatrician_name":new_infant_information.pediatrician_name,
        "pediatrician_contact_info":new_infant_information.pediatrician_contact_info,
        "infant_urine_drug_screening_at_birth":new_infant_information.infant_urine_drug_screening_at_birth,
        "infant_urine_drug_screening_at_birth_specify":new_infant_information.infant_urine_drug_screening_at_birth_specify,
        "meconium_results":new_infant_information.meconium_results,
        "meconium_results_specify":new_infant_information.meconium_results_specify,
        "neonatal_opiod_withdraw":new_infant_information.neonatal_opiod_withdraw,
        "neonatal_opiod_withdraw_treatment_method":new_infant_information.neonatal_opiod_withdraw_treatment_method,
        "DX_problems_additional_information":new_infant_information.DX_problems_additional_information,
        "infant_care_needs_items": new_infant_information.infant_care_needs_items,
        "where_will_baby_sleep": new_infant_information.where_will_baby_sleep,
        "where_will_baby_sleep_specify": new_infant_information.where_will_baby_sleep_specify,
        "infant_care_needs_additional_notes": new_infant_information.infant_care_needs_additional_notes, 
        "infant_medications": new_infant_information.infant_medications,
        "infant_medication_notes": new_infant_information.infant_medication_notes,
        "father_name": new_infant_information.father_name,
        "father_date_of_birth": new_infant_information.father_date_of_birth,
        "father_street_address": new_infant_information.father_street_address,
        "father_city": new_infant_information.father_city,
        "father_state": new_infant_information.father_state,
        "father_zip_code": new_infant_information.father_zip_code,
        "father_primary_phone_numbers": new_infant_information.father_primary_phone_numbers,
        "father_involved_in_babys_life": new_infant_information.father_involved_in_babys_life,
        "father_involved_in_babys_life_comments": new_infant_information.father_involved_in_babys_life_comments,
        "father_notes": new_infant_information.father_notes,
        "date_created": new_infant_information.date_created,
        "date_last_modified": new_infant_information.date_last_modified
    }), 201

@infant_information_bp.route('/get_infant_information', methods = ['GET'])
@infant_information_bp.route('/get_infant_information/<id>', methods = ['GET'])
@jwt_required()
def get_infant_information(id=None):
    """
    Get a infant_information record 
    
    Request JSON Parameters:
        - user_id (string)
        
    Returns:
        - If successful, returns a user's infant_information record.
        - If the infant information does not exist in the database, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        user = db.session.query(User).filter_by(id=user_id).first()
        
        if not user:
            return jsonify("User not found."), 404
        
        if id:
            infant_information = db.session.query(InfantInformation).filter_by(user_id=user_id, id=id).first()

            if(not infant_information):
                return jsonify("Invalid infant_information id"), 400

            return jsonify({
                "id":infant_information.id,
                "user_id":infant_information.user_id,
                "child_name":infant_information.child_name,
                "date_of_birth":infant_information.date_of_birth,
                "sex":infant_information.sex,
                "birth_weight":infant_information.birth_weight,
                "gestational_age_at_birth":infant_information.gestational_age_at_birth,
                "NICU_stay":infant_information.NICU_stay,
                "NICU_length_of_stay":infant_information.NICU_length_of_stay,
                "pediatrician_name":infant_information.pediatrician_name,
                "pediatrician_contact_info":infant_information.pediatrician_contact_info,
                "infant_urine_drug_screening_at_birth":infant_information.infant_urine_drug_screening_at_birth,
                "infant_urine_drug_screening_at_birth_specify":infant_information.infant_urine_drug_screening_at_birth_specify,
                "meconium_results":infant_information.meconium_results,
                "meconium_results_specify":infant_information.meconium_results_specify,
                "neonatal_opiod_withdraw":infant_information.neonatal_opiod_withdraw,
                "neonatal_opiod_withdraw_treatment_method":infant_information.neonatal_opiod_withdraw_treatment_method,
                "DX_problems_additional_information":infant_information.DX_problems_additional_information,
                "infant_care_needs_items": infant_information.infant_care_needs_items,
                "where_will_baby_sleep": infant_information.where_will_baby_sleep,
                "where_will_baby_sleep_specify": infant_information.where_will_baby_sleep_specify,
                "infant_care_needs_additional_notes": infant_information.infant_care_needs_additional_notes, 
                "infant_medications": infant_information.infant_medications,
                "infant_medication_notes": infant_information.infant_medication_notes,
                "father_name": infant_information.father_name,
                "father_date_of_birth": infant_information.father_date_of_birth,
                "father_street_address": infant_information.father_street_address,
                "father_city": infant_information.father_city,
                "father_state": infant_information.father_state,
                "father_zip_code": infant_information.father_zip_code,
                "father_primary_phone_numbers": infant_information.father_primary_phone_numbers,
                "father_involved_in_babys_life": infant_information.father_involved_in_babys_life,
                "father_involved_in_babys_life_comments": infant_information.father_involved_in_babys_life_comments,
                "father_notes": infant_information.father_notes,
                "date_created": infant_information.date_created,
                "date_last_modified": infant_information.date_last_modified
            }), 200
            
        else:
            infant_information = db.session.query(InfantInformation).filter_by(user_id=user_id).all()

            if not infant_information:
                return jsonify([]), 200

            infant_information_list = [{
                "id":record.id,
                "user_id":record.user_id,
                "child_name":record.child_name,
                "date_of_birth":record.date_of_birth,
                "sex":record.sex,
                "birth_weight":record.birth_weight,
                "gestational_age_at_birth":record.gestational_age_at_birth,
                "NICU_stay":record.NICU_stay,
                "NICU_length_of_stay":record.NICU_length_of_stay,
                "pediatrician_name":record.pediatrician_name,
                "pediatrician_contact_info":record.pediatrician_contact_info,
                "infant_urine_drug_screening_at_birth":record.infant_urine_drug_screening_at_birth,
                "infant_urine_drug_screening_at_birth_specify":record.infant_urine_drug_screening_at_birth_specify,
                "meconium_results":record.meconium_results,
                "meconium_results_specify":record.meconium_results_specify,
                "neonatal_opiod_withdraw":record.neonatal_opiod_withdraw,
                "neonatal_opiod_withdraw_treatment_method":record.neonatal_opiod_withdraw_treatment_method,
                "DX_problems_additional_information":record.DX_problems_additional_information,
                "infant_care_needs_items": record.infant_care_needs_items,
                "where_will_baby_sleep": record.where_will_baby_sleep,
                "where_will_baby_sleep_specify": record.where_will_baby_sleep_specify,
                "infant_care_needs_additional_notes": record.infant_care_needs_additional_notes, 
                "infant_medications": record.infant_medications,
                "infant_medication_notes": record.infant_medication_notes,
                "father_name": record.father_name,
                "father_date_of_birth": record.father_date_of_birth,
                "father_street_address": record.father_street_address,
                "father_city": record.father_city,
                "father_state": record.father_state,
                "father_zip_code": record.father_zip_code,
                "father_primary_phone_numbers": record.father_primary_phone_numbers,
                "father_involved_in_babys_life": record.father_involved_in_babys_life,
                "father_involved_in_babys_life_comments": record.father_involved_in_babys_life_comments,
                "father_notes": record.father_notes,
                "date_created": record.date_created,
                "date_last_modified": record.date_last_modified
            } for record in infant_information]

            return jsonify(infant_information_list), 200

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

@infant_information_bp.route('/update_infant_information/<id>', methods = ['PUT'])
@jwt_required()
def update_infant_information(id):
    """
    Updates an infant_information record.
    
    Request JSON Parameters:
        - user_id (string)
        - child_name (string)
        - date_of_birth (date)
        - sex (string)
        - birth_weight (Integer)
        - gestational_age_at_birth (Integer)
        - NICU_stay (string)
        - NICU_length_of_stay (Integer)
        - pediatrician_name (string)
        - pediatrician_contact_info (string)
        - infant_urine_drug_screening_at_birth (string)
        - infant_urine_drug_screening_at_birth_specify (string)
        - meconium_results (string)
        - meconium_results_specify (string)
        - neonatal_opiod_withdraw (string)
        - neonatal_opiod_withdraw_treatment_method (string)
        - DX_problems_additional_information (string)
        - infant_care_needs_items: {
            breast_pump: string
            breastfeeding_support: string
            car_seat: string
            childcare: string
            clothing: string
            crib: string
            diapers: string
            infant_formula: string
            infant_stroller: string
            other: string
        }
        - where_will_baby_sleep (string)
        - where_will_baby_sleep_specify (string)
        - infant_care_needs_additional_notes (string)
        - infant_medications: [
            {
                medication: string,
                dose: string,
                prescriber: string,
                notes: string
            }
        ] || []
        - infant_medication_notes (string)
        - father_name (string)
        - father_date_of_birth (string)
        - father_street_address (string)
        - father_city (string)
        - father_state (string)
        - father_zip_code (integer)
        - father_primary_phone_numbers (string)
        - father_involved_in_babys_life (string)
        - father_involved_in_babys_life_comments (string)
        - father_notes (string)
        
    Returns:
        - If successful, updates and returns a user's infant_information form.
        - If there is no infant_information record for this user in the database, returns a message with error 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    data = request.get_json()
    
    user_id = get_jwt_identity()
    
    child_name=data.get('child_name')
    date_of_birth=data.get('date_of_birth')
    sex=data.get('sex')
    birth_weight=data.get('birth_weight')
    gestational_age_at_birth=data.get('gestational_age_at_birth')
    NICU_stay=data.get('NICU_stay')
    NICU_length_of_stay=data.get('NICU_length_of_stay')
    pediatrician_name=data.get('pediatrician_name')
    pediatrician_contact_info=data.get('pediatrician_contact_info')
    infant_urine_drug_screening_at_birth=data.get('infant_urine_drug_screening_at_birth')
    infant_urine_drug_screening_at_birth_specify=data.get('infant_urine_drug_screening_at_birth_specify')
    meconium_results=data.get('meconium_results')
    meconium_results_specify=data.get('meconium_results_specify')
    neonatal_opiod_withdraw=data.get('neonatal_opiod_withdraw')
    neonatal_opiod_withdraw_treatment_method=data.get('neonatal_opiod_withdraw_treatment_method')
    DX_problems_additional_information=data.get('DX_problems_additional_information')
    infant_care_needs_items=data.get('infant_care_needs_items')
    where_will_baby_sleep=data.get('where_will_baby_sleep')
    where_will_baby_sleep_specify=data.get('where_will_baby_sleep_specify')
    infant_care_needs_additional_notes=data.get('infant_care_needs_additional_notes')
    infant_medications=data.get('infant_medications')
    infant_medication_notes=data.get('infant_medication_notes')
    father_name=data.get('father_name')
    father_date_of_birth=data.get('father_date_of_birth')
    father_street_address=data.get('father_street_address')
    father_city=data.get('father_city')
    father_state=data.get('father_state')
    father_zip_code=data.get('father_zip_code')
    father_primary_phone_numbers=data.get('father_primary_phone_numbers')
    father_involved_in_babys_life=data.get('father_involved_in_babys_life')
    father_involved_in_babys_life_comments=data.get('father_involved_in_babys_life_comments')
    father_notes=data.get('father_notes')
    
    try:
        infant_information = db.session.query(InfantInformation).filter_by(user_id=user_id, id=id).first()
        
        if not infant_information:
            return jsonify("Infant information does not exist for this user."), 400
        
        infant_information.child_name=child_name
        infant_information.date_of_birth=date_of_birth
        infant_information.sex=sex
        infant_information.birth_weight=birth_weight
        infant_information.gestational_age_at_birth=gestational_age_at_birth
        infant_information.NICU_stay=NICU_stay
        infant_information.NICU_length_of_stay=NICU_length_of_stay
        infant_information.pediatrician_name=pediatrician_name
        infant_information.pediatrician_contact_info=pediatrician_contact_info
        infant_information.infant_urine_drug_screening_at_birth=infant_urine_drug_screening_at_birth
        infant_information.infant_urine_drug_screening_at_birth_specify=infant_urine_drug_screening_at_birth_specify
        infant_information.meconium_results=meconium_results
        infant_information.meconium_results_specify=meconium_results_specify
        infant_information.neonatal_opiod_withdraw=neonatal_opiod_withdraw
        infant_information.neonatal_opiod_withdraw_treatment_method=neonatal_opiod_withdraw_treatment_method
        infant_information.DX_problems_additional_information=DX_problems_additional_information
        infant_information.infant_care_needs_items=infant_care_needs_items
        infant_information.where_will_baby_sleep=where_will_baby_sleep
        infant_information.where_will_baby_sleep_specify=where_will_baby_sleep_specify
        infant_information.infant_care_needs_additional_notes=infant_care_needs_additional_notes
        infant_information.infant_medications=infant_medications
        infant_information.infant_medication_notes=infant_medication_notes
        infant_information.father_name=father_name
        infant_information.father_date_of_birth=father_date_of_birth
        infant_information.father_street_address=father_street_address
        infant_information.father_city=father_city
        infant_information.father_state=father_state
        infant_information.father_zip_code=father_zip_code
        infant_information.father_primary_phone_numbers=father_primary_phone_numbers
        infant_information.father_involved_in_babys_life=father_involved_in_babys_life
        infant_information.father_involved_in_babys_life_comments=father_involved_in_babys_life_comments
        infant_information.father_notes=father_notes
        infant_information.date_last_modified=datetime.now(timezone.utc)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({
        "id":infant_information.id,
        "user_id":infant_information.user_id,
        "child_name":infant_information.child_name,
        "date_of_birth":infant_information.date_of_birth,
        "sex":infant_information.sex,
        "birth_weight":infant_information.birth_weight,
        "gestational_age_at_birth":infant_information.gestational_age_at_birth,
        "NICU_stay":infant_information.NICU_stay,
        "NICU_length_of_stay":infant_information.NICU_length_of_stay,
        "pediatrician_name":infant_information.pediatrician_name,
        "pediatrician_contact_info":infant_information.pediatrician_contact_info,
        "infant_urine_drug_screening_at_birth":infant_information.infant_urine_drug_screening_at_birth,
        "infant_urine_drug_screening_at_birth_specify":infant_information.infant_urine_drug_screening_at_birth_specify,
        "meconium_results":infant_information.meconium_results,
        "meconium_results_specify":infant_information.meconium_results_specify,
        "neonatal_opiod_withdraw":infant_information.neonatal_opiod_withdraw,
        "neonatal_opiod_withdraw_treatment_method":infant_information.neonatal_opiod_withdraw_treatment_method,
        "DX_problems_additional_information":infant_information.DX_problems_additional_information,
        "infant_care_needs_items": infant_information.infant_care_needs_items,
        "where_will_baby_sleep": infant_information.where_will_baby_sleep,
        "where_will_baby_sleep_specify": infant_information.where_will_baby_sleep_specify,
        "infant_care_needs_additional_notes": infant_information.infant_care_needs_additional_notes, 
        "infant_medications": infant_information.infant_medications,
        "infant_medication_notes": infant_information.infant_medication_notes,
        "father_name": infant_information.father_name,
        "father_date_of_birth": infant_information.father_date_of_birth,
        "father_street_address": infant_information.father_street_address,
        "father_city": infant_information.father_city,
        "father_state": infant_information.father_state,
        "father_zip_code": infant_information.father_zip_code,
        "father_primary_phone_numbers": infant_information.father_primary_phone_numbers,
        "father_involved_in_babys_life": infant_information.father_involved_in_babys_life,
        "father_involved_in_babys_life_comments": infant_information.father_involved_in_babys_life_comments,
        "father_notes": infant_information.father_notes,
        "date_created": infant_information.date_created,
        "date_last_modified": infant_information.date_last_modified
    }), 201
    
@infant_information_bp.route('/delete_infant_information/<id>', methods = ['DELETE'])
@jwt_required()
def delete_infant_information(id):
    """
    Deletes a infant_information record. 
    
    Request JSON Parameters:
        - user_id (string)

    Returns:
        - If successful, deletes the user's infant_information record and returns a confirmation message.
        - If there is no infant information for this user, returns a message with error code 400.
        - If there is an unexpected error, returns an error message with the error code 500.
    """
    user_id = get_jwt_identity()

    try:
        infant_information = db.session.query(InfantInformation).filter_by(user_id=user_id, id=id).first()
        
        if not infant_information:
            return jsonify('Infant information does not exist.'), 400

        db.session.delete(infant_information)
        db.session.commit()

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    return jsonify("Infant information deleted."), 201

