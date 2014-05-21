(function() {
  var Router = Backbone.Router.extend();
  var defaultApplication = {
    Models: {},
    Collections: {},
    Views: {},
    Controllers: {
      Application: Backbone.OnFire.Controller.extend("ApplicationController", {})
    },
    Dispatcher: _.clone(Backbone.Events),
    Router: new Router,

    initialize: function() { return void(0); },

    createController: function(name, options) {
      var baseName = name.replace(/(c|C)ontroller$/, '').toLowerCase();
      var controllerName = baseName.constantize() + "Controller";
      options = options || {};
      _(options).defaults(_.extend(this.Controllers.Application.prototype, {
        dispatcher: this.Dispatcher,
        router: this.Router
      }));

      var Controller = this.Controllers[baseName.constantize()] = Backbone.OnFire.Controller.extend(baseName, options);
      if (baseName !== "application") var controllerInstance = new Controller;
      return this[controllerName] = controllerInstance;
    },

    start: function(options) {
      options = options || {};
      this.initialize(options);
      var routerOptions = typeof options.pushState !== 'undefined' ? { pushState: options.pushState } : { pushState: false };
      Backbone.history.start(routerOptions);
    }
  };

  Backbone.OnFire.Application = {
    create: function(options) {
      options = options || {};
      var app = _.extend({}, defaultApplication, options);
      return app;
    }
  };
})();
