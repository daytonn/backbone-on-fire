describe("Model", function() {
  var TestModel;
  var data;
  var subject;
  var serializer1;
  var serializer2;

  beforeEach(function() {
    TestModel = Backbone.OnFire.Model.extend();
    data = { foo: "bar" };
    subject = new TestModel;
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
      subject = new TestModel({}, options);
    });

    it("sets parse to true", function() {
      expect(options.parse).to.be.true;
    });
  });

  describe("deserialize", function() {
    it("returns the data passed in", function() {
      expect(subject.deserialize(data)).to.equal(data);
    });
  });

  describe("serialize", function() {
    it("returns the model json", function() {
      expect(subject.serialize()).to.be.like(subject.toJSON());
    });
  });

  describe("preParse", function() {
    it("returns the data passed in", function() {
      expect(subject.preParse(data)).to.equal(data);
    });
  });

  describe("parse", function() {
    beforeEach(function() {
      sinon.spy(subject, "preParse");
      sinon.spy(subject, "deserialize");
      subject.parse({});
    });

    it("pre-parses the data", function() {
      expect(subject.preParse).to.have.been.called;
    });

    it("deserializes the data", function() {
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

  describe("extend", function() {
    var options;
    beforeEach(function() {
      options = {};
    });

    describe("with serializer", function() {
      var serializer;
      beforeEach(function() {
        serializer = {
          serialize: function() {
            return "serializer.serialize";
          },
          deserialize: function() {
            return "serializer.deserialize";
          },
          toJSON: function() {
            return "serializer.toJSON";
          }
        };
        options.serializer = serializer;
        TestModel = Backbone.OnFire.Model.extend(options);
        subject = new TestModel;
      });

      it("sets the serializer methods", function() {
        expect(subject.serialize()).to.equal("serializer.serialize");
        expect(subject.deserialize()).to.equal("serializer.deserialize");
        expect(subject.toJSON()).to.equal("serializer.toJSON");
      });
    });
  });

  describe("bindings", function() {
    var callFunction;
    beforeEach(function() {
      TestModel = Backbone.OnFire.Model.extend({
        scope: "TestModel",
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

      subject = new TestModel;
    });

    it("binds all methods to the model", function() {
      expect(callFunction(subject.whichScope)).to.equal("TestModel");
      expect(callFunction(subject.anotherScope)).to.equal("TestModel");
    });
  });

  describe("serializers", function() {
    beforeEach(function() {
      serializer1 = {
        serialize: function(json) {
          json.serializer1 = true;
          return json;
        },
        deserialize: function(json) {
          json.deserializer1 = true;
          return json;
        },
        toJSON: function(json) {
          json.toJSON1 = true;
          return json;
        }
      };
      serializer2 = {
        serialize: function(json) {
          json.serializer2 = true;
          return json;
        },
        deserialize: function(json) {
          json.deserializer2 = true;
          return json;
        },
        toJSON: function(json) {
          json.toJSON2 = true;
          return json;
        }
      };
      TestModel = Backbone.OnFire.Model.extend({
        serializers: [serializer1, serializer2]
      });
      data = { foo: "bar" };
      subject = new TestModel(data);
    });

    describe("serialize", function() {
      var data;
      beforeEach(function() {
        data = subject.serialize();
      });

      it("calls each serializer", function() {
        expect(data).to.be.like({
          foo: "bar",
          deserializer1: true,
          deserializer2: true,
          toJSON1: true,
          toJSON2: true,
          serializer1: true,
          serializer2: true
        });
      });
    });

    describe("deserialize", function() {
      var data;
      beforeEach(function() {
        data = subject.deserialize({ foo: "bar" });
      });

      it("calls each serializer", function() {
        expect(data).to.be.like({
          foo: "bar",
          deserializer1: true,
          deserializer2: true
        });
      });
    });

    describe("toJSON", function() {
      var data;
      beforeEach(function() {
        data = subject.toJSON();
      });

      it("calls each serializer", function() {
        expect(data).to.be.like({
          foo: "bar",
          deserializer1: true,
          deserializer2: true,
          toJSON1: true,
          toJSON2: true
        });
      });
    });
  });
});

