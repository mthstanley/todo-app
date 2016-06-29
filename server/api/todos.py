from flask import jsonify, request, g, abort, url_for
from ..models import Todo
from . import api
from .. import db
from .authentication import auth


################################################################################
#                           Todo Resource Routes                               #
################################################################################


@api.route('/todos', methods=['GET'])
@auth.login_required
def get_todos():
    return jsonify(todos=[todo.to_json() for todo in Todo.query.all()])


@api.route('/todos/<int:todo_id>', methods=['GET'])
@auth.login_required
def get_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if not todo:
        abort(400)
    return jsonify(todo.to_json())


@api.route('/todos', methods=['POST'])
@auth.login_required
def create_todo():
    if not request.json or not 'title' in request.json:
        abort(400)
    todo = Todo.from_json(request.json)
    todo.author = g.current_user
    db.session.add(todo)
    db.session.commit()
    return (jsonify(todo.to_json()), 201, 
            {'Location': url_for('api.get_todo', todo_id=todo.id, _external=True)})


@api.route('/todos/<int:todo_id>', methods=['PUT'])
@auth.login_required
def update_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if not todo:
        abort(400)
    if not request.json:
        abort(400)
    if 'title' in request.json and type(request.json['title']) != str:
        abort(400)
    if 'completed' in request.json and type(request.json['completed']) is not bool:
        abort(400)
    todo.title = request.json.get('title', todo.title)
    todo.completed = request.json.get('completed', todo.completed)
    db.session.add(todo)
    db.session.commit()
    return jsonify(todo.to_json())

@api.route('/todos/<int:todo_id>', methods=['DELETE'])
@auth.login_required
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if not Todo:
        abort(404)
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'result': True})

