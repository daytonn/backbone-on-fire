(function() {
  "use strict";

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
      Relationships object.

      @property relationships
      @type Object
      @default {}
    */
    relationships: {},
    /**
      Serializers array.

      @property serializers
      @type Array
      @default []
    */
    serializers: [],
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
      _.bindAll.apply(this, [this].concat(_.functions(this)));
    },

    /**
      Placeholder method to allow custom deserialization of
      server side JSON payload after it is parsed.

      @method deserialize
      @param data {Object} JSON to deserialize
      @return {Object} Deserialized JSON.
    */
    deserialize: function(json) {
      return serializeWith(this, "deserialize", json);
    },

    /**
      Placeholder method to allow custom serialization of
      client side JSON payload.

      @method serialize
      @param data {Object} JSON to serialize
      @return {Object} Serialized JSON.
    */
    serialize: function() {
      return serializeWith(this, "serialize", this.toJSON());
    },

    toJSON: function() {
      return serializeWith(this, "toJSON", _.clone(this.attributes));
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
    Method to process json with all serializers.

    @method
    @private
    @param method {String} method to call on the serializer
    @param json {Object} json payload to serialize
  */
  function serializeWith(context, method, json) {
    var _this = context;
    return _this.serializers.reduce(function(memo, serializer) {
      return serializer[method] ? serializer[method].call(_this, memo) : memo;
    }, json);
  }
})();
