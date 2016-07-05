// js/collections/usertodos.js

var app = app || {};

// User Todo Collection
// --------------------


app.UserTodos = app.TodoList.extend({
    
    initialize: function (models, options) {
        this.id = options.id;
    },
    
    sync: function (method, model, options) {
        console.log(method);
        if (method === 'read'){
            options.url = app.API + '/users/' + this.id + '/todos';
        } else {
            options.url = model.url();
        }
        return Backbone.sync(method, model, options);
    }
});
