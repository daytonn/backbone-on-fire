(function() {
  "use strict";
  /**
    @static
    @method extend
    @param properties {Object} Object defining methods and
    properties of the view.
    @param [classProperties] {Object} Object defining class-level
    properties and methods of the view.
    @example
        var PostView = Backbone.OnFire.View.extend({
          el: "#my-post"
        });
  */
  Backbone.OnFire.View = Backbone.View.extend({
    /**
      @class View
      @constructor

      @param [options] {Object}
      There are several special options that, if passed,
      will be attached directly to the view: `model`,
      `collection`, `el`, `id`, `className`, `tagName`,
      `attributes`, `renderLoadingMask` and `events`.
      If the view defines an *initialize* function, it
      will be called when the view is first created. If
      you'd like to create a view that references an
      element already in the DOM, pass in the element as
      an option: `new View({el: existingElement})`

      @return {View} view instance.
    */
    constructor: function(options) {
      options = options || {};
      _(options).defaults({ renderLoadingMask: true });
      this.renderLoadingMask = !!options.renderLoadingMask;
      Backbone.View.call(this, options);
      _.bindAll.apply(this, [this].concat(_.functions(this)));
    },

    /**
      `toggleLoading` handles toggling a `.loading`
      class to the model and prepending a loading mask
      to the view if `renderLoadingMask` is set to `true`.

      @method toggleLoading
    */
    toggleLoading: function() {
      if (this.renderLoadingMask) this.toggleLoadingMask();
      this.$el.toggleClass("loading");
      this.isLoading = !this.isLoading;
    },

    /**
      `toggleLoadingMask` handles the addition/removal
      of the loading mask element when `toggleLoading`
      is called.

      @method toggleLoadingMask
    */
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
