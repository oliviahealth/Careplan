from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from database import RelapsePreventionPlan, db, User
from datetime import datetime, timezone

relapse_prevention_plan_bp = Blueprint('relapse_prevention_plan', __name__)

@relapse_prevention_plan_bp.route('/add_relapse_prevention_plan', methods=['POST'])
@jwt_required()
def add_relapse_prevention_plan():
    """
    Creates a relapse_prevention_plan record for the user.
    
    Request JSON Paramters:
        - user_id (String)
        - three_things_that_trigger_desire_to_use (String[])
        - three_skills_you_enjoy = (String[])
        - three_people_to_talk_to (String[])
        - safe_caregivers: [
            {
                name (String)
                contact_number (String)
                relationship (String)
            }
        ] || []
        - have_naloxone (Boolean)
        - comments (String)
        
    Returns:
        - If successful, adds and returns the user's relapse_prevention_plan record.
        - If an invalid user is added, returns error 404.
        - If relapse_prevention_plan record for user already exists, returns error code 400.
        - If there is an unexpected error, returns error code 500.
    """
    data = request.get_json()
    
    user_id = get_jwt_identity()
    
    three_things_that_trigger_desire_to_use=data.get('three_things_that_trigger_desire_to_use')
    three_skills_you_enjoy=data.get('three_skills_you_enjoy')
    three_people_to_talk_to=data.get('three_people_to_talk_to')
    safe_caregivers=data.get('safe_caregivers')
    have_naloxone=data.get('have_naloxone')
    comments=data.get('comments')
    
    try: 
        user = db.session.query(User).filter_by(id=user_id).first()
        
        if not user:
            return("User not found."), 404
        
        new_relapse_prevention_plan = RelapsePreventionPlan(
            user_id=user_id,
            three_things_that_trigger_desire_to_use=three_things_that_trigger_desire_to_use,
            three_skills_you_enjoy=three_skills_you_enjoy,
            three_people_to_talk_to=three_people_to_talk_to,
            safe_caregivers=safe_caregivers,
            have_naloxone=have_naloxone,
            comments=comments,
            date_created=datetime.now(timezone.utc),
            date_last_modified=datetime.now(timezone.utc)
        )
        
        db.session.add(new_relapse_prevention_plan)
        db.session.commit()
        
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify ({
        "id": new_relapse_prevention_plan.id,
        "user_id": new_relapse_prevention_plan.user_id,
        "three_things_that_trigger_desire_to_use": new_relapse_prevention_plan.three_things_that_trigger_desire_to_use,
        "three_skills_you_enjoy": new_relapse_prevention_plan.three_skills_you_enjoy,
        "three_people_to_talk_to": new_relapse_prevention_plan.three_people_to_talk_to,
        "safe_caregivers": new_relapse_prevention_plan.safe_caregivers,
        "have_naloxone": new_relapse_prevention_plan.have_naloxone,
        "comments": new_relapse_prevention_plan.comments,
        "date_created": new_relapse_prevention_plan.date_created,
        "date_last_modified": new_relapse_prevention_plan.date_last_modified
    }), 201
    
@relapse_prevention_plan_bp.route('/update_relapse_prevention_plan/<id>', methods=['PUT'])
@jwt_required()
def update_relapse_prevention_plan(id):
    """
    Updates a relapse_prevention_plan record for the user.
    
    Request JSON Paramters:
        - user_id (String)
        - three_things_that_trigger_desire_to_use (String[])
        - three_skills_you_enjoy = (String[])
        - three_people_to_talk_to (String[])
        - safe_caregivers: [
            {
                name (String)
                contact_number (String)
                relationship (String)
            }
        ] || []
        - have_naloxone (Boolean)
        - comments (String)
        
    Returns:
        - If successful, updates and returns the user's relapse_prevention_plan record.
        - If relapse_prevention_plan record for user already exists, returns error code 400.
        - If there is an unexpected error, returns error code 500.
    """
    data = request.get_json()
    
    user_id = get_jwt_identity()
    
    three_things_that_trigger_desire_to_use=data.get('three_things_that_trigger_desire_to_use')
    three_skills_you_enjoy=data.get('three_skills_you_enjoy')
    three_people_to_talk_to=data.get('three_people_to_talk_to')
    safe_caregivers=data.get('safe_caregivers')
    have_naloxone=data.get('have_naloxone')
    comments=data.get('comments')
    
    try: 
        
        relapse_prevention_plan=db.session.query(RelapsePreventionPlan).filter_by(user_id=user_id, id=id).first()
        
        if not relapse_prevention_plan:
            return jsonify("relapse_prevention_plan record does not exist"), 400
        
        relapse_prevention_plan.three_things_that_trigger_desire_to_use=three_things_that_trigger_desire_to_use
        relapse_prevention_plan.three_skills_you_enjoy=three_skills_you_enjoy
        relapse_prevention_plan.three_people_to_talk_to=three_people_to_talk_to
        relapse_prevention_plan.safe_caregivers=safe_caregivers
        relapse_prevention_plan.have_naloxone=have_naloxone
        relapse_prevention_plan.comments=comments
        relapse_prevention_plan.date_last_modified=datetime.now(timezone.utc)
        
        db.session.commit()
        
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify ({
        "id": relapse_prevention_plan.id,
        "user_id": relapse_prevention_plan.user_id,
        "three_things_that_trigger_desire_to_use": relapse_prevention_plan.three_things_that_trigger_desire_to_use,
        "three_skills_you_enjoy": relapse_prevention_plan.three_skills_you_enjoy,
        "three_people_to_talk_to": relapse_prevention_plan.three_people_to_talk_to,
        "safe_caregivers": relapse_prevention_plan.safe_caregivers,
        "have_naloxone": relapse_prevention_plan.have_naloxone,
        "comments": relapse_prevention_plan.comments,
        "date_created": relapse_prevention_plan.date_created,
        "date_last_modified": relapse_prevention_plan.date_last_modified
    }), 200
    
@relapse_prevention_plan_bp.route('/get_relapse_prevention_plan', methods=['GET'])
@relapse_prevention_plan_bp.route('/get_relapse_prevention_plan/<id>', methods=['GET'])
@jwt_required()
def get_relapse_prevention_plan(id=None):
    """
    Gets a relapse_prevention_plan record for a user.
    
    Request JSON Parameters:
        - user_id (string)
    
    Returns:
        - If successful, returns a user's relapse_prevention_plan record.
        - If the relapse_prevention_plan record does not exist in the database, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        user = db.session.query(User).filter_by(id=user_id).first()

        if not user:
            return jsonify("User not found."), 404
        
        if id:
            relapse_prevention_plan = db.session.query(RelapsePreventionPlan).filter_by(user_id=user_id, id=id).first()
            
            if(not relapse_prevention_plan):
                return jsonify("Invalid relapse_prevention_plan id"), 400

            return jsonify({
                "id": relapse_prevention_plan.id,
                "user_id": relapse_prevention_plan.user_id,
                "three_things_that_trigger_desire_to_use": relapse_prevention_plan.three_things_that_trigger_desire_to_use,
                "three_skills_you_enjoy": relapse_prevention_plan.three_skills_you_enjoy,
                "three_people_to_talk_to": relapse_prevention_plan.three_people_to_talk_to,
                "safe_caregivers": relapse_prevention_plan.safe_caregivers,
                "have_naloxone": relapse_prevention_plan.have_naloxone,
                "comments": relapse_prevention_plan.comments,
                "date_created": relapse_prevention_plan.date_created,
                "date_last_modified": relapse_prevention_plan.date_last_modified
            }), 200
            
        else:
            relapse_prevention_plan = db.session.query(RelapsePreventionPlan).filter_by(user_id=user_id).all()

            if not relapse_prevention_plan:
                return jsonify([]), 200

            relapse_prevention_plan_list = [{
                "id": record.id,
                "user_id": record.user_id,
                "three_things_that_trigger_desire_to_use": record.three_things_that_trigger_desire_to_use,
                "three_skills_you_enjoy": record.three_skills_you_enjoy,
                "three_people_to_talk_to": record.three_people_to_talk_to,
                "safe_caregivers": record.safe_caregivers,
                "have_naloxone": record.have_naloxone,
                "comments": record.comments,
                "date_created": record.date_created,
                "date_last_modified": record.date_last_modified
            } for record in relapse_prevention_plan]

            return jsonify(relapse_prevention_plan_list), 200
            
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
@relapse_prevention_plan_bp.route('/delete_relapse_prevention_plan/<id>', methods=['DELETE'])
@jwt_required()
def delete_relapse_prevention_plan(id):
    """
    Deletes a user's relapse_prevention_plan record
    
    Request JSON Parameters:
        - user_id (string)

    Returns:
        - If successful, deletes the user's relapse_prevention_plan record and returns a confirmation message.
        - If the relapse_prevention_plan record for this user does not exist, returns a message with error code 400.
        - If there is an unexpected error, returns an error message with the error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        relapse_prevention_plan = db.session.query(RelapsePreventionPlan).filter_by(user_id=user_id, id=id).first()
        
        if not relapse_prevention_plan:
            return jsonify('relapse_prevention_plan record does not exist for this user.'), 400

        db.session.delete(relapse_prevention_plan)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify("relapse_prevention_plan record deleted."), 200