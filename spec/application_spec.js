describe("Application", function() {
  var subject;
  beforeEach(function() {
    subject = Backbone.Application.create();
  });

  it("has an initialize method", function() {
    expect(subject.initialize).to.be.function;
  });

  it("has a Models object", function() {
    expect(subject.Models).to.be.object;
  });

  it("has a Collections object", function() {
    expect(subject.Collections).to.be.object;
  });

  it("has a Views object", function() {
    expect(subject.Views).to.be.object;
  });

  it("has a Controllers object", function() {
    expect(subject.Controllers).to.be.object;
  });

  it("has a Dispatcher", function() {
    expect(subject.Dispatcher).to.be.defined;
  });

  it("has a Router", function() {
    expect(subject.Router).to.be.defined;
  });

  describe("with options", function() {
    var customDispatcher;
    beforeEach(function() {
      customDispatcher = "CustomDispatcher";
      subject = Backbone.Application.create({
        Dispatcher: customDispatcher,
        Models: 'Models',
        Collections: 'Collections',
        Views: 'Views',
        Controllers: 'Controllers'
      });
    });

    it("overrides the default dispatcher", function() {
      expect(subject.Dispatcher).to.equal(customDispatcher);
    });

    it("overrides the default objects", function() {
      ['Models', 'Collections', 'Views', 'Controllers'].forEach(function(obj) {
        expect(subject[obj]).to.equal(obj);
      });
    });
  });

  describe("createController", function() {
    var controller;
    beforeEach(function() {
      controller = subject.createController("test");
    });

    it("creates a controller", function() {
      expect(controller.constructor.name).to.equal("Controller");
    });

    it("assings the controller constructor to the Controllers namespace", function() {
      expect(subject.Controllers.Test).to.be.defined;
    });

    it("assigns a controller instance to the application namespace", function() {
      expect(subject.TestController).to.equal(controller);
    });

    it("sets the controller dispatcher to the application dispatcher", function() {
      expect(controller.dispatcher).to.equal(subject.Dispatcher);
    });

    it("sets the controller router to the application router", function() {
      expect(controller.router).to.equal(subject.Router);
    });
  });
});
