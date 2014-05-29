describe("Controller", function() {
  var subject;
  beforeEach(function() {
    var TestController = Backbone.OnFire.Controller.extend("Test");
    subject = new TestController;
  });

  it("requires a name", function() {
    expect(Backbone.OnFire.Controller.extend).to.throw("Backbone.OnFire.Controller.extend(name, options): name is undefined");
  });

  it("expects name to be a string", function() {
    expect(function() { Backbone.OnFire.Controller.extend({}); }).to.throw("Backbone.OnFire.Controller.extend(name, options): name is expected to be a string got [object Object]");
  });

  it("sets the name on the instance", function() {
    expect(subject.name).to.equal("TestController");
  });

  it("has a default initialize method", function() {
    expect(subject.initialize).to.be.function;
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
      var TestController = Backbone.OnFire.Controller.extend("test", {
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
      var TestController = Backbone.OnFire.Controller.extend("test", {
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
      var TestController = Backbone.OnFire.Controller.extend("test");
      subject = new TestController;
      expect(function() {
        subject.on("test", handler, subject);
      }).to.throw("TestController has no dispatcher");
      expect(function() {
        subject.off("test", handler, subject);
      }).to.throw("TestController has no dispatcher");
    });
  });
});
