var App = Backbone.Application.create();

App.createController("TestController", {
  routes: ['index', 'edit/:id', 'show/:id'],

  index: function() {
    console.log("index action");
  },

  edit: function(id) {
    console.log("edit action", id);
  },

  show: function(id) {
    console.log("show action", id);
  }
});
App.start();
