(function() {
  "use strict";
  var collectionMethods = _.functions(new Backbone.Collection);
  collectionMethods.push("constructor");

  Backbone.OnFire.Collection = Backbone.Collection.extend({
    constructor: function() {
      Backbone.Collection.apply(this, arguments);
      var boundMethods = _(_.functions(this)).reject(function(method) {
        return _(collectionMethods).contains(method);
      });
      _.bindAll.apply(this, [this].concat(boundMethods));
    },

    isNotEmpty: function() {
      return !this.isEmpty();
    }
  });
})();
