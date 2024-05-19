from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..database import ReferralsAndServices, db, User
from datetime import datetime, timezone

referrals_and_services_bp = Blueprint('referrals_and_services', __name__, url_prefix='/api')

@referrals_and_services_bp.route('/add_referrals_and_services', methods=['POST'])
@jwt_required()
def add_referrals_and_services():
    """
    Creates a referrals_and_services record for the user.

    Request JSON Parameters:

        Format for all below JSONB objects: 
        {
            status: string
            organization: string
            organization_contact_information: string
        }

        - user_id (string)
        - parenting_classes (JSONB)
        - transportation_services (JSONB)
        - ssi_disability (JSONB)
        - temporary_assistance_for_needy_families (JSONB)
        - personal_safety (JSONB)
        - home_visitation_program (JSONB)
        - housing_assistance (JSONB)
        - healthy_start_program (JSONB)
        - support_services_other (JSONB [])
        - breastfeeding_support (JSONB)
        - local_food_pantries (JSONB)
        - snap (JSONB)
        - women_infants_children (JSONB)
        - food_nutrition_other (JSONB [])
        - health_insurance_enrollment (JSONB)
        - prenatal_healthcare (JSONB)
        - family_planning (JSONB)
        - primary_care (JSONB)
        - mental_health_counseling (JSONB)
        - smoking_cessation (JSONB)
        - healthcare_other (JSONB [])
        - residential (JSONB)
        - outpatient (JSONB)
        - caring_for_two_program (JSONB)
        - the_cradles_program (JSONB)
        - recovery_support_services (JSONB)
        - medication_assisted_treatment (JSONB)
        - substance_use_treatment_other (JSONB [])
        - early_childhood_intervention (JSONB)
        - early_head_start (JSONB)
        - NCI_childcare_subsidy (JSONB)
        - pediatrician_primary_care (JSONB)
        - safe_sleep_education (JSONB)
        - child_related_other (JSONB [])
        - child_protective_service (JSONB)
        - legal_aid (JSONB)
        - specialty_court (JSONB) 
        - legal_assistance_other (JSONB [])
        - additional_notes (String)

    Returns:
        - If successful, adds and returns the user's referrals_and_services record.
        - If referrals_and_services record for user already exists, returns error code 400.
        - If there is an unexpected error, returns error code 500.
    """
    data = request.get_json()

    user_id = get_jwt_identity()
    
    parenting_classes = data.get('parenting_classes')
    transportation_services = data.get('transportation_services')
    ssi_disability = data.get('ssi_disability')
    temporary_assistance_for_needy_families = data.get('temporary_assistance_for_needy_families')
    personal_safety = data.get('personal_safety')
    home_visitation_program = data.get('home_visitation_program')
    housing_assistance = data.get('housing_assistance')
    healthy_start_program = data.get('healthy_start_program')
    support_services_other = data.get('support_services_other')
    breastfeeding_support = data.get('breastfeeding_support')
    local_food_pantries = data.get('local_food_pantries')
    snap = data.get('snap')
    women_infants_children = data.get('women_infants_children')
    food_nutrition_other = data.get('food_nutrition_other')
    health_insurance_enrollment = data.get('health_insurance_enrollment')
    prenatal_healthcare = data.get('prenatal_healthcare')
    family_planning = data.get('family_planning')
    primary_care = data.get('primary_care')
    mental_health_counseling = data.get('mental_health_counseling')
    smoking_cessation = data.get('smoking_cessation')
    healthcare_other = data.get('healthcare_other')
    residential = data.get('residential')
    outpatient = data.get('outpatient')
    caring_for_two_program = data.get('caring_for_two_program')
    the_cradles_program = data.get('the_cradles_program')
    recovery_support_services = data.get('recovery_support_services')
    medication_assisted_treatment = data.get('medication_assisted_treatment')
    substance_use_treatment_other = data.get('substance_use_treatment_other')
    early_childhood_intervention = data.get('early_childhood_intervention')
    early_head_start = data.get('early_head_start')
    NCI_childcare_subsidy = data.get('NCI_childcare_subsidy')
    pediatrician_primary_care = data.get('pediatrician_primary_care')
    safe_sleep_education = data.get('safe_sleep_education')
    child_related_other = data.get('child_related_other')
    child_protective_service = data.get('child_protective_service')
    legal_aid = data.get('legal_aid')
    specialty_court = data.get('specialty_court')
    legal_assistance_other = data.get('legal_assistance_other')
    additional_notes = data.get('additional_notes')

    try:

        user = db.session.query(User).filter_by(id=user_id).first()

        if not user:
            return jsonify("User not found."), 404

        new_referrals_and_services = ReferralsAndServices(
            user_id=user_id,
            parenting_classes=parenting_classes,
            transportation_services=transportation_services,
            ssi_disability=ssi_disability,
            temporary_assistance_for_needy_families=temporary_assistance_for_needy_families,
            personal_safety=personal_safety,
            home_visitation_program=home_visitation_program,
            housing_assistance=housing_assistance,
            healthy_start_program=healthy_start_program,
            support_services_other=support_services_other,
            breastfeeding_support=breastfeeding_support,
            local_food_pantries=local_food_pantries,
            snap=snap,
            women_infants_children=women_infants_children,
            food_nutrition_other=food_nutrition_other,
            health_insurance_enrollment=health_insurance_enrollment,
            prenatal_healthcare=prenatal_healthcare,
            family_planning=family_planning,
            primary_care=primary_care,
            mental_health_counseling=mental_health_counseling,
            smoking_cessation=smoking_cessation,
            healthcare_other=healthcare_other,
            residential=residential,
            outpatient=outpatient,
            caring_for_two_program=caring_for_two_program,
            the_cradles_program=the_cradles_program,
            recovery_support_services=recovery_support_services,
            medication_assisted_treatment=medication_assisted_treatment,
            substance_use_treatment_other=substance_use_treatment_other,
            early_childhood_intervention=early_childhood_intervention,
            early_head_start=early_head_start,
            NCI_childcare_subsidy=NCI_childcare_subsidy,
            pediatrician_primary_care=pediatrician_primary_care,
            safe_sleep_education=safe_sleep_education,
            child_related_other=child_related_other,
            child_protective_service=child_protective_service,
            legal_aid=legal_aid,
            specialty_court=specialty_court,
            legal_assistance_other=legal_assistance_other,
            additional_notes=additional_notes,
            date_created=datetime.now(timezone.utc),
            date_last_modified=datetime.now(timezone.utc)
        )

        db.session.add(new_referrals_and_services)
        db.session.commit()

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify({
        "id": new_referrals_and_services.id,
        "user_id": new_referrals_and_services.user_id,
        "parenting_classes": new_referrals_and_services.parenting_classes,
        "transportation_services": new_referrals_and_services.transportation_services,
        "ssi_disability": new_referrals_and_services.ssi_disability,
        "temporary_assistance_for_needy_families": new_referrals_and_services.temporary_assistance_for_needy_families,
        "personal_safety": new_referrals_and_services.personal_safety,
        "home_visitation_program": new_referrals_and_services.home_visitation_program,
        "housing_assistance": new_referrals_and_services. housing_assistance,
        "healthy_start_program": new_referrals_and_services.healthy_start_program,
        "support_services_other": new_referrals_and_services.support_services_other,
        "breastfeeding_support": new_referrals_and_services.breastfeeding_support,
        "local_food_pantries": new_referrals_and_services.local_food_pantries,
        "snap": new_referrals_and_services.snap,
        "women_infants_children": new_referrals_and_services.women_infants_children,
        "food_nutrition_other": new_referrals_and_services.food_nutrition_other,
        "health_insurance_enrollment": new_referrals_and_services.health_insurance_enrollment,
        "prenatal_healthcare": new_referrals_and_services.prenatal_healthcare,
        "family_planning": new_referrals_and_services.family_planning,
        "primary_care": new_referrals_and_services.primary_care,
        "mental_health_counseling": new_referrals_and_services.mental_health_counseling,
        "smoking_cessation": new_referrals_and_services.smoking_cessation,
        "healthcare_other": new_referrals_and_services.healthcare_other,
        "residential": new_referrals_and_services.residential,
        "outpatient": new_referrals_and_services.outpatient,
        "caring_for_two_program": new_referrals_and_services.caring_for_two_program,
        "the_cradles_program": new_referrals_and_services.the_cradles_program,
        "recovery_support_services": new_referrals_and_services.recovery_support_services,
        "medication_assisted_treatment": new_referrals_and_services.medication_assisted_treatment,
        "substance_use_treatment_other": new_referrals_and_services.substance_use_treatment_other,
        "early_childhood_intervention": new_referrals_and_services.early_childhood_intervention,
        "early_head_start": new_referrals_and_services.early_head_start,
        "NCI_childcare_subsidy": new_referrals_and_services.NCI_childcare_subsidy,
        "pediatrician_primary_care": new_referrals_and_services.pediatrician_primary_care,
        "safe_sleep_education": new_referrals_and_services.safe_sleep_education,
        "child_related_other": new_referrals_and_services.child_related_other,
        "child_protective_service": new_referrals_and_services.child_protective_service,
        "legal_aid": new_referrals_and_services.legal_aid,
        "specialty_court": new_referrals_and_services.specialty_court,
        "legal_assistance_other": new_referrals_and_services.legal_assistance_other,
        "additional_notes": new_referrals_and_services.additional_notes,
        "date_created": new_referrals_and_services.date_created,
        "date_last_modified": new_referrals_and_services.date_last_modified
    }), 201
    
@referrals_and_services_bp.route('/get_referrals_and_services', methods=['GET'])
@referrals_and_services_bp.route('/get_referrals_and_services/<id>', methods=['GET'])
@jwt_required()
def get_referrals_and_services(id=None):
    """
    Gets a referrals_and_services record for a user.
    
    Request JSON Parameters:
        - user_id (string)
    
    Returns:
        - If successful, returns a user's referrals_and_services record.
        - If the referrals_and_services record does not exist in the database, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    user_id = get_jwt_identity()
    
    try:
        user = db.session.query(User).filter_by(id=user_id).first()

        if not user:
            return jsonify("User not found."), 404
        
        if id:
            referrals_and_services = db.session.query(ReferralsAndServices).filter_by(user_id=user_id, id=id).first()
            
            if(not referrals_and_services):
                return jsonify("Invalid referrals_and_services id"), 400

            return jsonify({
                "id": referrals_and_services.id,
                "user_id": referrals_and_services.user_id,
                "parenting_classes": referrals_and_services.parenting_classes,
                "transportation_services": referrals_and_services.transportation_services,
                "ssi_disability": referrals_and_services.ssi_disability,
                "temporary_assistance_for_needy_families": referrals_and_services.temporary_assistance_for_needy_families,
                "personal_safety": referrals_and_services.personal_safety,
                "home_visitation_program": referrals_and_services.home_visitation_program,
                "housing_assistance": referrals_and_services. housing_assistance,
                "healthy_start_program": referrals_and_services.healthy_start_program,
                "support_services_other": referrals_and_services.support_services_other,
                "breastfeeding_support": referrals_and_services.breastfeeding_support,
                "local_food_pantries": referrals_and_services.local_food_pantries,
                "snap": referrals_and_services.snap,
                "women_infants_children": referrals_and_services.women_infants_children,
                "food_nutrition_other": referrals_and_services.food_nutrition_other,
                "health_insurance_enrollment": referrals_and_services.health_insurance_enrollment,
                "prenatal_healthcare": referrals_and_services.prenatal_healthcare,
                "family_planning": referrals_and_services.family_planning,
                "primary_care": referrals_and_services.primary_care,
                "mental_health_counseling": referrals_and_services.mental_health_counseling,
                "smoking_cessation": referrals_and_services.smoking_cessation,
                "healthcare_other": referrals_and_services.healthcare_other,
                "residential": referrals_and_services.residential,
                "outpatient": referrals_and_services.outpatient,
                "caring_for_two_program": referrals_and_services.caring_for_two_program,
                "the_cradles_program": referrals_and_services.the_cradles_program,
                "recovery_support_services": referrals_and_services.recovery_support_services,
                "medication_assisted_treatment": referrals_and_services.medication_assisted_treatment,
                "substance_use_treatment_other": referrals_and_services.substance_use_treatment_other,
                "early_childhood_intervention": referrals_and_services.early_childhood_intervention,
                "early_head_start": referrals_and_services.early_head_start,
                "NCI_childcare_subsidy": referrals_and_services.NCI_childcare_subsidy,
                "pediatrician_primary_care": referrals_and_services.pediatrician_primary_care,
                "safe_sleep_education": referrals_and_services.safe_sleep_education,
                "child_related_other": referrals_and_services.child_related_other,
                "child_protective_service": referrals_and_services.child_protective_service,
                "legal_aid": referrals_and_services.legal_aid,
                "specialty_court": referrals_and_services.specialty_court,
                "legal_assistance_other": referrals_and_services.legal_assistance_other,
                "additional_notes": referrals_and_services.additional_notes,
                "date_created": referrals_and_services.date_created,
                "date_last_modified": referrals_and_services.date_last_modified
            }), 200
            
        else:
            referrals_and_services = db.session.query(ReferralsAndServices).filter_by(user_id=user_id).all()

            if not referrals_and_services:
                return jsonify([]), 200

            referrals_and_services_list = [{
                "id": record.id,
                "user_id": record.user_id,
                "parenting_classes": record.parenting_classes,
                "transportation_services": record.transportation_services,
                "ssi_disability": record.ssi_disability,
                "temporary_assistance_for_needy_families": record.temporary_assistance_for_needy_families,
                "personal_safety": record.personal_safety,
                "home_visitation_program": record.home_visitation_program,
                "housing_assistance": record. housing_assistance,
                "healthy_start_program": record.healthy_start_program,
                "support_services_other": record.support_services_other,
                "breastfeeding_support": record.breastfeeding_support,
                "local_food_pantries": record.local_food_pantries,
                "snap": record.snap,
                "women_infants_children": record.women_infants_children,
                "food_nutrition_other": record.food_nutrition_other,
                "health_insurance_enrollment": record.health_insurance_enrollment,
                "prenatal_healthcare": record.prenatal_healthcare,
                "family_planning": record.family_planning,
                "primary_care": record.primary_care,
                "mental_health_counseling": record.mental_health_counseling,
                "smoking_cessation": record.smoking_cessation,
                "healthcare_other": record.healthcare_other,
                "residential": record.residential,
                "outpatient": record.outpatient,
                "caring_for_two_program": record.caring_for_two_program,
                "the_cradles_program": record.the_cradles_program,
                "recovery_support_services": record.recovery_support_services,
                "medication_assisted_treatment": record.medication_assisted_treatment,
                "substance_use_treatment_other": record.substance_use_treatment_other,
                "early_childhood_intervention": record.early_childhood_intervention,
                "early_head_start": record.early_head_start,
                "NCI_childcare_subsidy": record.NCI_childcare_subsidy,
                "pediatrician_primary_care": record.pediatrician_primary_care,
                "safe_sleep_education": record.safe_sleep_education,
                "child_related_other": record.child_related_other,
                "child_protective_service": record.child_protective_service,
                "legal_aid": record.legal_aid,
                "specialty_court": record.specialty_court,
                "legal_assistance_other": record.legal_assistance_other,
                "additional_notes": record.additional_notes,
                "date_created": record.date_created,
                "date_last_modified": record.date_last_modified
            } for record in referrals_and_services]

            return jsonify(referrals_and_services_list), 200
            
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500


@referrals_and_services_bp.route('/update_referrals_and_services/<id>', methods=['PUT'])
@jwt_required()
def update_referrals_and_services(id):
    """
    Updates the referrals_and_services record for the user.

    Request JSON Parameters:

        Format for all below JSONB objects: 
        {
            status: string
            organization: string
            organization_contact_information: string
        }

        - user_id (string)
        - parenting_classes (JSONB)
        - transportation_services (JSONB)
        - ssi_disability (JSONB)
        - temporary_assistance_for_needy_families (JSONB)
        - personal_safety (JSONB)
        - home_visitation_program (JSONB)
        - housing_assistance (JSONB)
        - healthy_start_program (JSONB)
        - support_services_other (JSONB)
        - breastfeeding_support (JSONB)
        - local_food_pantries (JSONB)
        - snap (JSONB)
        - women_infants_children (JSONB)
        - food_nutrition_other (JSONB)
        - health_insurance_enrollment (JSONB)
        - prenatal_healthcare (JSONB)
        - family_planning (JSONB)
        - primary_care (JSONB)
        - mental_health_counseling (JSONB)
        - smoking_cessation (JSONB)
        - healthcare_other (JSONB)
        - residential (JSONB)
        - outpatient (JSONB)
        - caring_for_two_program (JSONB)
        - the_cradles_program (JSONB)
        - recovery_support_services (JSONB)
        - medication_assisted_treatment (JSONB)
        - substance_use_treatment_other (JSONB)
        - early_childhood_intervention (JSONB)
        - early_head_start (JSONB)
        - NCI_childcare_subsidy (JSONB)
        - pediatrician_primary_care (JSONB)
        - safe_sleep_education (JSONB)
        - child_related_other (JSONB)
        - child_protective_service (JSONB)
        - legal_aid (JSONB)
        - specialty_court (JSONB) 
        - legal_assistance_other (JSONB)
        - additional_notes (String)

    Returns:
        - If successful, updates and returns the user's referrals_and_services record.
        - If referrals_and_services record for user does not exist, returns error code 400.
        - If there is an unexpected error, returns error code 500.
    """
    data = request.get_json()

    user_id = get_jwt_identity()
    
    parenting_classes = data.get('parenting_classes')
    transportation_services = data.get('transportation_services')
    ssi_disability = data.get('ssi_disability')
    temporary_assistance_for_needy_families = data.get('temporary_assistance_for_needy_families')
    personal_safety = data.get('personal_safety')
    home_visitation_program = data.get('home_visitation_program')
    housing_assistance = data.get('housing_assistance')
    healthy_start_program = data.get('healthy_start_program')
    support_services_other = data.get('support_services_other')
    breastfeeding_support = data.get('breastfeeding_support')
    local_food_pantries = data.get('local_food_pantries')
    snap = data.get('snap')
    women_infants_children = data.get('women_infants_children')
    food_nutrition_other = data.get('food_nutrition_other')
    health_insurance_enrollment = data.get('health_insurance_enrollment')
    prenatal_healthcare = data.get('prenatal_healthcare')
    family_planning = data.get('family_planning')
    primary_care = data.get('primary_care')
    mental_health_counseling = data.get('mental_health_counseling')
    smoking_cessation = data.get('smoking_cessation')
    healthcare_other = data.get('healthcare_other')
    residential = data.get('residential')
    outpatient = data.get('outpatient')
    caring_for_two_program = data.get('caring_for_two_program')
    the_cradles_program = data.get('the_cradles_program')
    recovery_support_services = data.get('recovery_support_services')
    medication_assisted_treatment = data.get('medication_assisted_treatment')
    substance_use_treatment_other = data.get('substance_use_treatment_other')
    early_childhood_intervention = data.get('early_childhood_intervention')
    early_head_start = data.get('early_head_start')
    NCI_childcare_subsidy = data.get('NCI_childcare_subsidy')
    pediatrician_primary_care = data.get('pediatrician_primary_care')
    safe_sleep_education = data.get('safe_sleep_education')
    child_related_other = data.get('child_related_other')
    child_protective_service = data.get('child_protective_service')
    legal_aid = data.get('legal_aid')
    specialty_court = data.get('specialty_court')
    legal_assistance_other = data.get('legal_assistance_other')
    additional_notes = data.get('additional_notes')

    try:
        referrals_and_services = db.session.query(
            ReferralsAndServices).filter_by(user_id=user_id, id=id).first()

        if not referrals_and_services:
            return jsonify("referrals_and_services record for this user does not exist."), 400

        referrals_and_services.parenting_classes = parenting_classes
        referrals_and_services.transportation_services = transportation_services
        referrals_and_services.ssi_disability = ssi_disability
        referrals_and_services.temporary_assistance_for_needy_families = temporary_assistance_for_needy_families
        referrals_and_services.personal_safety = personal_safety
        referrals_and_services.home_visitation_program = home_visitation_program
        referrals_and_services.housing_assistance = housing_assistance
        referrals_and_services.healthy_start_program = healthy_start_program
        referrals_and_services.support_services_other = support_services_other
        referrals_and_services.breastfeeding_support = breastfeeding_support
        referrals_and_services.local_food_pantries = local_food_pantries
        referrals_and_services.snap = snap
        referrals_and_services.women_infants_children = women_infants_children
        referrals_and_services.food_nutrition_other = food_nutrition_other
        referrals_and_services.health_insurance_enrollment = health_insurance_enrollment
        referrals_and_services.prenatal_healthcare = prenatal_healthcare
        referrals_and_services.family_planning = family_planning
        referrals_and_services.primary_care = primary_care
        referrals_and_services.mental_health_counseling = mental_health_counseling
        referrals_and_services.smoking_cessation = smoking_cessation
        referrals_and_services.healthcare_other = healthcare_other
        referrals_and_services.residential = residential
        referrals_and_services.outpatient = outpatient
        referrals_and_services.caring_for_two_program = caring_for_two_program
        referrals_and_services.the_cradles_program = the_cradles_program
        referrals_and_services.recovery_support_services = recovery_support_services
        referrals_and_services.medication_assisted_treatment = medication_assisted_treatment
        referrals_and_services.substance_use_treatment_other = substance_use_treatment_other
        referrals_and_services.early_childhood_intervention = early_childhood_intervention
        referrals_and_services.early_head_start = early_head_start
        referrals_and_services.NCI_childcare_subsidy = NCI_childcare_subsidy
        referrals_and_services.pediatrician_primary_care = pediatrician_primary_care
        referrals_and_services.safe_sleep_education = safe_sleep_education
        referrals_and_services.child_related_other = child_related_other
        referrals_and_services.child_protective_service = child_protective_service
        referrals_and_services.legal_aid = legal_aid
        referrals_and_services.specialty_court = specialty_court
        referrals_and_services.legal_assistance_other = legal_assistance_other
        referrals_and_services.additional_notes = additional_notes
        referrals_and_services.date_last_modified=datetime.now(timezone.utc)
        db.session.commit()

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify({
        "id": referrals_and_services.id,
        "user_id": referrals_and_services.user_id,
        "parenting_classes": referrals_and_services.parenting_classes,
        "transportation_services": referrals_and_services.transportation_services,
        "ssi_disability": referrals_and_services.ssi_disability,
        "temporary_assistance_for_needy_families": referrals_and_services.temporary_assistance_for_needy_families,
        "personal_safety": referrals_and_services.personal_safety,
        "home_visitation_program": referrals_and_services.home_visitation_program,
        "housing_assistance": referrals_and_services. housing_assistance,
        "healthy_start_program": referrals_and_services.healthy_start_program,
        "support_services_other": referrals_and_services.support_services_other,
        "breastfeeding_support": referrals_and_services.breastfeeding_support,
        "local_food_pantries": referrals_and_services.local_food_pantries,
        "snap": referrals_and_services.snap,
        "women_infants_children": referrals_and_services.women_infants_children,
        "food_nutrition_other": referrals_and_services.food_nutrition_other,
        "health_insurance_enrollment": referrals_and_services.health_insurance_enrollment,
        "prenatal_healthcare": referrals_and_services.prenatal_healthcare,
        "family_planning": referrals_and_services.family_planning,
        "primary_care": referrals_and_services.primary_care,
        "mental_health_counseling": referrals_and_services.mental_health_counseling,
        "smoking_cessation": referrals_and_services.smoking_cessation,
        "healthcare_other": referrals_and_services.healthcare_other,
        "residential": referrals_and_services.residential,
        "outpatient": referrals_and_services.outpatient,
        "caring_for_two_program": referrals_and_services.caring_for_two_program,
        "the_cradles_program": referrals_and_services.the_cradles_program,
        "recovery_support_services": referrals_and_services.recovery_support_services,
        "medication_assisted_treatment": referrals_and_services.medication_assisted_treatment,
        "substance_use_treatment_other": referrals_and_services.substance_use_treatment_other,
        "early_childhood_intervention": referrals_and_services.early_childhood_intervention,
        "early_head_start": referrals_and_services.early_head_start,
        "NCI_childcare_subsidy": referrals_and_services.NCI_childcare_subsidy,
        "pediatrician_primary_care": referrals_and_services.pediatrician_primary_care,
        "safe_sleep_education": referrals_and_services.safe_sleep_education,
        "child_related_other": referrals_and_services.child_related_other,
        "child_protective_service": referrals_and_services.child_protective_service,
        "legal_aid": referrals_and_services.legal_aid,
        "specialty_court": referrals_and_services.specialty_court,
        "legal_assistance_other": referrals_and_services.legal_assistance_other,
        "additional_notes": referrals_and_services.additional_notes,
        "date_created": referrals_and_services.date_created,
        "date_last_modified": referrals_and_services.date_last_modified
    }), 200


@referrals_and_services_bp.route('/delete_referrals_and_services/<id>', methods=['DELETE'])
@jwt_required()
def delete_referrals_and_services(id):
    """
    Deletes a user's referrals_and_services record

    Request JSON Parameters:
        - user_id (string)

    Returns:
        - If successful, deletes the user's referrals_and_services record and returns a confirmation message.
        - If the referrals_and_services record for this user does not exist, returns a message with error code 400.
        - If there is an unexpected error, returns an error message with the error code 500.
    """
    user_id = get_jwt_identity()

    try:
        referrals_and_services = db.session.query(
            ReferralsAndServices).filter_by(user_id=user_id, id=id).first()

        if not referrals_and_services:
            return jsonify('referrals_and_services record does not exist for this user.'), 400

        db.session.delete(referrals_and_services)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify("referrals_and_services record deleted."), 200
