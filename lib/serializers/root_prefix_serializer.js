Backbone.OnFire.RootPrefixSerializer = (function() {
  /**
    Serializer that works seemlessly with Rails
    [activemodel serializers](https://github.com/rails-api/active_model_serializers)

    @class RootPrefixSerializer
    @constructor
  */
  function RootPrefixSerializer() {}

  /**
    Prefixes the model with the root key for seemless
    integration with [activemodel serializers](https://github.com/rails-api/active_model_serializers)

    @method serialize
    @return {Object} serialized model json.
  */
  RootPrefixSerializer.prototype.serialize = function(json) {
    var namespaced;
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
    stated in the `relationships` object.

    @method deserialize
    @return {Object} json data with instantiated relationship attributes.
  */
  RootPrefixSerializer.prototype.deserialize = function(json) {
    if (this.root && json[this.root]) json = json[this.root];
    return json;
  };

  /**
    Converts nested relationship attributes to json.

    @method toJSON
    @return {Object} Model json with relationship attributes as json as well.
  */
  RootPrefixSerializer.prototype.toJSON = function(options) {
    var json = _.clone(this.attributes);
    return json;
  };

  return RootPrefixSerializer;
})();
