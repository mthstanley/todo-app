from flask import g, jsonify, request
from flask.ext.httpauth import HTTPBasicAuth
from ..models import User
from . import api


auth = HTTPBasicAuth()


@auth.verify_password
def verify_password(username_or_token, password):
    # first try to authenticate by token
    user = User.verify_auth_token(username_or_token)
    if not user:
        # try authenticating with username/password
        user = User.query.filter_by(username=username_or_token).first()
        if not user or not user.verify_password(password):
            return False
    g.current_user = user
    return True


@api.before_request
#@auth.login_required
def before_request():
    pass


