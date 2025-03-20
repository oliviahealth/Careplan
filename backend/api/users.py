from flask import Blueprint, jsonify, request
from database import User, db, bcrypt, revoked_tokens
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timezone

users_bp = Blueprint('users', __name__, url_prefix = '/api')

@users_bp.route('/signin', methods = ['POST'])
def signin():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    access_token = None
    
    try:
        user = User.query.filter_by(email=email).first()
        
        if(user is None or not bcrypt.check_password_hash(user.password, password)):
            return jsonify({ 'error': 'Invalid credentials' }), 403
        
        access_token = create_access_token(identity=user.id)
        
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500

    return jsonify({ 'id': user.id, 'name': user.name, 'email': user.email, 'access_token': access_token}), 200
   

@users_bp.route('/signup', methods = ['POST'])
def signup():
    """
    Adds a record of the user's information to the database. 
    
    Request JSON Parameters:
        - username (str): The user's unique username.
        - name (str): The user's name.
        - age (str): The user's age.
        
    Returns:
        - If successful, adds and returns the new user's information.
        - If the user already exists, returns error messsage with error code 400.
        - If there is an unexpected error, returns error message with the error code 500.
    """
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    access_token = None
    
    try:
        existing_user = User.query.filter_by(email=email).first()

        if existing_user:
            return jsonify("This user already exists."), 400
        
        hashed_pwd = bcrypt.generate_password_hash(password).decode('utf-8')
        
        new_user = User(name=name, email=email, password=hashed_pwd, date_created=datetime.now(timezone.utc))

        db.session.add(new_user)
        db.session.commit()
        
        access_token = create_access_token(identity=new_user.id)

    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({ 'id': new_user.id, 'name': new_user.name, 'email': new_user.email, 'access_token': access_token}), 201


@users_bp.route('/signout', methods=['POST'])
@jwt_required()
def signout():    
    try:

        jwt = get_jwt()['jti']
        revoked_tokens.add(jwt)
    except Exception as error:
        return jsonify({ 'error': error }), 500
    
    return jsonify({ 'Success': 'User signed out successfully' })
   
@users_bp.route('/get_user', methods = ['POST'])
@jwt_required()
def get_user():
    """
    Get a record of a single user's information. 
        
    Returns:
        - If successful, returns the user's information.
        - If the user does not exist, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    id = get_jwt_identity()

    try:
        user = db.session.query(User).filter_by(id=id).first()

        if(not user):
            return jsonify("This user does not exist."), 400
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    
    return jsonify({
        "id": user.id,
        "email": user.email,
        "name": user.name
    }), 200

@users_bp.route('/update_user', methods = ['PUT'])
def update_user():
    """
    Updates a user's information. 
    
    Request JSON Parameters:
        - id (int): The user's unique database ID.
        - username (str): The user's unique username.
        - name (str): The user's name.

    Returns:
        - If successful, updates and returns the user's updated information.
        - If the user does not exist, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """

    data = request.get_json()
    id = data.get('id')
    username = data.get('username')
    name = data.get('name')

    try:
        user = db.session.query(User).filter_by(id=id).first()

        if(not user):
            return jsonify("There is no user with this information."), 400

        user.username = username
        user.name = name
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    return jsonify({ 'id': user.id, 'username': user.username, 'name': user.name}), 200
    
@users_bp.route('/delete_user', methods = ['DELETE'])
def delete_user():
    """
    Deletes a user's information. 
    
    Request JSON Parameters:
        - id (int): The user's unique database ID.

    Returns:
        - If successful, deletes the user's information and returns a confirmation message.
        - If the user does not exist, returns a message with the error code 400.
        - If there is an unexpected error, returns a JSON error message with the error code 500.
    """
    data = request.get_json()
    id = data.get('id')

    try:
        user = db.session.query(User).filter_by(id=id).first()
        
        if(not user):
            return jsonify('There is no user with this information.'), 400
        
        db.session.delete(user)
        db.session.commit()
    except Exception as e:
        return jsonify(f"Error processing request: {e}"), 500
    return jsonify("User deleted."), 200