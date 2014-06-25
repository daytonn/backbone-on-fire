describe("Controller", function() {
  var subject;
  beforeEach(function() {
    var TestController = Backbone.OnFire.Controller.extend("Test");
    subject = new TestController;
  });

  it("requires a name", function() {
    expect(function() {
      Backbone.OnFire.Controller.extend();
    }).to.throwError("Backbone.OnFire.Controller.extend(name, options): name is undefined");
  });

  it("expects name to be a string", function() {
    expect(function() { Backbone.OnFire.Controller.extend({}); }).to.throwError("Backbone.OnFire.Controller.extend(name, options): name is expected to be a string got [object Object]");
  });

  it("sets the name on the instance", function() {
    expect(subject.name).to.equal("TestController");
  });

  it("has a default initialize method", function() {
    expect(_.isFunction(subject.initialize)).to.equal(true);
  });

  describe("with options", function() {
    beforeEach(function() {
      var ApplicationController = Backbone.OnFire.Controller.extend("application", {
        bar: "bar"
      });
      var TestController = Backbone.OnFire.Controller.extend("test", {
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
      var called = false;
      var TestController = Backbone.OnFire.Controller.extend("Test", {
        initialize: function() {
          called = true;
        }
      });
      subject = new TestController;
      expect(called).to.equal(true);
    });
  });

  describe("bindings", function() {
    var callFunction;
    beforeEach(function() {
      var TestController = Backbone.OnFire.Controller.extend("Test", {
        scope: "TestController",
        whichScope: function() {
          return this.scope;
        },
        anotherScope: function() {
          return this.scope;
        }
      });

      callFunction = function(callback) {
        this.scope = "callFunction";
        return callback();
      };

      subject = new TestController;
    });

    it("binds all methods to the controller", function() {
      expect(callFunction(subject.whichScope)).to.equal("TestController");
      expect(callFunction(subject.anotherScope)).to.equal("TestController");
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
      var TestController = Backbone.OnFire.Controller.extend("test", {
        dispatcher: dispatcher
      });
      subject = new TestController;
    });

    it("has on/off convenience methods which delegates to the dispatcher", function() {
      expect(_.isFunction(subject.on)).to.equal(true);
      expect(_.isFunction(subject.off)).to.equal(true);
      subject.on("test", handler, subject);
      expect(dispatcher.on.calledWith("test", handler, subject)).to.equal(true);
      subject.off("test", handler, subject);
      expect(dispatcher.off.calledWith("test", handler, subject)).to.equal(true);
    });

    it("it throws an error if there is no dispatcher", function() {
      var TestController = Backbone.OnFire.Controller.extend("test");
      subject = new TestController;
      expect(function() {
        subject.on("test", handler, subject);
      }).to.throwError("TestController has no dispatcher");
      expect(function() {
        subject.off("test", handler, subject);
      }).to.throwError("TestController has no dispatcher");
    });
  });
});
