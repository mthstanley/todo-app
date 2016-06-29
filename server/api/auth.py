from flask import jsonify, request, g, abort, url_for
from ..models import User
from . import api
from .. import db


@api.route('/auth/login', methods=['POST'])
def get_auth_token():
    data = request.get_json()
    print(data)
    if data is None or not 'username' in data or not 'password' in data:
        abort(400)
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    if not user or not user.verify_password(password): 
        abort(401)
    
    token = user.generate_auth_token()
    return jsonify({'token': token.decode('ascii'), 'user': user.to_json()})
