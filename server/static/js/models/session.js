// js/models/session.js


var app = app || {};

// Session Model
// -------------
// Used to track current login session and user

app.Session = Backbone.Model.extend({

    defaults: {
        loggedIn: false,
        userID: '',
        authToken: '',
    },

    initialize: function () {
        
        this.user = new app.User();
    },

    updateSessionUser: function ( userData ) {
        this.set({user: this.user.set(_.pick(userData, _.keys(this.user.defaults)))});
    },

    getAuthToken: function () {
        return this.get('authToken')+':unused';
    },

    signup: function ( opts ) {
        var self = this;
        return $.ajax({
            url: app.API + '/users',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                'username': opts.username,
                'password': opts.password
            }), 
            success: function (res) {
                console.log(res);
                self.set({userID: res.id});
                self.updateSessionUser(res);
            },
            error: function (res) {
                console.log("Woops! " + res.status + ': ' + res.statusText);
            }
        });
    },

    login: function ( opts ) {
        var self = this;
        return $.ajax({
            url: app.API + '/auth/login',
            type: 'POST',
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify({
                'username': opts.username,
                'password': opts.password
            }), 
            success: function (res) {
                console.log(res);
                self.set({authToken: res.token, userID: res.user.id, loggedIn: true});
                self.updateSessionUser(res.user);
            },
            error: function (res) {
                console.log("Woops! " + res.status + ': ' + res.statusText);
            }
        });
    }
});
