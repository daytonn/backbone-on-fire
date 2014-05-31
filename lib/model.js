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
    relationships: {},

    /**
      Backbone.OnFire models always parse when instantiated
      to ensure relationships are instantiated.

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
    serialize: function(data) {
      return data;
    },

    /**
      Instantiate a relationship of a given type with the given attributes.

      @method instatiateRelationship
      @param attributes {Object} Parent model attributes containing child attributes.
      @param key {String} Child attributes key.
      @param Class {Function} Constructor function to instantiate with child attributes.
      @example
          modelInstance.instantiateRelationship({ user: { id: 1 }}, "user", App.Models.User);
    */
    instantiateRelationship: function(attributes, key, Class) {
      var value = attributes[key];
      if (attributes[key] && !isTypeof(Class, value)) {
        attributes[key] = new Class(value);
      }
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
      data = this.preParse(data || {});
      if (this.relationships) {
        _(this.relationships).each(function(Class, attr) {
          this.instantiateRelationship(data, attr, Class);
        }, this);
      }
      data = this.deserialize(data || {});
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

  var extend = Backbone.OnFire.Model.extend;

  Backbone.OnFire.Model.extend = function(options) {
    options = options || {};
    var toJSON = options.toJSON || function() { return {}; };
    options.toJSON = function() {
      var customAttributes = _.clone(toJSON.apply(this, arguments));
      var attributes = _.clone(this.attributes);
      _(this.relationships).each(function(relationshipClass, relationship) {
        delete attributes[relationship];
        if (this.get(relationship).models) {
          attributes[relationship] = this.get(relationship).models.map(function(model) {
            return _.clone(model.attributes);
          });
        } else {
          attributes[relationship] = _.clone(this.get(relationship).attributes);
        }
      }, this);
      return _.extend(attributes, customAttributes);
    };

    return extend.apply(Backbone.OnFire.Model, arguments);
  };
})();
