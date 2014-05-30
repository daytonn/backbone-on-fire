var App = Backbone.OnFire.Application.create();

App.createController("ApplicationController", {
  initialize: function() {
    $("body").append('<ul id="' + this.name.toLowerCase() + '-messages"/>');
  },

  logAction: function() {
    var message = this.name + ": " + [].slice.call(arguments, 0).join(" ");
    $("#" + this.name.toLowerCase() + "-messages").append("<li>" + message + "</li>");
  }
});

App.createController("IndexController", {
  index: function(id) {
    this.logAction("show action", id);
  }
});

App.createController("TestController", {
  routes: ['edit/:id', 'show/:id'],

  index: function() {
    this.logAction("index action");
  },

  edit: function(id) {
    this.logAction("edit action", id);
  },

  show: function(id) {
    this.logAction("show action", id);
  }
});
App.start();
