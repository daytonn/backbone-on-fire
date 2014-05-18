(function() {
  var defaultAttributes = {
    initialize: function() { return void(0); },
    Models: {},
    Collections: {},
    Views: {},
    Controllers: {},
    Dispatcher: _.clone(Backbone.Events),
    Router: Backbone.Router.extend()
  };

  Backbone.Application = {
    create: function(options) {
      options = options || {};
      var app = _.extend({}, defaultAttributes, options);
      return app;
    }
  };
})();
