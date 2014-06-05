Backbone.OnFire.NestedIdSerializer = (function() {
  /**
    Serializer that works seemlessly with Rails
    [nested attributes](http://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html)

    @class NestedIdSerializer
    @constructor
  */
  function NestedIdSerializer() {}

  /**
    Deserialize the model data from the server to be parsed
    by the model. Automatically instantiates related models
    stated in the `relationships` object with the ids given
    in the related ids array.

    @method deserialize
    @return {Object} json data with instantiated relationship attributes from ids.
  */
  NestedIdSerializer.prototype.deserialize = function(json) {
    if (this.relationships) {
      _(this.relationships).each(function(Class, attr) {
        if (json[attr + "_ids"]) {
          if (!this.get("child_collection")) this.set("child_collection", new Class);
          _(json[attr + "_ids"]).each(function(id) {
            this.get(attr).add({ id: id });
          }, this);
        }
      }, this);
    }
    return json;
  };

  return NestedIdSerializer;
})();
