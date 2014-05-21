Backbone.RouteCreator = (function() {
  function RouteCreator(controller) {
    this.controller = controller;
    this.createRootSegment();
    this.createRouteActions();
    this.validateRoutes();
    this.createRoutes();
  }

  _.extend(RouteCreator.prototype, {
    trimSlashes: function(string) {
      return string.replace(/^\//, '').replace(/\/$/, '');
    },

    firstSegment: function(string) {
      return this.trimSlashes(string).split("/").first();
    },

    createIndexRouteAction: function() {
      if (this.hasIndexRoute()) {
        var segments = this.getIndexRoute().split("/").rest().join("/");
        var dynamicSegments = segments ? "/" + segments : "";
        this.routeActions[this.getIndexRoute()] = "index";
      } else {
        if (isFunction(this.controller.index)) {
          this.controller.routes.push("index");
          this.routeActions["index"] = "index";
        }
      }
    },

    createRouteActions: function() {
      this.routeActions = {};
      this.normalizeRoutes();
      this.controller.routes.each(this.createRouteAction, this);
      this.createIndexRouteAction();
    },

    createRouteAction: function(route) {
      var routeRoot = this.firstSegment(route);
      if (routeRoot !== "index") this.routeActions[route] = routeRoot;
    },

    createRootSegment: function() {
      this.rootSegment = this.controller.root ? this.controller.root : this.normalizedControllerName();
    },

    createRoutes: function() {
      this.controller.routes.each(function(route) {
        var fullRoute = this.trimSlashes(this.rootSegment + "/" + route.replace(/^index\/?/, ''));
        this.controller.router.route(fullRoute, this.controller[this.routeActions[route]]);
      }, this);
    },

    normalizedControllerName: function() {
      return this.controller.name.replace(/(c|C)ontroller$/, '').toLowerCase();
    },

    hasIndexRoute: function() {
      return this.controller.routes.any(function(route) {
        return !!route.match(/^\/?index/);
      });
    },

    getIndexRoute: function() {
      return this.controller.routes.find(function(route) {
        return !!route.match(/^\/?index/);
      });
    },

    normalizeRoutes: function() {
      this.controller.routes.each(function(route, i) {
        this.controller.routes.push(this.trimSlashes(route));
        this.controller.routes[i] = undefined;
      }, this);
      this.controller.routes = this.controller.routes.compact();
    },

    validateRoutes: function() {
      if (this.controller.routes.isNotEmpty() && !this.controller.router) {
        throw new Error(this.controller.name + ": router is undefined");
      }
      this.controller.routes.each(function(route) {
        var firstSegment = this.firstSegment(route);
        if (!this.controller[firstSegment]) {
          throw new Error(this.controller.name + ": has no action matching route '" + firstSegment + "'");
        }
      }, this);
    }
  });

  return RouteCreator;
})();
