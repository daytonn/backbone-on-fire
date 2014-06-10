(function() {
  "use strict";
  /**
    CollectionView is a view specific to rendering
    collections. A CollectionView contains
    the boilerplate necessary to render each model in
    a collection via a specified view, preventing the need
    for eaching over a collection in a template.

    @class CollectionView
    @constructor
    @private
  */
  Backbone.OnFire.CollectionView = Backbone.OnFire.View.extend({
    constructor: function(options) {
      Backbone.OnFire.View.call(this, options);
      if (!this.collection) throw new Error("CollectionView: collection is undefined.");
      this.modelViews = [];
      this.tagName = "ul";
    },

    render: function() {
      this.$el.empty();
      if (this.collection.isNotEmpty()) {
        this.createItemViews();
        this.renderItemViews();
      } else if (this.emptyTemplate) {
        this.$el.html(this.emptyTemplate());
      }
      return this.$el;
    },

    createItemViews: function() {
      this.modelViews = [];
      this.collection.each(this.createItemView);
    },

    createItemView: function(model, index) {
      var modelView = new this.modelView({ model: model, index: index });
      this.modelViews.push(modelView);
      return modelView;
    },

    renderItemViews: function() {
      this.modelViews.each(this.renderItemView);
    },

    renderItemView: function(modelView) {
      this.$el.append(modelView.render());
    },

    addItemView: function(model) {
      var modelView = this.createItemView(model);
      this.renderItemView(modelView);
    }
  });

  var extend = Backbone.OnFire.CollectionView.extend;

  Backbone.OnFire.CollectionView.extend = function(options) {
    options = options || {};
    if (!options.modelConstructor) throw new Error("CollectionView: modelConstructor is undefined.");
    if (!options.modelView) throw new Error("CollectionView: modelView is undefined.");
    return extend.apply(this, arguments);
  };
})();
