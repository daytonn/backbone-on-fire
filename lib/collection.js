Backbone.OnFire.Collection = Backbone.Collection.extend({
  constructor: function() {
    Backbone.Collection.apply(this, arguments);
    _.functions(this).each(function(method) {
      _.bindAll(this, method);
    }, this);
  }
});
