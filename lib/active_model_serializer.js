// TODO set/remove root from JSON payload
Backbone.OnFire.ActiveModelSerializer = (function() {
  /**
    Serializer that works seemlessly with Rails and
    [ActiveModel Serializers](https://github.com/rails-api/active_model_serializers).

    @class ActiveModelSerializer
    @constructor
  */
  function ActiveModelSerializer() {}

  /**
    Serializes the model and it's nested attributes for
    persisting to the server.Root keys will be added if
    defined on the model. Nested relationship keys
    will be suffixed with `_attributes` for transparent
    compatability with [nested attributes](http://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html)

    @method serialize
    @return {Object} serialized model json.
  */
  ActiveModelSerializer.prototype.serialize = function() {
    var namespaced;
    var json = this.toJSON();
    if (this.relationships) {
      _(this.relationships).each(function(Class, attr) {
        var relationship = this.get(attr);
        delete json[attr];
        if (relationship.models) {
          json[attr + "_attributes"] = relationship.models.map(function(model) {
            return model.toJSON.call(model);
          });
        } else {
          json[attr + "_attributes"] = relationship.toJSON();
        }
      }, this);
    }

    if (this.root) {
      namespaced = {};
      namespaced[this.root] = json;
      json = namespaced;
    }
    return json;
  };

  /**
    Deserialize the model data from the server to be parsed
    by the model. Automatically instantiates related models
    stated in the `relationships` object. Root keys will be
    removed if defined on the model and present in the data.

    @method deserialize
    @return {Object} json data with instantiated relationship attributes.
  */
  ActiveModelSerializer.prototype.deserialize = function(json) {
    if (this.root && json[this.root]) json = json[this.root];
    if (this.relationships) {
      _(this.relationships).each(function(Class, attr) {
        instantiateRelationship(json, attr, Class);
      });
    }
    return json;
  };

  /**
    Converts nested relationship attributes to json.

    @method toJSON
    @return {Object} Model json with relationship attributes as json as well.
  */
  ActiveModelSerializer.prototype.toJSON = function(options) {
    var json = _.clone(this.attributes);
    _(this.relationships).each(function(relationshipClass, relationship) {
      delete json[relationship];
      if (this.get(relationship).models) {
        json[relationship] = this.get(relationship).models.map(function(model) {
          return _.clone(model.attributes);
        });
      } else {
        json[relationship] = _.clone(this.get(relationship).attributes);
      }
    }, this);
    return json;
  };

  return ActiveModelSerializer;

  /**
    Instantiate a relationship of a given type with the given attributes.

    @method instatiateRelationship
    @private
    @param attributes {Object} Parent model attributes containing child attributes.
    @param key {String} Child attributes key.
    @param Class {Function} Constructor function to instantiate with child attributes.
    @example
        modelInstance.instantiateRelationship({ user: { id: 1 }}, "user", App.Models.User);
  */
  function instantiateRelationship(attributes, key, Class) {
    var value = attributes[key];
    if (attributes[key] && !isTypeof(Class, value)) {
      attributes[key] = new Class(value);
    }
  }
})();
