(function() {
  var controllerDefaults = {
    initialize: function() { return void(0); },
    on: dispatcherMethod('on'),
    off: dispatcherMethod('off'),
    routes: []
  };

  function validateName(name) {
    if (!name) throw new Error("Backbone.Controller.extend(name, options): name is undefined");
    if (!_.isString(name)) throw new Error("Backbone.Controller.extend(name, options): name is expected to be a string got " + name);
  }

  function defaultController(name) {
    var controllerName = name.constantize() + "Controller";
    return function Controller() {
      this.name = controllerName;
      registerRoutes.apply(this, arguments);
      this.initialize.apply(this, arguments);
    };
  }

  function extendController(Controller, options, name) {
    var extensions = _.extend({}, controllerDefaults, options);
    _.extend(Controller.prototype, extensions);
    return Controller;
  }

  function dispatcherMethod(method) {
    return function() {
      if (!this.dispatcher) throw new Error(this.name + " has no dispatcher");
      this.dispatcher[method].apply(this.dispatcher, arguments);
    };
  }

  function registerRoutes() {
    var controller = this;
    if (hasRoutesWithoutARouter(controller)) throw new Error(this.name + ": router is undefined");
    _(this.routes).each(function(route) {
      route = route.replace(/^\//, '').replace(/\/$/, '');
      var routeAction = route.split("/")[0];
      if (hasRouteWithoutAction(controller, routeAction)) {
        throw new Error(controller.name +": has no action matching route '" + routeAction + "'");
      } else {
        if (!route.match(/^index$/)) {
          route = createRoutePath(controller, route);
          controller.router.route(route, controller[routeAction]);
        }
        if (_.isFunction(controller.index)) controller.router.route(rootName(controller), controller.index);
      }
    });
  }

  function createRoutePath(controller, route) {
    return rootName(controller) + "/" + route;
  }

  function hasRoutesWithoutARouter(controller) {
    return controller.routes.length && !controller.router;
  }

  function hasRouteWithoutAction(controller, routeAction) {
    return !controller[routeAction];
  }

  function rootName(controller) {
    return controller.name.replace(/(c|C)ontroller$/, '').toLowerCase();
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
