(function() {
  /**
    @static
    @method extend
    @param [options] {Object} Object defining methods and
    properties of the model
    @example
        var MyModel = Backbone.OnFire.Model.extend({
          urlRoot: "/mymodels"
        });
  */
  Backbone.OnFire.Model = Backbone.Model.extend({
    /**
      Default relationships object.

      @property relationships
      @type Object
      @default {}
    */
    relationships: {},
    /**
      Backbone.OnFire models always parse when instantiated
      to ensure relationships are instantiated. All methods
      are bound to the instance of the model.

      @class Model
      @constructor

      @param [attributes] {Object}
      When creating an instance of a model,
      you can pass in the initial values of
      the attributes, which will be set on
      the model.

      @params [options] {Object}
      If you pass a `{collection: ...}` as
      the options, the model gains a collection
      property that will be used to indicate
      which collection the model belongs to,
      and is used to help compute the model's
      url. The model.collection property is
      normally created automatically when you
      first add a model to a collection. Note
      that the reverse is not true, as passing
      this option to the constructor will not
      automatically add the model to the collection.
      Useful, sometimes.
    */
    constructor: function(attributes, options) {
      options = options || {};
      options.parse = true;
      Backbone.Model.call(this, attributes, options);
      _.functions(this).each(function(method) {
        _.bindAll(this, method);
      }, this);
    },

    /**
      Placeholder method to allow custom deserialization of
      server side JSON payload after it is parsed.

      @method deserialize
      @param data {Object} JSON to deserialize
      @return {Object} Deserialized JSON.
    */
    deserialize: function(data) {
      return data;
    },

    /**
      Placeholder method to allow custom serialization of
      client side JSON payload.

      @method serialize
      @param data {Object} JSON to serialize
      @return {Object} Serialized JSON.
    */
    serialize: function() {
      return this.toJSON();
    },

    /**
      Placeholder method to allow manipulation of
      server side JSON payload before it is parsed.

      @method serialize
      @param data {Object} JSON to serialize
      @return {Object} Serialized JSON.
    */
    preParse: function(data) {
      return data;
    },

    /**
      Automatically instantiate relationships when data
      is set/changed if relationships are defined.

      @method parse
      @param data {Object} Model data that has been set/changed.
      @return {Object} Parsed data.
    */
    parse: function(data) {
      data = data || {};
      data = this.preParse(data);
      data = this.deserialize(data);
      return data;
    },

    /**
      Convenience method to determine if the model
      has been persisted. This method is the inverse
      of `isNew`.

      @method isPersisted
      @return {Boolean} Wheter or not the model has been persisted.
    */
    isPersisted: function() {
      return !this.isNew();
    }
  });

  /**
    Patch the extend to mixin the serializer methods if one is defined.

    @static
    @private
    @method extend
    @param [options] {Object} Options object to define the model.
    @return {Model} Model class constructor
  */
  var extend = Backbone.OnFire.Model.extend;
  Backbone.OnFire.Model.extend = function(options) {
    options = options || {};
    if (options.serializer) _.extend(options, options.serializer);
    return extend.apply(Backbone.OnFire.Model, arguments);
  };
})();
