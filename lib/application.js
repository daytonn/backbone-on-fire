/**
  The Application serves as a namespace as
  well as providing the interface to define
  and interact with the Backbone On Fire application.

  @class Application
**/
(function() {
  var Router = Backbone.Router.extend();
  var defaultApplication = {
    /**
      Namespace to contain Model constructors.

      @property Models
      @type Object
      @default {}
    */
    Models: {},
    /**
      Namespace to contain Collection constructors.

      @property Collections
      @type Object
      @default {}
    */
    Collections: {},
    /**
      Namespace to contain View constructors.

      @property Views
      @type Object
      @default {}
    */
    Views: {},
    /**
      Namespace to contain Controller constructors.

      @property Controllers
      @type Object
      @default {}
    */
    Controllers: {
      Application: Backbone.OnFire.Controller.extend("ApplicationController", {})
    },
    /**
      Global event dispatcher to coordinate events.

      @property Dispatcher
      @type Backbone.Events
      @default _.clone(Backbone.Events)
    */
    Dispatcher: _.clone(Backbone.Events),
    Router: new Router,

    initialize: function() { return void(0); },
    /**
      Create a Controller constructor and an
      instance attached to the application object.
      All Controller methods will be bound to
      it's context when instantiated.

      @method createController
      @static
      @param name {String} Controller name
      @param [options] {Object} Options object which
      defines methods and properties of the
      Controller constructor.
      @return {Controller} Instance of the created Controller

      @example
          App.createController("PostsController", {
            route: ['show/:id', 'edit/:id'],

            index: function() {
              // do index stuff
            },

            show: function(id) {
              // do show stuff
            },

            edit: function(id) {
              // do edit stuff
            }
          });
    */
    createController: function(name, options) {
      var baseName = name.replace(/(c|C)ontroller$/, '').toLowerCase();
      var controllerName = baseName.constantize() + "Controller";
      options = options || {};

      _(options).defaults(_.extend(this.Controllers.Application.prototype, {
        dispatcher: this.Dispatcher,
        router: this.Router
      }));

      var Controller = this.Controllers[baseName.constantize()] = Backbone.OnFire.Controller.extend(baseName, options);

      if (baseName !== "application") {
        var controllerInstance = new Controller;
        return this[controllerName] = controllerInstance;
      }
    },

    /**
      Create a Model constructor.

      @method createModel
      @static
      @param name {String} Model name
      @param [options] {Object} Options object which
      defines methods and properties of the
      Model constructor.
      @return {Model} The Model constructor function

      @example
          App.createModel("Post", {
            urlRoot: "posts"
          });
    */
    createModel: function(name, options, classProperties) {
      var baseName = name.replace(/(m|M)odel$/, '');
      classProperties = classProperties || {};
      _.extend(classProperties, { root: baseName.toLowerCase() });
      // TODO create Collection automatically
      return this.Models[baseName.constantize()] = Backbone.OnFire.Model.extend(options, classProperties);
    },

    /**
      Initialize the application and start the history.

      @method start
      @static
      @param [options] {Object} Options object
    */
    start: function(options) {
      options = options || {};
      this.initialize(options);
      var routerOptions = typeof options.pushState !== 'undefined' ? { pushState: options.pushState } : { pushState: false };
      Backbone.history.start(routerOptions);
    }
  };


  Backbone.OnFire.Application = {
    /**
      Create a Backbone On Fire application.

      @method create
      @static
      @param [options] {Object} Options object
      @return {Application} New Backbone On Fire Application

      @example
          var App = Backbone.OnFire.Application.create();
    */
    create: function(options) {
      options = options || {};
      var app = _.extend({}, defaultApplication, options);
      return app;
    }
  };
})();
