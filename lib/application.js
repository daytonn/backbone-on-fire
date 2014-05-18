(function() {
  var Router = Backbone.Router.extend();
  var defaultApplication = {
    Models: {},
    Collections: {},
    Views: {},
    Controllers: {},
    Dispatcher: _.clone(Backbone.Events),
    Router: new Router,

    initialize: function() { return void(0); },

    createController: function(name, options) {
      name = name.replace(/(c|C)ontroller$/, '');
      options = options || {};
      _(options).defaults({
        dispatcher: this.Dispatcher
      });
      var Controller = this.Controllers[name.constantize()] = Backbone.Controller.extend(name, options);
      return this[name.constantize() + "Controller"] = new Controller;
    }
  };

  Backbone.Application = {
    create: function(options) {
      options = options || {};
      var app = _.extend({}, defaultApplication, options);
      return app;
    }
  };
})();
