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
          serialize: sinon.spy(),
          deserialize: sinon.spy(),
          toJSON: sinon.spy()
        };
        options.serializer = serializer;
        TestModel = Backbone.OnFire.Model.extend(options);
        subject = new TestModel;
      });

      it("sets the serializer methods", function() {
        expect(subject.serialize).to.equal(serializer.serialize);
        expect(subject.deserialize).to.equal(serializer.deserialize);
        expect(subject.toJSON).to.equal(serializer.toJSON);
      });

      describe("with serializer and specific serialize methods", function() {
        var deserialize;
        var serialize;
        var toJSON;
        beforeEach(function() {
          serializer = {
            serialize: function() {
              var json = this.toJSON();
              json.serializer_serialized = true;
              return json;
            },
            deserialize: function(json) {
              json.serializer = true;
              return json;
            },
            toJSON: function() {
              var json = _.clone(this.attributes);
              json.serializer = true;
              return json;
            }
          };
          serialize = function() {
            var json = this.toJSON();
            json.custom_serialized = true;
            return json;
          };
          deserialize = function(json) {
            json.deserialize = true;
            return json;
          };
          toJSON = function() {
            var json = _.clone(this.attributes);
            json.toJSON = true;
            return json;
          };
          options.serializer = serializer;
          options.serialize = serialize;
          options.deserialize = deserialize;
          options.toJSON = toJSON;
          options.parse = sinon.spy();
          TestModel = Backbone.OnFire.Model.extend(options);
          subject = new TestModel;
        });

        it("creates a compound toJSON method", function() {
          expect(subject.toJSON()).to.be.like({
            serializer: true,
            toJSON: true
          });
        });

        it("creates a compound deserialize method", function() {
          expect(subject.deserialize({})).to.be.like({
            serializer: true,
            deserialize: true
          });
        });

        it("creates a compound serialize method", function() {
          expect(subject.serialize()).to.be.like({
            serializer: true,
            toJSON: true,
            serializer_serialized:  true,
            custom_serialized: true
          });
        });
      });
    });
  });
});

