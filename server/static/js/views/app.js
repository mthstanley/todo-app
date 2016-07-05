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
        this.todos = new app.UserTodos([], { id: this.user.get('id') });
        this.$el.html(this.template({
            user: this.user.get('username')
        }));
        this.allCheckbox = this.$('.toggle-all')[0];
        this.$input = this.$('.new-todo');
        this.$footer = this.$('.footer');
        this.$main = this.$('.main');

        this.listenTo(this.todos, 'add', this.addOne);
        this.listenTo(this.todos, 'reset', this.addAll);

        this.listenTo(this.todos, 'change:completed', this.filterOne);
        this.listenTo(this.todos, 'filter', this.filterAll);
        this.listenTo(this.todos, 'all', this.render);
        this.todos.fetch();
        this.addAll();
    },

    // re-rendering the app just means refreshing the statistics -- the rest
    // of the app doesn't change
    render: function() {
        var completed = this.todos.completed().length;
        var remaining = this.todos.remaining().length;

        if( this.todos.length ) {
            this.$main.show();
            this.$footer.show();

            this.$footer.html(this.statsTemplate({
                completed: completed,
                remaining: remaining,
                user: this.user.get('username')
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
        this.todos.each(this.addOne, this);
    },

    filterOne: function(todo) {
        todo.trigger('visible');
    },

    filterAll: function() {
        this.todos.each(this.filterOne, this);
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

        this.todos.create( this.newAttributes() );
        this.$input.val('');
    },

    // clear all completed todo items, destroying their models
    clearCompleted: function() {
        _.invoke(this.todos.completed(), 'destroy');
        return false;
    },

    toggleAllComplete: function() {
        var completed = this.allCheckbox.checked;
        console.log(completed);
        this.todos.each(function( todo ) {
            todo.save({
                'completed': completed
            });
        });
    }
});
