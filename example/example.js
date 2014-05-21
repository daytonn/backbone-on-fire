var App = Backbone.Application.create();

App.createController("TestController", {
  routes: ['edit/:id', 'show/:id'],

  index: function() {
    console.log("index action");
    alert("index action");
  },

  edit: function(id) {
    console.log("edit action", id);
    alert("edit action: " + id);
  },

  show: function(id) {
    console.log("show action", id);
    alert("show action: " + id);
  }
});
App.start();
