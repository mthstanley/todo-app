// js/routers/router.js

// Todo Router
// -----------

var app = app || {};

var ViewManager = {
    container: $('#app-container'),
    currentView: null,
    showView: function ( view ) {
        if (this.currentView !== null && this.currentView.cid != view.cid) {
            this.currentView.remove();
        }
        this.currentView = view;
        return this.container.html(view.render().el);
    }
};

app.TodoRouter = Backbone.Router.extend({
    routes: {
        ':user/todos*filter': 'index',
        'login': 'login',
        '*path': 'defaultRoute'
    },

    index: function ( user, filter ) {
        if (app.session.get('loggedIn')){
            newView = new app.AppView({user: user});
            ViewManager.showView(newView);
            //newView.addAll();
            console.log('user: ' + user);
            console.log('filter: ' + filter);
            this.setFilter(filter);
        } else {
            app.router.navigate('//login', {trigger: true});
        }
    },

    login: function () {
        ViewManager.showView(new app.LoginView());
    },

    setFilter: function ( param ) {
        // set the current filter to be used
        if (param) {
            param = param.substring(1).trim();
        }
        console.log(param);
        app.TodoFilter = param || '';

        // trigger a collection filter event, causing hiding/unhiding
        // of todo view items
        app.Todos.trigger('filter');
    },

    defaultRoute: function (route) {
        console.log('route:' + route);
        this.login();
    }
});

