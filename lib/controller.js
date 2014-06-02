/**
  A Controller manages routes and handles
  the setup and coordination of views, models,
  and collections within a given root segment.

  @class Controller
**/
(function() {
  var controllerDefaults = {
    /**
      Initialization function called when a
      controller is instantiated. By default
      `initialize` is a noop left to be implemented
      by the child class.

      @method initialize
    */
    initialize: function() { return void(0); },
    /**
      Convenience method to call through to the
      dispatcher and register events.

      @method on
      @param event {String}
      Name of the event to register.
      @param handler {Function}
      Function to be called when the event
      is triggered.
    */
    on: dispatcherMethod('on'),
    /**
      Convenience method to call through to the
      dispatcher and deregister events.

      @method off
      @param event {String} Name of the event to deregister.
      @param [handler] {Function}
      Handler function to remove a specific
      event handler. If handler is ommitted
      all events attached to the event will
      be removed.
    */
    off: dispatcherMethod('off'),
    /**
      Route definitions for the controller.

      @property routes
      @type Array
      @default []
    */
    routes: []
  };

  /**
    Creates a method on the controller
    which calls the given method on the dispatcher.

    @private
    @method dispatcherMethod
  */
  function dispatcherMethod(method) {
    return function() {
      if (!this.dispatcher) throw new Error(this.name + " has no dispatcher");
      this.dispatcher[method].apply(this.dispatcher, arguments);
    };
  }

  /**
    Validate controller name is defined
    and is a `String`.

    @private
    @method validateName
    @param name {String} Controller name.
  */
  function validateName(name) {
    if (!name) throw new Error("Backbone.OnFire.Controller.extend(name, options): name is undefined");
    if (!isString(name)) throw new Error("Backbone.OnFire.Controller.extend(name, options): name is expected to be a string got " + name);
  }

  /**
    Convenience method to create vanilla Controller constructors.
    All controller methods are bound when the controller is instantiated.

    @private
    @constructor
    @method defaultController
    @param name {String} Controller name.
    @return {Controller} Vanilla Controller constructor function.
  */
  function defaultController(name) {
    var controllerName = name.constantize() + "Controller";
    return function Controller() {
      this.name = controllerName;
      new Backbone.OnFire.RouteCreator(this);
      _.functions(this).each(function(method) {
        _.bindAll(this, method);
      }, this);
      this.initialize.apply(this, arguments);
    };
  }

  /**
    Convenience method to extend a given Controller
    prototype with an options object.

    @private
    @method extendController
    @param Controller {Controller} A Controller constructor.
    @param [options] {Object} Options object.
  */
  function extendController(Controller, options) {
    var extensions = _.extend({}, controllerDefaults, options);
    _.extend(Controller.prototype, extensions);
    return Controller;
  }

  Backbone.OnFire.Controller = {
    /**
      @method extend
      @static
      @param name {String} Name of controller.
      The "Controller" suffix will be added if ommitted.
      @param [options] {Object} Optional methods and properties
      belonging to the Controller constrcutor's prototype.

      @example
          Backbone.OnFire.Controller.extend({
            route: ['show/:id', 'edit/:id'],

            index: function() {
              // do index stuff
            },

            show: function(id) {
              // do show stuff
            },

            edit: function(id) {
              // do edit stuff
            },
          });
    */
    extend: function(name, options) {
      options = options || {};
      validateName(name);
      return extendController(defaultController(name), options);
    }
  };
})();
