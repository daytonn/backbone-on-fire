Backbone.OnFire.NestedModelSerializer = (function() {
  /**
    Serializer that works seemlessly with Rails
    [nested attributes](http://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html)

    @class NestedModelSerializer
    @constructor
  */
  function NestedModelSerializer() {}

  /**
    Serializes the model and it's nested attributes for
    persisting to the server. Nested relationship keys
    will be suffixed with `_attributes` for transparent
    compatability with [nested attributes](http://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html)

    @method serialize
    @return {Object} serialized model json.
  */
  NestedModelSerializer.prototype.serialize = function(json) {
    if (this.relationships) {
      _(this.relationships).each(function(Class, attr) {
        var relationship = this.get(attr);
        delete json[attr];
        if (relationship.models) {
          json[attr + "_attributes"] = _(relationship.models).map(function(model) {
            return model.toJSON.call(model);
          });
        } else {
          json[attr + "_attributes"] = relationship.toJSON();
        }
      }, this);
    }
    return json;
  };

  /**
    Deserialize the model data from the server to be parsed
    by the model. Automatically instantiates related models
    stated in the `relationships` object.

    @method deserialize
    @return {Object} json data with instantiated relationship attributes.
  */
  NestedModelSerializer.prototype.deserialize = function(json) {
    if (this.relationships) {
      _(json).each(function(value, key) {
        var relatedClass = this.relationships[key];
        if (relatedClass) {
          if (!(value instanceof relatedClass)) {
            if (isCollection(relatedClass) && this.get(key) instanceof relatedClass) {
              this.get(key).add(value);
              delete json[key];
            } else {
              json[key] = new relatedClass(value);
            }
          }
        }
      }, this);
    }
    return json;
  };

  /**
    Converts nested relationship attributes to json.

    @method toJSON
    @return {Object} Model json with relationship attributes as json as well.
  */
  NestedModelSerializer.prototype.toJSON = function(json) {
    _(this.relationships).each(function(relationshipClass, relationship) {
      delete json[relationship];
      if (this.get(relationship).models) {
        json[relationship] = _(this.get(relationship).models).map(function(model) {
          return _.clone(model.attributes);
        });
      } else {
        json[relationship] = _.clone(this.get(relationship).attributes);
      }
    }, this);
    return json;
  };

  return NestedModelSerializer;

  /**
    Determine if a given class is a collection.

    @method isCollection
    @private
    @param Class {Function} Suspect class.
    @example
        isCollection(SomeCollection); // true
        isCollection(SomeModel); // false
  */
  function isCollection(Class) {
    return !!Class.__super__.model;
  }
})();
