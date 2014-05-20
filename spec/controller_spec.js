describe("Controller", function() {
  var subject;
  beforeEach(function() {
    var TestController = Backbone.Controller.extend("Test");
    subject = new TestController;
  });

  it("requires a name", function() {
    expect(Backbone.Controller.extend).to.throw("Backbone.Controller.extend(name, options): name is undefined");
  });

  it("expects name to be a string", function() {
    expect(function() { Backbone.Controller.extend({}); }).to.throw("Backbone.Controller.extend(name, options): name is expected to be a string got [object Object]");
  });

  it("sets the name on the instance", function() {
    expect(subject.name).to.equal("TestController");
  });

  it("has a default initialize method", function() {
    expect(subject.initialize).to.be.function;
  });

  describe("with options", function() {
    beforeEach(function() {
      var ApplicationController = Backbone.Controller.extend("application", {
        bar: "bar"
      });
      var TestController = Backbone.Controller.extend("test", {
        foo: "foo"
      });
      subject = new TestController;
    });

    it("extends the default prototype", function() {
      expect(subject.foo).to.equal("foo");
    });
  });

  describe("initialize", function() {
    it("calls initialize when instantiated", function() {
      var TestController = Backbone.Controller.extend("test", {
        initialize: function() {
          this.initialized = true;
        }
      });
      subject = new TestController;
      expect(subject.initialized).to.be.true;
    });
  });

  describe("event delegation", function() {
    var dispatcher;
    var handler;
    beforeEach(function() {
      handler = sinon.spy();
      dispatcher = _.clone(Backbone.Events);
      sinon.spy(dispatcher, "on");
      sinon.spy(dispatcher, "off");
      var TestController = Backbone.Controller.extend("test", {
        dispatcher: dispatcher
      });
      subject = new TestController;
    });

    it("has on/off convenience methods which delegates to the dispatcher", function() {
      expect(subject.on).to.be.function;
      expect(subject.off).to.be.function;
      subject.on("test", handler, subject);
      expect(dispatcher.on).to.have.been.calledWith("test", handler, subject);
      subject.off("test", handler, subject);
      expect(dispatcher.off).to.have.been.calledWith("test", handler, subject);
    });

    it("it throws an error if there is no dispatcher", function() {
      var TestController = Backbone.Controller.extend("test");
      subject = new TestController;
      expect(function() {
        subject.on("test", handler, subject);
      }).to.throw("TestController has no dispatcher");
      expect(function() {
        subject.off("test", handler, subject);
      }).to.throw("TestController has no dispatcher");
    });
  });

  describe("routes", function() {
    var router;
    beforeEach(function() {
      router = {
        route: sinon.spy()
      };
      var TestController = Backbone.Controller.extend("test", {
        router: router,
        routes: ['new', 'show/:id', 'edit/:id', '/beginning', 'ending/', '/both/'],
        index: sinon.spy(),
        new: sinon.spy(),
        show: sinon.spy(),
        edit: sinon.spy(),
        beginning: sinon.spy(),
        ending: sinon.spy(),
        both: sinon.spy()
      });
      subject = new TestController;
    });

    it("registers the index route by default", function() {
      expect(router.route).to.have.been.calledWith('test', subject.index);
    });

    it("registers the routes", function() {
      expect(router.route).to.have.been.calledWith('test/new', subject.new);
      expect(router.route).to.have.been.calledWith('test/show/:id', subject.show);
      expect(router.route).to.have.been.calledWith('test/edit/:id', subject.edit);
    });

    it("fixes routes with beginning slashes", function() {
      expect(router.route).to.have.been.calledWith('test/beginning', subject.beginning);
    });

    it("fixes routes with ending slashes", function() {
      expect(router.route).to.have.been.calledWith('test/ending', subject.ending);
    });

    it("fixes routes with beginning and ending slashes", function() {
      expect(router.route).to.have.been.calledWith('test/both', subject.both);
    });

    describe("without a router", function() {
      var TestController;
      beforeEach(function() {
        TestController = Backbone.Controller.extend("test", {
          routes: ['index']
        });
      });

      it("throws an error if it has routes and no router", function() {
        expect(function() {
          new TestController;
        }).to.throw("TestController: router is undefined");
      });
    });

    describe("without an action", function() {
      var TestController;
      beforeEach(function() {
        TestController = Backbone.Controller.extend("test", {
          router: {
            route: sinon.spy()
          },
          routes: ['index']
        });
      });

      it("throws an error if a route has no action", function() {
        expect(function() {
          new TestController;
        }).to.throw("TestController: has no action matching route 'index'");
      });
    });
  });
});
