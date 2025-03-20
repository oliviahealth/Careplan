from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database import MaternalDemographics, db, User
from datetime import datetime, timezone

maternal_demo_bp = Blueprint('maternal_demographics', __name__, url_prefix='/api')

@maternal_demo_bp.route('/add_maternal_demographics', methods=['POST'])
@jwt_required()
def add_maternal_demographics():
    """
    Adds a maternal_demographics record for a user to the database.

    Request JSON Parameters:
        user_id (string)
        name (string)
        date_of_birth (string)
        current_living_arrangement (string)
        street_address (string)
        city (string)
        state (string)  
        zip_code (string)
        county (string)
        primary_phone_number (string)
        phone_type (string)
        emergency_contact (string)
        emergency_contact_phone (string)
        relationship (string)
        marital_status (string)
        insurance_plan (string)
        effective_date (string) 
        subscriber_id (string)
        group_id (string)

    Returns:
        - If successful, adds and returns the user's new maternal demographic.
        - If the demographics from this user already exists in the database, returns error messsage with error code 400.
        - If there is an unexpected error, returns error message with the error code 500.
    """
    data = request.get_json()

    user_id = get_jwt_identity()
    
    name = data.get('name')
    date_of_birth = data.get('date_of_birth')
    current_living_arrangement = data.get('current_living_arrangement')
    street_address = data.get('street_address')
    city = data.get('city')
    state = data.get('state')
    zip_code = data.get('zip_code')
    county = data.get('county')
    primary_phone_number = data.get('primary_phone_number')
    phone_type = data.get('phone_type')
    emergency_contact = data.get('emergency_contact')
    emergency_contact_phone = data.get('emergency_contact_phone')
    relationship = data.get('relationship')
    marital_status = data.get('marital_status')
    insurance_plan = data.get('insurance_plan')
    effective_date = data.get('effective_date')
    subscriber_id = data.get('subscriber_id')
    group_id = data.get('group_id')

    try:
        user = db.session.query(User).filter_by(id=user_id).first()

        if not user:
            return jsonify("User not found."), 404
        
        new_maternal_demographics = MaternalDemographics(
            user_id=user_id,
            name=name,
            date_of_birth=date_of_birth,
            current_living_arrangement=current_living_arrangement,
            street_address=street_address,
            city=city,
            state=state,
            zip_code=zip_code,
            county=county,
            primary_phone_number=primary_phone_number,
            phone_type=phone_type,
            emergency_contact=emergency_contact,
            emergency_contact_phone=emergency_contact_phone,
            relationship=relationship,
            marital_status=marital_status,
            insurance_plan=insurance_plan,
            effective_date=effective_date,
            subscriber_id=subscriber_id,
            group_id=group_id,
            date_created=datetime.now(timezone.utc),
            date_last_modified=datetime.now(timezone.utc)
        )

        db.session.add(new_maternal_demographics)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify({
        "id": new_maternal_demographics.id,
        "user_id": new_maternal_demographics.user_id,
        "name": new_maternal_demographics.name,
        "date_of_birth": new_maternal_demographics.date_of_birth,
        "current_living_arrangement": new_maternal_demographics.current_living_arrangement,
        "street_address": new_maternal_demographics.street_address,
        "city": new_maternal_demographics.city,
        "state": new_maternal_demographics.state,
        "zip_code": new_maternal_demographics.zip_code,
        "county": new_maternal_demographics.county,
        "primary_phone_number": new_maternal_demographics.primary_phone_number,
        "phone_type": new_maternal_demographics.phone_type,
        "emergency_contact": new_maternal_demographics.emergency_contact,
        "emergency_contact_phone": new_maternal_demographics.emergency_contact_phone,
        "relationship": new_maternal_demographics.relationship,
        "marital_status": new_maternal_demographics.marital_status,
        "insurance_plan": new_maternal_demographics.insurance_plan,
        "effective_date": new_maternal_demographics.effective_date,
        "subscriber_id": new_maternal_demographics.subscriber_id,
        "group_id": new_maternal_demographics.group_id,
        "date_created": new_maternal_demographics.date_created,
        "date_last_modified": new_maternal_demographics.date_last_modified
    }), 201

@maternal_demo_bp.route('/get_maternal_demographics', methods = ['GET'])
@maternal_demo_bp.route('/get_maternal_demographics/<id>', methods = ['GET'])
@jwt_required()
def get_maternal_demographics(id=None):
    """
    Get a maternal_demographics record 
    
    Request JSON Parameters:
        - user_id (string)
        - id (string) (optional)
        
    Returns:
        - If the user sends the user_id as a parameter, returns all instances for that user_id
        - If the user sends both user_id and id as parameter, returns specific instance
        - If successful, returns a user's maternal_demographics record.
        - If the medical demographic does not exist in the database, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    
    user_id = get_jwt_identity()

    try:
        user = db.session.query(User).filter_by(id=user_id).first()

        if not user:
            return jsonify("User not found."), 404
        
        if id:
            maternal_demographics = db.session.query(MaternalDemographics).filter_by(user_id=user_id, id=id).first()
            
            if(not maternal_demographics):
                return jsonify("Invalid maternal_demographics id"), 400

            return jsonify({
                "id": maternal_demographics.id,
                "user_id": maternal_demographics.user_id,
                "name": maternal_demographics.name,
                "date_of_birth": maternal_demographics.date_of_birth,
                "current_living_arrangement": maternal_demographics.current_living_arrangement,
                "street_address": maternal_demographics.street_address,
                "city": maternal_demographics.city,
                "state": maternal_demographics.state,
                "zip_code": maternal_demographics.zip_code,
                "county": maternal_demographics.county,
                "primary_phone_number": maternal_demographics.primary_phone_number,
                "phone_type": maternal_demographics.phone_type,
                "emergency_contact": maternal_demographics.emergency_contact,
                "emergency_contact_phone": maternal_demographics.emergency_contact_phone,
                "relationship": maternal_demographics.relationship,
                "marital_status": maternal_demographics.marital_status,
                "insurance_plan": maternal_demographics.insurance_plan,
                "effective_date": maternal_demographics.effective_date,
                "subscriber_id": maternal_demographics.subscriber_id,
                "group_id": maternal_demographics.group_id,
                "date_created": maternal_demographics.date_created,
                "date_last_modified": maternal_demographics.date_last_modified
            }), 200
            
        else:
            maternal_demographics = db.session.query(MaternalDemographics).filter_by(user_id=user_id).all()

            if not maternal_demographics:
                return jsonify([]), 200

            maternal_demographics_list = [{
                "id": record.id,
                "user_id": record.user_id,
                "name": record.name,
                "date_of_birth": record.date_of_birth,
                "current_living_arrangement": record.current_living_arrangement,
                "street_address": record.street_address,
                "city": record.city,
                "state": record.state,
                "zip_code": record.zip_code,
                "county": record.county,
                "primary_phone_number": record.primary_phone_number,
                "phone_type": record.phone_type,
                "emergency_contact": record.emergency_contact,
                "emergency_contact_phone": record.emergency_contact_phone,
                "relationship": record.relationship,
                "marital_status": record.marital_status,
                "insurance_plan": record.insurance_plan,
                "effective_date": record.effective_date,
                "subscriber_id": record.subscriber_id,
                "group_id": record.group_id,
                "date_created": record.date_created,
                "date_last_modified": record.date_last_modified
            } for record in maternal_demographics]

            return jsonify(maternal_demographics_list), 200
            
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

@maternal_demo_bp.route('/update_maternal_demographics/<id>', methods=['PUT'])
@jwt_required()
def update_maternal_demographics(id):
    """
    Updates a user's maternal demographics. 

    Request JSON Parameters:
        user_id (string)
        name (string)
        date_of_birth (string)
        current_living_arrangement (string)
        street_address (string)
        city (string)
        state (string)  
        zip_code (string)
        county (string)
        primary_phone_number (string)
        phone_type (string)
        emergency_contact (string)
        emergency_contact_phone (string)
        relationship (string)
        marital_status (string)
        insurance_plan (string)
        effective_date (string) 
        subscriber_id (string)
        group_id (string)

    Returns:
        - If successful, updates and returns the user's maternal_demographics_record.
        - If there is no maternal demographic for the user in the database, returns a message with error 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    data = request.get_json()
    user_id = get_jwt_identity()
    name = data.get('name')
    date_of_birth = data.get('date_of_birth')
    current_living_arrangement = data.get('current_living_arrangement')
    street_address = data.get('street_address')
    city = data.get('city')
    state = data.get('state')
    zip_code = data.get('zip_code')
    county = data.get('county')
    primary_phone_number = data.get('primary_phone_number')
    phone_type = data.get('phone_type')
    emergency_contact = data.get('emergency_contact')
    emergency_contact_phone = data.get('emergency_contact_phone')
    relationship = data.get('relationship')
    marital_status = data.get('marital_status')
    insurance_plan = data.get('insurance_plan')
    effective_date = data.get('effective_date')
    subscriber_id = data.get('subscriber_id')
    group_id = data.get('group_id')

    try:
        maternal_demographics = db.session.query(
            MaternalDemographics).filter_by(user_id=user_id, id=id).first()

        if not maternal_demographics:
            return jsonify("Maternal Demographics does not exist."), 400

        maternal_demographics.name = name
        maternal_demographics.date_of_birth = date_of_birth
        maternal_demographics.current_living_arrangement = current_living_arrangement
        maternal_demographics.street_address = street_address
        maternal_demographics.city = city
        maternal_demographics.state = state
        maternal_demographics.zip_code = zip_code
        maternal_demographics.county = county
        maternal_demographics.primary_phone_number = primary_phone_number
        maternal_demographics.phone_type = phone_type
        maternal_demographics.emergency_contact = emergency_contact
        maternal_demographics.emergency_contact_phone = emergency_contact_phone
        maternal_demographics.relationship = relationship
        maternal_demographics.marital_status = marital_status
        maternal_demographics.insurance_plan = insurance_plan
        maternal_demographics.effective_date = effective_date
        maternal_demographics.subscriber_id = subscriber_id
        maternal_demographics.group_id = group_id
        maternal_demographics.date_last_modified = datetime.now(timezone.utc)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify({
        "id": maternal_demographics.id,
        "user_id": maternal_demographics.user_id,
        "name": maternal_demographics.name,
        "date_of_birth": maternal_demographics.date_of_birth,
        "current_living_arrangement": maternal_demographics.current_living_arrangement,
        "street_address": maternal_demographics.street_address,
        "city": maternal_demographics.city,
        "state": maternal_demographics.state,
        "zip_code": maternal_demographics.zip_code,
        "county": maternal_demographics.county,
        "primary_phone_number": maternal_demographics.primary_phone_number,
        "phone_type": maternal_demographics.phone_type,
        "emergency_contact": maternal_demographics.emergency_contact,
        "emergency_contact_phone": maternal_demographics.emergency_contact_phone,
        "relationship": maternal_demographics.relationship,
        "marital_status": maternal_demographics.marital_status,
        "insurance_plan": maternal_demographics.insurance_plan,
        "effective_date": maternal_demographics.effective_date,
        "subscriber_id": maternal_demographics.subscriber_id,
        "group_id": maternal_demographics.group_id,
        "date_created": maternal_demographics.date_created,
        "date_last_modified": maternal_demographics.date_last_modified
    })


@maternal_demo_bp.route('/delete_maternal_demographics/<id>', methods=['DELETE'])
@jwt_required()
def delete_maternal_demographics(id):
    """
    Deletes a user's maternal demographic. 

    Request JSON Parameters:
        - user_id (string)

    Returns:
        - If successful, deletes the user's maternal demographic for this form and returns a confirmation message.
        - If there is no maternal demographic for this user in the database, returns a message with error code 400.
        - If there is an unexpected error, returns an error message with the error code 500.
    """
    user_id = get_jwt_identity()

    try:
        maternal_demographics = db.session.query(
            MaternalDemographics).filter_by(user_id=user_id, id=id).first()

        if not maternal_demographics:
            return jsonify('There is no user with this information.'), 400

        db.session.delete(maternal_demographics)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify("Demographic deleted."), 200