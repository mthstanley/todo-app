from flask import jsonify, request, g, abort, url_for
from ..models import User
from . import api
from .. import db
from .authentication import auth


################################################################################
#                           User Resource Routes                               #
################################################################################


@api.route('/users', methods=['GET'])
@auth.login_required
def get_users():
    return jsonify(users=[user.to_json() for user in User.query.all()])


@api.route('/users/<int:user_id>', methods=['GET'])
@auth.login_required
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        abort(400)
    return jsonify(user.to_json())


@api.route('/users/<int:user_id>/todos', methods=['GET'])
@auth.login_required
def get_user_todos(user_id):
    if not g.current_user.id == user_id:
        abort(403)
    user = User.query.get(user_id)
    return jsonify(todos=[todo.to_json() for todo in user.todos])



@api.route('/users', methods=['POST'])
@auth.login_required
def new_user():
    username = request.json.get('username')
    password = request.json.get('password')
    if username is None or password is None:
        abort(400) # missing arguments
    if User.query.filter_by(username=username).first() is not None:
        abort(400) # existing user
    user = User(username=username)
    user.hash_password(password)
    db.session.add(user)
    db.session.commit()
    return (jsonify({'username': user.username}), 201, 
            {'Location': url_for('api.get_user', user_id=user.id, _external=True)})
