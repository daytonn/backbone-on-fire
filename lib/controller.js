(function() {
  var controllerDefaults = {
    initialize: function() { return void(0); },
    on: dispatcherMethod('on'),
    off: dispatcherMethod('off')
  };

  function validateName(name) {
    if (!name) throw new Error("Backbone.Controller.extend(name, options): name is undefined");
    if (!_.isString(name)) throw new Error("Backbone.Controller.extend(name, options): name is expected to be a string got " + name);
  }

  function defaultController(name) {
    return function Controller() {
      this.name = name.constantize() + "Controller";
      this.initialize.apply(this, arguments);
    };
  }

  function defineActionMethod(controller, action) {
    controller[action] = function() { return void(0); };
  }

  function registerActionEvent(controller, action, name) {
    controller.dispatcher.on("controller:test:" + action, controller[action], controller);
  }

  function setupActions(controller, name) {
    if (controller.actions) {
      _(controller.actions).each(function(action) {
        if (!_.isFunction(controller[action])) defineActionMethod(controller, action);
        registerActionEvent(controller, action, name);
      });
    }
  }

  function extendController(Controller, options, name) {
    var extensions = _.extend({}, controllerDefaults, options);
    setupActions(extensions, name);
    _.extend(Controller.prototype, extensions);
    return Controller;
  }

  function dispatcherMethod(method) {
    return function() {
      if (!this.dispatcher) throw new Error(this.name + " has no dispatcher");
      this.dispatcher[method].apply(this.dispatcher, arguments);
    };
  }

  var Controller = {
    extend: function(name, options) {
      options = options || {};
      validateName(name);
      return extendController(defaultController(name), options, name);
    }
  };

  Backbone.Controller = Controller;
})();
