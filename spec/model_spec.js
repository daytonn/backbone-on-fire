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
    expect(subject.relationships).to.eql({});
  });

  it("has a default serializers array", function() {
    expect(subject.serializers).to.eql([]);
  });

  describe("constructor", function() {
    var options;
    beforeEach(function() {
      options = {};
      subject = new TestModel(attributes, options);
    });

    it("sets parse to true", function() {
      expect(options.parse).to.equal(true);
    });
  });

  describe("set", function() {
    beforeEach(function() {
      spyOn(subject, "parse");
    });

    it("parses the data", function() {
      subject.set("foo", "bar");
      expect(subject.parse.calledWith({ foo: "bar" })).to.equal(true);
      subject.set({ baz: "qux" });
      expect(subject.parse.calledWith({ baz: "qux" })).to.equal(true);
    });
  });

  describe("parse", function() {
    beforeEach(function() {
      spyOn(subject, "deserialize");
      subject.parse({});
    });

    it("deserializes the attributes", function() {
      expect(subject.deserialize.called).to.equal(true);
    });
  });

  describe("isPersisted", function() {
    it("returns the opposite of isNew", function() {
      expect(subject.isPersisted()).to.equal(false);
      sinon.stub(subject, "isNew").returns(false);
      expect(subject.isPersisted()).to.equal(true);
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
        expect(serializer1.serialize.calledWith("toJSON2")).to.equal(true);
        expect(serializer2.serialize.calledWith("serialize1")).to.equal(true);
        expect(serializedData).to.equal("serialize2");
      });
    });

    describe("deserialize", function() {
      beforeEach(function() {
        serializedData = subject.deserialize(attributes);
      });

      it("calls each serializer", function() {
        expect(serializer1.deserialize.calledWith(attributes)).to.equal(true);
        expect(serializer2.deserialize.calledWith("deserialize1")).to.equal(true);
        expect(serializedData).to.equal("deserialize2");
      });
    });

    describe("toJSON", function() {
      beforeEach(function() {
        subject.attributes = attributes;
        serializedData = subject.toJSON();
      });

      it("calls each serializer", function() {
        expect(serializer1.toJSON.calledWith(attributes)).to.equal(true);
        expect(serializer2.toJSON.calledWith("toJSON1")).to.equal(true);
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
        }).not.to.throwError();
      });
    });
  });
});
