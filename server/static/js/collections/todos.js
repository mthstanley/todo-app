// js/collections/todos.js

var app = app || {};

// Todo Collection
// ---------------


app.TodoList = Backbone.Collection.extend({
    
    // reference to this collection's model
    model: app.Todo,

    // rest api uri
    url: function () {
        return app.API + '/todos';
    },

    parse: function( response ) {
        return response.todos;
    },
    
    // filter down the list of all todo items that are finished
    completed: function() {
        return this.where({completed: true});
    },

    // filter down the list to only the todo items that are still not finished
    remaining: function() {
        return this.where({completed: false});
    }
    /*
    // we keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items
    nextOrder: function() {
        if( !this.length ) {
            return 1;
        }
        return this.last().get('order') + 1;
    },

    // todos are sorted by their original insertion order
    comparator: function( todo ) {
        return todo.get('order');
    }
    */
});

