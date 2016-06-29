// js/models/user.js


var app = app || {};

// User model
// ----------


app.User = Backbone.Model.extend({
    defaults: {
        id: 0,
        uri: '',
        username: ''
    },

    url: '/users'
});
