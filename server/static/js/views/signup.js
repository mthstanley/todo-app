// js/views/signup.js

var app = app || {};

// Signup Page View
// ----------------

app.SignupView = Backbone.View.extend({
    
    template: _.template( $('#signup-template').html() ),

    events: {
        'click #signup-btn': 'signupAttempt'
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

    signupAttempt: function () {
        var view = this;
        app.session.signup({
            username: this.$usernameInput.val(),
            password: this.$passwordInput.val()
        })
        .fail(function ( error ) {
            view.displayError(error.status);
        })
        .done(
            app.session.login({        
                username: this.$usernameInput.val(),
                password: this.$passwordInput.val()
            }).done(function ( data ) { 
                userRoute = '//' + app.session.get('user').get('username') + '/todos';
                app.router.navigate(userRoute, {trigger: true});
            })
        );
    },

    signupRedirect: function () {
        app.router.navigate('//signup', {trigger: true});
    }


});
