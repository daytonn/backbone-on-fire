describe("Backbone.Sync", function() {
  var requests;
  var TestModel;
  var ChildModel;
  var ChildCollection;
  var firstChildAttributes;
  var secondChildAttributes;
  var childCollectionAttributes;
  var attributes;
  var subject;

  beforeEach(function() {
    var xhr = sinon.useFakeXMLHttpRequest();
    requests = [];
    xhr.onCreate = function(xhr) {
      requests.push(xhr);
    };
    ChildModel = Backbone.OnFire.Model.extend();
    ChildCollection = Backbone.Collection.extend();
    TestModel = Backbone.OnFire.Model.extend({
      urlRoot: "tests",
      serializers: [new Backbone.OnFire.NestedModelSerializer, new Backbone.OnFire.RootPrefixSerializer],
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
    attributes = undefined;
  });

  it("serializes the model when syncing", function() {
    Backbone.sync("create", subject);
    var data = JSON.parse(requests.last().requestBody);
    expect(data.first_child_attributes).to.be.like(firstChildAttributes);
    expect(data.second_child_attributes).to.be.like(secondChildAttributes);
    expect(data.child_collection_attributes).to.be.like(childCollectionAttributes);

    expect(data.first_child).to.be.undefined;
    expect(data.second_child).to.be.undefined;
    expect(data.child_collection).to.be.undefined;
  });

  describe("with root", function() {
    beforeEach(function() {
      TestModel = Backbone.OnFire.Model.extend({
        urlRoot: "tests",
        root: "test",
        serializers: [new Backbone.OnFire.NestedModelSerializer, new Backbone.OnFire.RootPrefixSerializer],
        relationships: {
          first_child: ChildModel,
          second_child: ChildModel,
          child_collection: ChildCollection
        }
      });
      subject = new TestModel(_.clone(attributes));
    });

    it("serializes the with root model when syncing", function() {
      Backbone.sync("create", subject);
      var data = JSON.parse(requests.last().requestBody);
      expect(data.test.first_child_attributes).to.be.like(firstChildAttributes);
      expect(data.test.second_child_attributes).to.be.like(secondChildAttributes);
      expect(data.test.child_collection_attributes).to.be.like(childCollectionAttributes);

      expect(data.test.first_child).to.be.undefined;
      expect(data.test.second_child).to.be.undefined;
      expect(data.test.child_collection).to.be.undefined;
    });
  });
});
