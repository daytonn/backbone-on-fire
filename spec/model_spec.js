describe("Model", function() {
  var BaseModel;
  var ChildModel;
  var ChildCollection;
  var data;
  var subject;
  var requests;

  beforeEach(function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function(xhr) {
      requests.push(xhr);
    };
    ChildModel = Backbone.OnFire.Model.extend();
    ChildCollection = Backbone.Collection.extend();
    BaseModel = Backbone.OnFire.Model.extend({
      urlRoot: "http://localhost:9876/debug.html#save",
      relationships: {
        first_child: ChildModel,
        second_child: ChildModel,
        child_collection: ChildCollection
      }
    });
    data = { first_child: { id: 1 }};
    subject = new BaseModel();
  });

  describe("deserialize", function() {
    it("has a default deserialize method", function() {
      expect(subject.deserialize).to.be.function;
    });

    it("returns the data passed to it", function() {
      expect(subject.deserialize(data)).to.equal(data);
    });
  });

  describe("instantiateRelationship", function() {
    it("wraps the given attribute", function() {
      subject.instantiateRelationship(data, "first_child", ChildModel);
      expect(data.first_child.constructor).to.equal(ChildModel);
    });
  });

  describe("parse", function() {
    beforeEach(function() {
      subject = new BaseModel(data);
    });

    it("sets the default data to an empty object", function() {
      expect(subject.parse()).to.be.like({});
    });

    it("instantiates the given relationship", function() {
      expect(subject.get("first_child").constructor).to.equal(ChildModel);
    });

    it("deserializes the data", function() {
      sinon.spy(subject, "deserialize");
      subject.parse(data);
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

  describe("toJSON", function() {
    var firstChildAttributes;
    var secondChildAttributes;
    var childCollectionAttributes;
    var attributes;
    beforeEach(function() {
      firstChildAttributes = { id: 2, name: "my first child" };
      secondChildAttributes = { id: 5, name: "my second child" };
      childCollectionAttributes = [
        { id: 6, name: "child collection 6" },
        { id: 7, name: "child collection 7" }
      ];
      attributes = {
        first_child: firstChildAttributes,
        second_child: secondChildAttributes,
        child_collection: childCollectionAttributes
      };
      subject = new BaseModel(attributes);
    });

    it("serializes the relationships", function() {
      var json = subject.toJSON();
      expect(json.first_child_attributes).to.be.like(firstChildAttributes);
      expect(json.first_child).to.be.undefined;
      expect(json.second_child_attributes).to.be.like(secondChildAttributes);
      expect(json.second_child).to.be.undefined;
      expect(json.child_collection_attributes).to.be.like(childCollectionAttributes);
      expect(json.child_collection).to.be.undefined;
    });

    describe("with custom toJSON method", function() {
      beforeEach(function() {
        BaseModel = Backbone.OnFire.Model.extend({
          urlRoot: "http://localhost:9876/debug.html#save",
          relationships: {
            first_child: ChildModel,
            second_child: ChildModel,
            child_collection: ChildCollection
          },
          toJSON: function() {
            return { foo: "bar" };
          }
        });
        subject = new BaseModel(attributes);
      });

      it("serializes the relationships", function() {
        var json = subject.toJSON();
        expect(json.foo).to.equal("bar");
        expect(json.first_child_attributes).to.be.like(firstChildAttributes);
        expect(json.first_child).to.be.undefined;
        expect(json.second_child_attributes).to.be.like(secondChildAttributes);
        expect(json.second_child).to.be.undefined;
        expect(json.child_collection_attributes).to.be.like(childCollectionAttributes);
        expect(json.child_collection).to.be.undefined;
      });
    });
  });

  describe("save", function() {
    var request;
    var firstChildAttributes;
    var secondChildAttributes;
    var childCollectionAttributes;
    beforeEach(function(done) {
      firstChildAttributes = { id: 2, name: "my first child" };
      secondChildAttributes = { id: 5, name: "my second child" };
      childCollectionAttributes = [
        { id: 6, name: "child collection 6" },
        { id: 7, name: "child collection 7" }
      ];
      var attributes = {
        first_child: firstChildAttributes,
        second_child: secondChildAttributes,
        child_collection: childCollectionAttributes
      };
      subject = new BaseModel(attributes);
      subject.save().done(function() {
        done();
      });
      request = requests.last();
      request.respond(200, { "Content-Type": "application/json" }, JSON.stringify({
        first_child: firstChildAttributes,
        second_child: secondChildAttributes,
        child_collection: childCollectionAttributes
      }));
    });

    it("creates nested attributes", function() {
      var data = JSON.parse(request.requestBody);

      expect(data.first_child_attributes).to.be.like(firstChildAttributes);
      expect(data.second_child_attributes).to.be.like(secondChildAttributes);
      expect(data.child_collection_attributes).to.be.like(childCollectionAttributes);

      expect(subject.get("first_child_attributes")).to.equal(undefined);
      expect(subject.get("second_child_attributes")).to.equal(undefined);
      expect(subject.get("child_collection_attributes")).to.equal(undefined);
    });
  });
});
