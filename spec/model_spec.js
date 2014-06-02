describe("Model", function() {
  var TestModel;
  var data;
  var subject;

  beforeEach(function() {
    TestModel = Backbone.OnFire.Model.extend();
    data = { foo: "bar" };
    subject = new TestModel;
  });

  it("has a default relationships object", function() {
    expect(subject.relationships).to.be.like({});
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

    it("binds all methods to the controller", function() {
      expect(callFunction(subject.whichScope)).to.equal("TestModel");
      expect(callFunction(subject.anotherScope)).to.equal("TestModel");
    });
  });
});

