from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, String, ARRAY, DATE, Integer, TIMESTAMP
from sqlalchemy.dialects.postgresql import JSONB
from datetime import datetime
import uuid
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()
revoked_tokens = set()

class User(db.Model):
    __tablename__ = 'user'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    
    # Relationships between any child tables that will reference users
    maternal_demographics = db.relationship('MaternalDemographics', backref='user', cascade='all, delete-orphan')
    maternal_medical_history = db.relationship('MaternalMedicalHistory', backref='user', cascade='all, delete-orphan')
    psychiatric_history = db.relationship('PsychiatricHistory', backref='user', cascade='all, delete-orphan')
    substance_use_history = db.relationship('SubstanceUseHistory', backref='user', cascade='all, delete-orphan')
    drug_screening_results = db.relationship('DrugScreeningResults', backref='user', cascade='all, delete-orphan')
    medical_services_for_substance_use = db.relationship('MedicalServicesForSubstanceUse', backref='user', cascade='all, delete-orphan')
    infant_information = db.relationship('InfantInformation', backref='user', cascade='all, delete-orphan')
    family_and_supports = db.relationship('FamilyAndSupports', backref='user', cascade='all, delete-orphan')
    referrals_and_services = db.relationship('ReferralsAndServices', backref='user', cascade='all, delete-orphan')
    relapse_prevention_plan = db.relationship('RelapsePreventionPlan', backref='user', cascade='all, delete-orphan')

class MaternalDemographics(db.Model):
    __tablename__ = 'maternal_demographics'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    date_of_birth = Column(DATE, nullable=False)
    current_living_arrangement = Column(String, nullable=False)
    street_address = Column(String, nullable=False)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)  
    zip_code = Column(String, nullable=False)
    county = Column(String, nullable=False)
    primary_phone_number = Column(String, nullable=False)
    phone_type = Column(String, nullable=False)
    emergency_contact = Column(String)
    emergency_contact_phone = Column(String, nullable=False)
    relationship = Column(String, nullable=False)
    marital_status = Column(String, nullable=False)
    insurance_plan = Column(String, nullable=False)
    effective_date = Column(DATE, nullable=False) 
    subscriber_id = Column(String, nullable=False)
    group_id = Column(String, nullable=False)

    # Need to define the parent as as foreign key
    user_id = Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    date_last_modified = Column(TIMESTAMP(timezone=True))


class MaternalMedicalHistory(db.Model):
    __tablename__ = 'maternal_medical_history'

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    # gestational_age = Column(Integer, nullable=False)
    gestational_age = Column(String, nullable=False)
    anticipated_delivery_date = Column(DATE, nullable=False)
    planned_mode_delivery = Column(String, nullable=False)
    actual_mode_delivery = Column(String, nullable=False)
    attended_postpartum_visit = Column(String, nullable=False)
    postpartum_visit_location = Column(String, nullable=True)
    postpartum_visit_date = Column(DATE, nullable=True)
    # total_num_pregnancies = Column(Integer, nullable=False) 
    total_num_pregnancies = Column(String, nullable=False) 
    # total_num_live_births = Column(Integer, nullable=False)
    total_num_live_births = Column(String, nullable=False)
    # total_num_children_with_mother = Column(Integer, nullable=False)
    total_num_children_with_mother = Column(String, nullable=False)
    prior_complications = Column(String, nullable=False)
    med_problems_diagnosis = Column(String, nullable=False)
    current_medication_list = Column(ARRAY(JSONB), nullable=False, default=lambda:[])
    notes = Column(String, nullable=True)

    # Parental foreign key
    user_id = Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    date_last_modified = Column(TIMESTAMP(timezone=True))
    
class PsychiatricHistory(db.Model):
    __tablename__ = 'psychiatric_history'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    diagnosis = Column(ARRAY(JSONB), nullable=False, default=lambda:[])
    notes = Column(String, nullable=True)
    
    user_id = Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    date_last_modified = Column(TIMESTAMP(timezone=True))
    
class SubstanceUseHistory(db.Model):
    __tablename___ = 'substance_use_history'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    alcohol = Column(JSONB, nullable=False)
    benzodiazepines = Column(JSONB, nullable=False)
    cocaine = Column(JSONB, nullable=False)
    heroin = Column(JSONB, nullable=False)
    kush = Column(JSONB, nullable=False)
    marijuana = Column(JSONB, nullable=False)
    methamphetamine = Column(JSONB, nullable=False)
    prescription_drugs = Column(JSONB, nullable=False)
    tobacco = Column(JSONB, nullable=False)
    other_drugs = Column(ARRAY(JSONB), nullable=False)
    notes = Column(String, nullable=True)
    
    user_id = Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    date_last_modified = Column(TIMESTAMP(timezone=True), default=datetime)

class MedicalServicesForSubstanceUse(db.Model):    
    __tablename__ = 'medical_services_for_substance_use'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    mat_engaged = Column(String, nullable=False)
    date_used_mat = Column(DATE, nullable=True)
    medications = Column(ARRAY(JSONB), nullable=True)
    mat_clinic_name = Column(String, nullable=True)
    mat_clinic_phone = Column(String, nullable=True)
    used_addiction_medicine_services = Column(String, nullable=False, default=lambda:[])
    date_used_medicine_service = Column(DATE, nullable=True)
    addiction_medicine_clinic = Column(String, nullable=True)
    addiction_medicine_clinic_phone = Column(String, nullable=True)
    
    user_id = Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    date_last_modified = Column(TIMESTAMP(timezone=True))

class DrugScreeningResults(db.Model):
    __tablename__ = 'drug_screening_results'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    tests = Column(ARRAY(JSONB), nullable=False, default=lambda:[])

    user_id = Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    date_last_modified = Column(TIMESTAMP(timezone=True))
    
class FamilyAndSupports(db.Model):
    __tablename__ = 'family_and_supports'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    people_living_in_home = Column(ARRAY(JSONB), nullable=False, default=lambda:[])
    clients_children_not_living_in_home = Column(ARRAY(JSONB), nullable=False, default=lambda:[])
    current_support_system = Column(String, nullable=False)
    strength_of_client_and_support_system = Column(String, nullable=False)
    goals = Column(String, nullable=False)
    notes = Column(String, nullable=True)
    
    user_id = Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    date_last_modified = Column(TIMESTAMP(timezone=True))
    
class InfantInformation(db.Model):
    __tablename__ = 'infant_information'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    child_name = Column(String, nullable=False)
    date_of_birth = Column(DATE, nullable=False)
    sex = Column(String, nullable=False)
    # birth_weight = Column(Integer, nullable=False)
    birth_weight = Column(String, nullable=False)
    # gestational_age_at_birth = Column(Integer, nullable=False)
    gestational_age_at_birth = Column(String, nullable=False)
    NICU_stay = Column(String, nullable=False)
    NICU_length_of_stay = Column(String, nullable=True)
    pediatrician_name = Column(String, nullable=False)
    pediatrician_contact_info = Column(String, nullable=False)
    infant_urine_drug_screening_at_birth = Column(String, nullable=False)
    infant_urine_drug_screening_at_birth_specify = Column(String, nullable=True)
    meconium_results = Column(String, nullable=False)
    meconium_results_specify = Column(String, nullable=True)
    neonatal_opiod_withdraw = Column(String, nullable=False)
    neonatal_opiod_withdraw_treatment_method = Column(String, nullable=True)
    DX_problems_additional_information = Column(String, nullable=False)
    infant_care_needs_items = Column(JSONB, nullable=False, default=lambda:[])
    where_will_baby_sleep = Column(String, nullable=False)
    where_will_baby_sleep_specify = Column(String, nullable=True)
    infant_care_needs_additional_notes = Column(String, nullable=True)
    infant_medications = Column(ARRAY(JSONB), nullable=False)
    infant_medication_notes = Column(String, nullable=True)
    father_name = Column(String, nullable=False)
    father_date_of_birth = Column(DATE, nullable=False)
    father_street_address = Column(String, nullable=False)
    father_city = Column(String, nullable=False)
    father_state = Column(String, nullable=False)
    father_zip_code = Column(String, nullable=False)
    father_primary_phone_numbers = Column(String, nullable=False)
    father_involved_in_babys_life = Column(String, nullable=False)
    father_involved_in_babys_life_comments = Column(String, nullable=True)
    father_notes = Column(String, nullable=True)
    
    user_id = Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    date_last_modified = Column(TIMESTAMP(timezone=True))
    
class ReferralsAndServices(db.Model):
    __tablename__ = 'referrals_and_services'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    parenting_classes = Column(JSONB, nullable=False)
    transportation_services = Column(JSONB, nullable=False)
    ssi_disability = Column(JSONB, nullable=False)
    temporary_assistance_for_needy_families = Column(JSONB, nullable=False)
    personal_safety = Column(JSONB, nullable=False)
    home_visitation_program = Column(JSONB, nullable=False)
    housing_assistance = Column(JSONB, nullable=False)
    healthy_start_program = Column(JSONB, nullable=False)
    support_services_other = Column(ARRAY(JSONB), nullable=True)
    breastfeeding_support = Column(JSONB, nullable=False)
    local_food_pantries = Column(JSONB, nullable=False)
    snap = Column(JSONB, nullable=False)
    women_infants_children = Column(JSONB, nullable=False)
    food_nutrition_other = Column(ARRAY(JSONB), nullable=True)
    health_insurance_enrollment = Column(JSONB, nullable=False)
    prenatal_healthcare = Column(JSONB, nullable=False)
    family_planning = Column(JSONB, nullable=False)
    primary_care = Column(JSONB, nullable=False)
    mental_health_counseling = Column(JSONB, nullable=False)
    smoking_cessation = Column(JSONB, nullable=False)
    healthcare_other = Column(ARRAY(JSONB), nullable=True)
    residential = Column(JSONB, nullable=False)
    outpatient = Column(JSONB, nullable=False)
    caring_for_two_program = Column(JSONB, nullable=False)
    the_cradles_program = Column(JSONB, nullable=False)
    recovery_support_services = Column(JSONB, nullable=False)
    medication_assisted_treatment = Column(JSONB, nullable=False)
    substance_use_treatment_other = Column(ARRAY(JSONB), nullable=True)
    early_childhood_intervention = Column(JSONB, nullable=False)
    early_head_start = Column(JSONB, nullable=False)
    NCI_childcare_subsidy = Column(JSONB, nullable=False)
    pediatrician_primary_care = Column(JSONB, nullable=False)
    safe_sleep_education = Column(JSONB, nullable=False)
    child_related_other = Column(ARRAY(JSONB), nullable=True)
    child_protective_service = Column(JSONB, nullable=False)
    legal_aid = Column(JSONB, nullable=False)
    specialty_court = Column(JSONB, nullable=False)
    legal_assistance_other = Column(ARRAY(JSONB), nullable=True)
    additional_notes = Column(String, nullable=True)

    user_id = Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    date_last_modified = Column(TIMESTAMP(timezone=True))
        
class RelapsePreventionPlan(db.Model):
    __tablename__ = 'relapse_prevention_plan'
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    three_things_that_trigger_desire_to_use = Column(String, nullable=False)
    three_skills_you_enjoy = Column(String, nullable=False)
    three_people_to_talk_to = Column(String, nullable=False)
    safe_caregivers =  Column(ARRAY(JSONB), nullable=False, default=lambda:[])
    have_naloxone = Column(String, nullable=False)
    comments = Column(String, nullable=True)
    
    user_id = Column(String, db.ForeignKey('user.id', ondelete='CASCADE'), nullable=False)
    date_created = Column(TIMESTAMP(timezone=True))
    date_last_modified = Column(TIMESTAMP(timezone=True))