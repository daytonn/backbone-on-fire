describe("Application", function() {
  var subject;
  beforeEach(function() {
    subject = Backbone.OnFire.Application.create();
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

  it("has an 'abstract' ApplicationController", function() {
    expect(subject.Controllers.Application).to.be.defined;
  });

  describe("with options", function() {
    var customDispatcher;
    beforeEach(function() {
      customDispatcher = "CustomDispatcher";
      subject = Backbone.OnFire.Application.create({
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
      subject.createController("ApplicationController", {
        initialize: function() {
          this.extendsApplicationController = true;
        }
      });
      controller = subject.createController("TestController", {
        foo: "foo"
      });
    });

    it("creates a controller", function() {
      expect(controller.constructor.name).to.equal("Controller");
    });

    it("assigns the controller constructor to the Controllers namespace", function() {
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

    it("extends the application controller", function() {
      expect(controller.extendsApplicationController).to.be.true;
    });

    it("doesn't pollute the ApplicationController", function() {
      expect(subject.Controllers.Application.prototype.foo).to.be.undefined;
    });

    describe("ApplicationController", function() {
      it("does not instantiate the application controller", function() {
        subject.createController("ApplicationController");
        expect(subject.ApplicationController).to.be.undefined;
      });
    });
  });

  describe("createModel", function() {
    var Model;
    var modelInstance;
    beforeEach(function() {
      Model = subject.createModel("TestModel");
      modelInstance = new Model;
    });

    it("sets the urlRoot", function() {
      expect(modelInstance.urlRoot).to.equal("/tests");
    });

    it("sets the name as root on the model", function() {
      expect(modelInstance.root).to.equal("test");
    });

    it("assigns the model constructor to the Models namespace", function() {
      expect(subject.Models.Test).to.equal(Model);
    });

    describe("with options", function() {
      beforeEach(function() {
        Model = subject.createModel("TestModel", {
          urlRoot: "/foos",
          root: "foo"
        });
        modelInstance = new Model;
      });

      it("defers to the optional root", function() {
        expect(modelInstance.root).to.equal("foo");
      });

      it("defers to the optional urlRoot", function() {
        expect(modelInstance.urlRoot).to.equal("/foos");
      });
    });
  });

  describe("createCollection", function() {
    var Model;
    var Collection;
    var collectionInstance;

    beforeEach(function() {
      Model = subject.createModel("Test");
      Collection = subject.createCollection("Tests");

      collectionInstance = new Collection([{ id: 1 }]);
    });

    it("assigns the collection constructor to the Collections namespace", function() {
      expect(subject.Collections.Tests).to.equal(Collection);
    });

    it("sets the url", function() {
      expect(collectionInstance.url).to.equal("/tests");
    });

    it("sets the model", function() {
      expect(collectionInstance.model.urlRoot).to.be.like(subject.Models.Test.urlRoot);
    });

    describe("with options", function() {
      beforeEach(function() {
        Model = subject.createModel("TestModel");
        Collection = subject.createCollection("TestsCollection", {
          url: "tests",
          model: Model
        });
        collectionInstance = new Collection([{ id: 1 }]);
      });
    });
  });
});
