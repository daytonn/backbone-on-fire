(function() {
  "use strict";

  Backbone.OnFire.Collection = Backbone.Collection.extend({
  constructor: function() {
    Backbone.Collection.apply(this, arguments);
    _.bindAll.apply(this, [this].concat(_.functions(this)));
  }
  });
})();
