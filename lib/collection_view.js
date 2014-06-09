(function() {
  "use strict";

  var _super = Backbone.OnFire.View.prototype;
  Backbone.OnFire.CollectionView = Backbone.OnFire.View.extend({
    constructor: function(options) {
      Backbone.OnFire.View.call(this, options);
      if (!this.collection) throw new Error("CollectionView: collection is undefined.");
      this.modelViews = [];
      this.collection.on("all", this.render, this);
    },

    render: function() {
      this.$el.empty();
      if (!this.collection.isEmpty()) {
        this.createListItemViews();
        this.renderListItemViews();
      }
      return this.$el;
    },

    createListItemView: function(model, index) {
      this.modelViews.push(new this.modelView({ model: model, index: index }));
    },

    renderListItemView: function(modelView) {
      this.$el.append(modelView.render());
    },

    createListItemViews: function() {
      this.modelViews.length = 0;
      this.collection.each(this.createListItemView);
    },

    renderListItemViews: function() {
      this.modelViews.each(this.renderListItemView);
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
