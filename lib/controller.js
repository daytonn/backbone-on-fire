(function() {
  var controllerDefaults = {
    initialize: function() { return void(0); },
    on: dispatcherMethod('on'),
    off: dispatcherMethod('off'),
    routes: []
  };

  function dispatcherMethod(method) {
    return function() {
      if (!this.dispatcher) throw new Error(this.name + " has no dispatcher");
      this.dispatcher[method].apply(this.dispatcher, arguments);
    };
  }

  function validateName(name) {
    if (!name) throw new Error("Backbone.OnFire.Controller.extend(name, options): name is undefined");
    if (!isString(name)) throw new Error("Backbone.OnFire.Controller.extend(name, options): name is expected to be a string got " + name);
  }

  function defaultController(name) {
    var controllerName = name.constantize() + "Controller";
    return function Controller() {
      this.name = controllerName;
      new Backbone.OnFire.RouteCreator(this);
      this.initialize.apply(this, arguments);
    };
  }

  function extendController(Controller, options, name) {
    var extensions = _.extend({}, controllerDefaults, options);
    _.extend(Controller.prototype, extensions);
    return Controller;
  }

  var Controller = {
    extend: function(name, options) {
      options = options || {};
      validateName(name);
      return extendController(defaultController(name), options, name);
    }
  };

  Backbone.OnFire.Controller = Controller;
})();
