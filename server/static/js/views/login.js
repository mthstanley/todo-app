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
        this.$error = this.$('.error');
        this.$usernameInput = this.$('#username-input');
        this.$passwordInput = this.$('#password-input');
    },

    render: function () {

        return this;
    },

    displayError: function (errorCode) {
        if (errorCode === 401) {
            this.$error.html('Woops! You entered the wrong username or password.')
        }
    },

    loginAttempt: function () {
        var view = this;
        app.session.login({
            username: this.$usernameInput.val(),
            password: this.$passwordInput.val()
        })
        .fail(function ( error ) {
            view.displayError(error.status);
        })
        .done(function ( data ) {
            console.log(data);
            console.log('logged in');
            userRoute = '//' + app.session.get('user').get('username') + '/todos';
            app.router.navigate(userRoute, {trigger: true});
        });
    }


});
