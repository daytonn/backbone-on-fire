(function() {
  "use strict";

  /**
    @static
    @method extend
    @param properties {Object} Object defining methods and
    properties of the model.
    @param [classProperties] {Object} Object defining class-level
    properties and methods of the model.
    @example
        var Post = Backbone.OnFire.Model.extend({
          urlRoot: "/posts"
        });
  */
  Backbone.OnFire.Model = Backbone.Model.extend({
    /**
      Relationships object defining key/constructor
      pairs to enable creation of nested model instances
      when the given keys are present in the JSON payload.

      @property relationships
      @type Object
      @default {}

      @example
          var Post = Backbone.OnFire.Model.extend({
            relationships: {
              author: User, // User model.
              relatedPosts: Posts // Posts collection.
            }
          });
    */
    relationships: {},
    /**
      Array of serializers that will be used
      when processing JSON payloads. Serializers
      can define the behavior of `serialize`,
      `deserialize`, and `toJSON`.

      @property serializers
      @type Array
      @default []
    */
    serializers: [],
    /**
      Backbone.OnFire models always parse when instantiated
      to ensure relationships are instantiated. All methods
      are also bound to the instance of the model.

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

      @return {Model} model instance.
    */
    constructor: function(attributes, options) {
      options = options || {};
      options.parse = true;
      Backbone.Model.call(this, attributes, options);
      _.bindAll.apply(this, [this].concat(_.functions(this)));
    },

    /**
      `deserialize` passes received JSON payload
      from the server through each serializer's
      `deserialize` method.

      @method deserialize
      @param data {Object} JSON to deserialize
      @return {Object} Deserialized JSON.
    */
    deserialize: function(json) {
      return serializeWith(this, "deserialize", json);
    },

    /**
      `serialize` passes the initial result of the
      model's `toJSON` method to be processed by
      each serializer's `serialize` method to send
      a modified JSON payload to the server.

      @method serialize
      @param data {Object} JSON to serialize
      @return {Object} Serialized JSON.
    */
    serialize: function() {
      return serializeWith(this, "serialize", this.toJSON());
    },

    /**
      `toJSON` passes an initial copy of the model's
      `_attributes` object to be parsed by each
      serializer's `toJSON` method for use as a plain
      JavaScript object.

      @method toJSON
      @return {Object} JSON object representing the model data.
    */
    toJSON: function() {
      return serializeWith(this, "toJSON", _.clone(this.attributes));
    },

    /**
      `parse` converts the data received from
      the server using the `deserialize` method.

      @method parse
      @param data {Object} Model data that has been set/changed.
      @return {Object} Parsed data.
    */
    parse: function(data) {
      data = data || {};
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
    return context.serializers.reduce(function(memo, serializer) {
      return serializer[method] ? serializer[method].call(context, memo) : memo;
    }, json);
  }
})();
