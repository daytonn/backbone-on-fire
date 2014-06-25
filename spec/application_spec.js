describe("Application", function() {
  var subject;
  beforeEach(function() {
    subject = Backbone.OnFire.Application.create();
  });

  it("has an initialize method", function() {
    expect(_.isFunction(subject.initialize)).to.equal(true);
  });

  it("has a Models object", function() {
    expect(_.isObject(subject.Models)).to.equal(true);
  });

  it("has a Collections object", function() {
    expect(_.isObject(subject.Collections)).to.equal(true);
  });

  it("has a Views object", function() {
    expect(_.isObject(subject.Views)).to.equal(true);
  });

  it("has a Controllers object", function() {
    expect(_.isObject(subject.Controllers)).to.equal(true);
  });

  it("has a Dispatcher", function() {
    expect(_.isUndefined(subject.Dispatcher)).to.equal(false);
  });

  it("has a Router", function() {
    expect(_.isUndefined(subject.Router)).to.equal(false);
  });

  it("has an 'abstract' ApplicationController", function() {
    expect(_.isUndefined(subject.Controllers.Application)).to.equal(false);
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
      _(['Models', 'Collections', 'Views', 'Controllers']).each(function(obj) {
        expect(subject[obj]).to.eql(obj);
      });
    });
  });

  describe("createController", function() {
    var controller;
    var extendsApplicationController;
    beforeEach(function() {
      extendsApplicationController = false;
      subject.createController("ApplicationController", {
        initialize: function() {
          extendsApplicationController = true;
        }
      });
      controller = subject.createController("TestController", {
        foo: "foo"
      });
    });

    it("creates a controller", function() {
      expect(controller).to.be.a(subject.Controllers.Test);
    });

    it("assigns the controller constructor to the Controllers namespace", function() {
      expect(_.isUndefined(subject.Controllers.Test)).to.equal(false);
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
      expect(extendsApplicationController).to.equal(true);
    });

    it("doesn't pollute the ApplicationController", function() {
      expect(_.isUndefined(subject.Controllers.Application.prototype.foo)).to.equal(true);
    });

    describe("ApplicationController", function() {
      it("does not instantiate the application controller", function() {
        subject.createController("ApplicationController");
        expect(_.isUndefined(subject.ApplicationController)).to.equal(true);
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
      expect(collectionInstance.model.urlRoot).to.eql(subject.Models.Test.urlRoot);
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
