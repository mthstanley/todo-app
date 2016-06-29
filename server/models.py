from datetime import datetime
from server import db, server
from passlib.apps import custom_app_context as pwd_context
from flask import url_for
from itsdangerous import (TimedJSONWebSignatureSerializer
                            as Serializer, BadSignature, SignatureExpired)


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(32), index=True)
    password_hash = db.Column(db.String(128))
    todos = db.relationship('Todo', backref='author', lazy='dynamic')


    def to_dict(self):
        cols = self.__table__.columns
        return {col.name: getattr(self, col.name) for col in cols}

    
    def to_json(self):
        user_json = {   
                        'id': self.id,
                        'username': self.username,
                        'uri': url_for('api.get_user', user_id=self.id, _external=True)
                    }
        return user_json


    def hash_password(self, password):
        self.password_hash = pwd_context.encrypt(password)


    def verify_password(self, password):
        return pwd_context.verify(password, self.password_hash)


    def generate_auth_token(self, expiration=600):
        s = Serializer(server.config['SECRET_KEY'], expires_in=expiration)
        return s.dumps({'id': self.id})


    @staticmethod
    def verify_auth_token(token):
        s = Serializer(server.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None # valid token, but expired
        except BadSignature:
            return None # invalid token
        user = User.query.get(data['id'])
        return user


class Todo(db.Model):
    __tablename__ = 'todos'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    completed = db.Column(db.Boolean, default=False)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))


    def to_json(self):
        json_todo = {
                        'id': self.id,
                        'uri': url_for('api.get_todo', todo_id=self.id, _external=True),
                        'title': self.title,
                        'timestamp': self.timestamp,
                        'completed': self.completed,
                        'author': url_for('api.get_user', user_id=self.author_id,
                                            _external=True)
                    }
        return json_todo

    @staticmethod    
    def from_json(json_todo):
        title = json_todo.get('title')
        # TODO need to add error checking
        return Todo(title=title)
