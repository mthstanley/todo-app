// js/views/login.js

var app = app || {};

// Login Page View
// ---------------

app.LoginView = Backbone.View.extend({
    
    template: _.template( $('#login-template').html() ),

    events: {
        'click #login-btn': 'loginAttempt'
    },

    initialize: function () {
        this.$el.html( this.template() );
        this.$usernameInput = this.$('#username-input');
        this.$passwordInput = this.$('#password-input');
    },

    render: function () {

        return this;
    },

    loginAttempt: function () {
        app.session.login({
            username: this.$usernameInput.val(),
            password: this.$passwordInput.val()
        }).done(function ( data ) {
            console.log(data);
            console.log('logged in');
            userRoute = '//' + app.session.get('user').get('username') + '/todos';
            app.router.navigate(userRoute, {trigger: true});
        });
    }


});
