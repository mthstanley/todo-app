// js/views/app.js


var app = app || {};

// The application
// ---------------

// Our overall **AppView** is the top-level piece of UI
app.AppView = Backbone.View.extend({
    
    template: _.template( $('#main-template').html() ),

    // Our template for the line of statistics at the bottom of the app
    statsTemplate: _.template( $('#stats-template').html() ),

    // delegated events for creating new items, and clearing completed ones
    events : {
        'keypress .new-todo': 'createOnEnter',
        'click .clear-completed': 'clearCompleted',
        'click .toggle-all': 'toggleAllComplete'
    },

    // at initialization we bind to relevant events on `Todos`
    // collection, when items are added or changed
    initialize: function( options ) {
        this.user = options.user;
        this.$el.html(this.template({
            user: this.user
        }));
        this.allCheckbox = this.$('.toggle-all')[0];
        this.$input = this.$('.new-todo');
        this.$footer = this.$('.footer');
        this.$main = this.$('.main');

        this.listenTo(app.Todos, 'add', this.addOne);
        this.listenTo(app.Todos, 'reset', this.addAll);

        this.listenTo(app.Todos, 'change:completed', this.filterOne);
        this.listenTo(app.Todos, 'filter', this.filterAll);
        this.listenTo(app.Todos, 'all', this.render);
        app.Todos.fetch();
        this.addAll();
    },

    // re-rendering the app just means refreshing the statistics -- the rest
    // of the app doesn't change
    render: function() {
        var completed = app.Todos.completed().length;
        var remaining = app.Todos.remaining().length;

        if( app.Todos.length ) {
            this.$main.show();
            this.$footer.show();

            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining,
                user: this.user
            }));

            this.$('.filters li a')
                .removeClass('selected')
                .filter('[href="#/' + this.user + '/todos/' + ( app.TodoFilter || '' ) + '"]')
                .addClass('selected')
        } else {
            this.$main.hide();
            this.$footer.hide();
        }
        this.allCheckbox.checked = !remaining;
        return this;
    },

    // add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`
    addOne: function( todo ) {
        console.log('adding one');
        var view = new app.TodoView({model: todo});
        this.$('.todo-list').append( view.render().el );
    },

    // add all items in the **Todos** collection at once
    addAll: function() {
        console.log('adding all');
        this.$('.todo-list').html('');
        app.Todos.each(this.addOne, this);
    },

    filterOne: function(todo) {
        todo.trigger('visible');
    },

    filterAll: function() {
        app.Todos.each(this.filterOne, this);
    },

    // generate the attributes for a new todo item
    newAttributes: function() {
        return {
            title: this.$input.val().trim(),
            completed: false
        };
    },

    // if user hits return in the main input field, create new todo model,
    // persisting to api
    createOnEnter: function( event ) {
        if ( event.which !== ENTER_KEY || !this.$input.val().trim() ) {
            return;
        }

        app.Todos.create( this.newAttributes() );
        this.$input.val('');
    },

    // clear all completed todo items, destroying their models
    clearCompleted: function() {
        _.invoke(app.Todos.completed(), 'destroy');
        return false;
    },

    toggleAllComplete: function() {
        var completed = this.allCheckbox.checked;
        console.log(completed);
        app.Todos.each(function( todo ) {
            todo.save({
                'completed': completed
            });
        });
    }
});
