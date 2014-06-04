describe("NestedModelSerializer", function() {
  var TestModel;
  var ChildModel;
  var ChildCollection;
  var firstChildAttributes;
  var secondChildAttributes;
  var childCollectionAttributes;
  var attributes;
  var subject;
  var data;

  beforeEach(function() {
    ChildModel = Backbone.OnFire.Model.extend();
    ChildCollection = Backbone.Collection.extend();
    TestModel = Backbone.OnFire.Model.extend({
      urlRoot: "tests",
      serializers: [new Backbone.OnFire.NestedModelSerializer],
      relationships: {
        first_child: ChildModel,
        second_child: ChildModel,
        child_collection: ChildCollection
      }
    });
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
    subject = new TestModel(_.clone(attributes));
  });

  afterEach(function() {
    data = undefined;
    attributes = undefined;
  });

  describe("deserialize", function() {
    it("instantiates the given relationships", function() {
      expect(subject.get("first_child").get("name")).to.equal("my first child");
      expect(subject.get("second_child").get("name")).to.equal("my second child");
      expect(subject.get("child_collection").first().get("name")).to.equal("child collection 6");
      expect(subject.get("child_collection").last().get("name")).to.equal("child collection 7");
    });
  });

  describe("toJSON", function() {
    it("serializes the relationships", function() {
      var json = subject.toJSON();
      expect(json.first_child).to.be.like(subject.get("first_child").toJSON());
      expect(json.second_child).to.be.like(subject.get("second_child").toJSON());
      expect(json.child_collection).to.be.like(subject.get("child_collection").models.map(function(model) { return model.toJSON(); }));
    });

  });

  describe("serialize", function() {
    var data;
    beforeEach(function() {
      data = subject.serialize();
    });

    it("creates nested attributes", function() {
      expect(data.first_child_attributes).to.be.like(firstChildAttributes);
      expect(data.second_child_attributes).to.be.like(secondChildAttributes);
      expect(data.child_collection_attributes).to.be.like(childCollectionAttributes);

      expect(data.first_child).to.be.undefined;
      expect(data.second_child).to.be.undefined;
      expect(data.child_collection).to.be.undefined;

      expect(subject.get("first_child_attributes")).to.be.undefined;
      expect(subject.get("second_child_attributes")).to.be.undefined;
      expect(subject.get("child_collection_attributes")).to.be.undefined;
    });
  });
});
