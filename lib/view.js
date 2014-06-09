(function() {
  "use strict";

  Backbone.OnFire.View = Backbone.View.extend({
    constructor: function(options) {
      options = options || {};
      _(options).defaults({ renderLoadingMask: true });
      this.renderLoadingMask = !!options.renderLoadingMask;
      Backbone.View.call(this, options);
      _.bindAll.apply(this, [this].concat(_.functions(this)));
    },

    toggleLoading: function() {
      if (this.renderLoadingMask) this.toggleLoadingMask();
      this.$el.toggleClass("loading");
      this.isLoading = !this.isLoading;
    },

    toggleLoadingMask: function() {
      if (this.isLoading) {
        this.loadingMask.remove();
        this.loadingMask = undefined;
      } else {
        this.$el.prepend('<div class="loading-mask" />');
        this.loadingMask = this.$(".loading-mask");
      }
    }
  });
})();
