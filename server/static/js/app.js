// js/app.js

var app = app || {}
var ENTER_KEY = 13;

$(function() {
    
    // kick things off by creating the **App**
    //new app.AppView();

    var backboneSync = Backbone.sync;
    Backbone.sync = function ( method, model, options ) {
        options.headers = {
            'Authorization' : 'Basic ' + btoa(app.session.getAuthToken())
        };

        backboneSync(method, model, options);
    };

    app.session = new app.Session();
    app.API = '/api/v1.0';
    // create our global collection of **Todos**
    app.Todos = new app.TodoList();
    app.router = new app.TodoRouter();
    Backbone.history.start();

    
});
