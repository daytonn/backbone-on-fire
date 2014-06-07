/**
  Factory to create routes for a given controller.

  @class RouteCreator
  @constructor
  @param controller {Controller} Controller to generate route for
  @example
      new Backbone.OnFire.RouteCreator(controller);
*/
Backbone.OnFire.RouteCreator = (function() {
  function RouteCreator(controller) {
    this.controller = controller;
    if (this.isIndexController()) {
      this.createIndexRoutes();
    } else {
      this.createRootSegment();
      this.createRouteActions();
      this.validateRoutes();
      this.createRoutes();
    }
  }

  _.extend(RouteCreator.prototype, {
    /**
      Trim slashes from the beginning and ending of a string.

      @method trimSlashes
      @param string {String} String to trim.
      @return {String} Copy of string without beginning or ending slashes.
    */
    trimSlashes: function(string) {
      return string.replace(/^\//, '').replace(/\/$/, '');
    },

    /**
      Get the first segment of a given path.

      @method firstSegment
      @param string {String} Path.
      @return {String} First segment of the path.
    */
    firstSegment: function(string) {
      return this.trimSlashes(string).split("/").first();
    },

    /**
      Create an action/route mapping for the index action.

      @method createIndexRouteAction
    */
    createIndexRouteAction: function() {
      if (this.hasIndexRoute()) {
        var segments = this.getIndexRoute().split("/").rest().join("/");
        var dynamicSegments = segments ? "/" + segments : "";
        this.routeActions[this.getIndexRoute()] = "index";
      } else if (isFunction(this.controller.index)) {
        this.controller.routes.push("index");
        this.routeActions["index"] = "index";
      }
    },

    /**
      Create route mappings for all of the Controller's routes.

      @method createRouteActions
    */
    createRouteActions: function() {
      this.routeActions = {};
      this.normalizeRoutes();
      this.controller.routes.each(this.createRouteAction, this);
      this.createIndexRouteAction();
    },

    /**
      Create route mappings for a given Controller's routes.

      @method createRouteActions
      @param route {String} A given route to create a mapping for.
    */
    createRouteAction: function(route) {
      var routeRoot = this.firstSegment(route);
      if (routeRoot !== "index") this.routeActions[route] = routeRoot;
    },

    /**
      Create a `rootSegment` based on the Controller name or the root.
      Given a Controller name of PostsController, the `rootSegement`
      would be set to `posts`. If a Controller defines a `root` property
      the `root` property will be used instead.
      @method createRouteActions
    */
    createRootSegment: function() {
      this.rootSegment = this.controller.root ? this.controller.root : this.normalizedControllerName();
    },

    /**
      Create route mappings on the Controller's router
      for all of the Controller's routes.

      @method createRoutes
    */
    createRoutes: function() {
      this.controller.routes.each(function(route) {
        _.bindAll(this.controller, this.routeActions[route]);
        var fullRoute = this.trimSlashes(this.rootSegment + "/" + route.replace(/^index\/?/, ''));
        this.controller.router.route(fullRoute, this.controller[this.routeActions[route]]);
      }, this);
    },

    /**
      @method normalizedControllerName
      @return {String} Controller name without the "Controller" suffix in lower case.
    */
    normalizedControllerName: function() {
      return this.controller.name.replace(/(c|C)ontroller$/, '').toLowerCase();
    },

    /**
      Determine if the Controller has an explicit index route.

      @method hasIndexRoute
      @return {Boolean} Whether or not the Controller defines an index route.
    */
    hasIndexRoute: function() {
      return this.controller.routes.any(function(route) {
        return !!route.match(/^\/?index/);
      });
    },

    /**
      @method getIndexRoute
      @return {String} The explicitly defined index route.
    */
    getIndexRoute: function() {
      return this.controller.routes.find(function(route) {
        return !!route.match(/^\/?index/);
      });
    },

    /**
      Remove beginning and trailing slashes on all defined routes.

      @method normalizeRoutes
    */
    normalizeRoutes: function() {
      this.controller.routes.each(function(route, i) {
        this.controller.routes.push(this.trimSlashes(route));
        this.controller.routes[i] = undefined;
      }, this);
      this.controller.routes = this.controller.routes.compact();
    },

    /**
      Ensure all routes have corresponding actions defined on the Controller.
      @method validateRoutes
    */
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
    },

    /**
      Deterimine if this is the IndexController.
      @method isIndexController
      @return {Boolean} Whether or not this controller is the IndexController.
    */
    isIndexController: function() {
      return !!this.controller.name.match(/^index(controller)?$/i);
    },

    /**
      Create default routes for the IndexController.
      @method createIndexRoutes
    */
    createIndexRoutes: function() {
      if (!isFunction(this.controller.index)) throw new Error(this.controller.name + ": index action is undefined");
      _.bindAll(this.controller, "index");
      this.controller.router.route("", this.controller.index);
    }
  });

  return RouteCreator;
})();
