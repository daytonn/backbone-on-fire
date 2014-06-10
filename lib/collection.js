(function() {
  "use strict";
  /**
    Default Backbone.Collection methods to ignore
    when binding functions to the instance context.

    @private
    @type Array
    @property collectionMethods
  */
  var collectionMethods = _.functions(new Backbone.Collection);
  collectionMethods.push("constructor");

  /**
    @static
    @method extend
    @param properties {Object} Object defining methods and
    properties of the collection
    @param [classProperties] {Object} Object defining class-level
    properties of the collection.
    @example
        var Posts = Backbone.OnFire.Collection.extend({
          url: "/posts",
          model: Post
        });
  */
  Backbone.OnFire.Collection = Backbone.Collection.extend({
    /**
      Collection class defines a `isNotEmpty` convenience
      method and binds all method to the collection context.

      @class Collection
      @constructor
      @param [models] {Array} Array of models or attribute objects
      @param [options] {Object} Options object
      @return {Collection} Collection constructor function.
      @example
          var myCollectionInstance = new Posts([
            {
              id: 1,
              title: "Collections In Backbone"
            },
            {
              id: 2,
              title: "Hello World!"
            }
          ]);
    */
    constructor: function(models, options) {
      Backbone.Collection.apply(this, arguments);
      var boundMethods = _(_.functions(this)).reject(function(method) {
        return _(collectionMethods).contains(method);
      });
      _.bindAll.apply(this, [this].concat(boundMethods));
    },

    /**
      Convenience method to check if the colleciton
      has items.

      @method isNotEmpty
      @return {Boolean} Whether or not the collection contains models.
    */
    isNotEmpty: function() {
      return !this.isEmpty();
    }
  });
})();
