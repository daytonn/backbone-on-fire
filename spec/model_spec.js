describe("Model", function() {
  var TestModel;
  var attributes;
  var subject;
  var serializer1;
  var serializer2;

  beforeEach(function() {
    attributes = { foo: "bar" };
    TestModel = Backbone.OnFire.Model.extend();
    subject = new TestModel(attributes);
  });

  afterEach(function() {
    attributes = undefined;
  });

  it("has a default relationships object", function() {
    expect(subject.relationships).to.be.like({});
  });

  it("has a default serializers array", function() {
    expect(subject.serializers).to.be.like([]);
  });

  describe("constructor", function() {
    var options;
    beforeEach(function() {
      options = {};
      subject = new TestModel(attributes, options);
    });

    it("sets parse to true", function() {
      expect(options.parse).to.be.true;
    });
  });

  describe("parse", function() {
    beforeEach(function() {
      sinon.spy(subject, "deserialize");
      subject.parse({});
    });

    afterEach(function() {
      subject.deserialize.restore();
    });

    it("deserializes the attributes", function() {
      expect(subject.deserialize).to.have.been.called;
    });
  });

  describe("isPersisted", function() {
    it("returns the opposite of isNew", function() {
      expect(subject.isPersisted()).to.be.false;
      sinon.stub(subject, "isNew").returns(false);
      expect(subject.isPersisted()).to.be.true;
    });
  });

  describe("bindings", function() {
    var callFunction;
    beforeEach(function() {
      TestModel = Backbone.OnFire.Model.extend({
        scope: "TestModel",
        whichScope: function() { return this.scope; },
        anotherScope: function() { return this.scope; }
      });

      callFunction = function(callback) {
        this.scope = "callFunction";
        return callback();
      };

      subject = new TestModel;
    });

    it("binds all methods to the model", function() {
      expect(callFunction(subject.whichScope)).to.equal("TestModel");
      expect(callFunction(subject.anotherScope)).to.equal("TestModel");
    });
  });

  describe("serializers", function() {
    var serializer1;
    var serializer2;
    var serializedData;
    beforeEach(function() {
      serializer1 = {
        serialize: sinon.stub().returns("serialize1"),
        deserialize: sinon.stub().returns("deserialize1"),
        toJSON: sinon.stub().returns("toJSON1")
      };
      serializer2 = {
        serialize: sinon.stub().returns("serialize2"),
        deserialize: sinon.stub().returns("deserialize2"),
        toJSON: sinon.stub().returns("toJSON2")
      };
      TestModel = Backbone.OnFire.Model.extend({
        serializers: [serializer1, serializer2]
      });
      subject = new TestModel(attributes);
    });

    afterEach(function() {
      serializer1 = undefined;
      serializer2 = undefined;
      serializedData = undefined;
    });

    describe("serialize", function() {
      beforeEach(function() {
        serializedData = subject.serialize();
      });

      it("calls each serializer", function() {
        expect(serializer1.serialize).to.have.been.calledWith("toJSON2");
        expect(serializer2.serialize).to.have.been.calledWith("serialize1");
        expect(serializedData).to.equal("serialize2");
      });
    });

    describe("deserialize", function() {
      beforeEach(function() {
        serializedData = subject.deserialize(attributes);
      });

      it("calls each serializer", function() {
        expect(serializer1.deserialize).to.be.calledWith(attributes);
        expect(serializer2.deserialize).to.be.calledWith("deserialize1");
        expect(serializedData).to.equal("deserialize2");
      });
    });

    describe("toJSON", function() {
      beforeEach(function() {
        subject.attributes = attributes;
        serializedData = subject.toJSON();
      });

      it("calls each serializer", function() {
        expect(serializer1.toJSON).to.have.been.calledWith(attributes);
        expect(serializer2.toJSON).to.have.been.calledWith("toJSON1");
        expect(serializedData).to.equal("toJSON2");
      });
    });

    describe("with missing methods", function() {
      beforeEach(function() {
        serializer1.serialize = undefined;
        TestModel = Backbone.OnFire.Model.extend({
          serializers: [serializer1, serializer2]
        });
        subject = new TestModel(attributes);
      });

      it("does not try to execute missing methods", function() {
        expect(function() {
          subject.serialize();
        }).not.to.throw();
      });
    });
  });
});
