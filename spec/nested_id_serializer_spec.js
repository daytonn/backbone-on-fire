describe("NestedIdSerializer", function() {
  var TestModel;
  var ChildModel;
  var ChildCollection;
  var attributes;
  var subject;
  var data;

  beforeEach(function() {
    ChildModel = Backbone.OnFire.Model.extend();
    ChildCollection = Backbone.Collection.extend();
    TestModel = Backbone.OnFire.Model.extend({
      urlRoot: "tests",
      serializers: [new Backbone.OnFire.NestedIdSerializer],
      relationships: {
        child_collection: ChildCollection
      }
    });
    attributes = {
      child_collection_ids: [1, 2, 3]
    };
    subject = new TestModel(_.clone(attributes));
  });

  afterEach(function() {
    data = undefined;
    attributes = undefined;
  });

  describe("deserialize", function() {
    it("instantiates the given relationships with their id", function() {
      expect(subject.get("child_collection").first().id).to.equal(1);
      expect(subject.get("child_collection").last().id).to.equal(3);
    });
  });
});
