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
    ChildCollection = Backbone.Collection.extend({
      model: ChildModel
    });
    TestModel = Backbone.OnFire.Model.extend({
      urlRoot: "tests",
      serializers: [new Backbone.OnFire.NestedModelSerializer],
      relationships: {
        first_child: ChildModel,
        second_child: ChildModel,
        child_collection: ChildCollection
      }
    });
    firstChildAttributes = function() {
      return { id: 2, name: "my first child" };
    };
    secondChildAttributes = function() {
      return { id: 5, name: "my second child" };
    };
    childCollectionAttributes = function() {
      return [
        { id: 6, name: "child collection 6" },
        { id: 7, name: "child collection 7" }
      ];
    };
    attributes = function() {
      return {
        first_child: firstChildAttributes(),
        second_child: secondChildAttributes(),
        child_collection: childCollectionAttributes()
      };
    };
    subject = new TestModel(attributes());
  });

  afterEach(function() {
    data = undefined;
  });

  describe("deserialize", function() {
    it("instantiates the given relationships", function() {
      expect(subject.get("first_child").get("name")).to.equal("my first child");
      expect(subject.get("second_child").get("name")).to.equal("my second child");
      expect(subject.get("child_collection").first().get("name")).to.equal("child collection 6");
      expect(subject.get("child_collection").last().get("name")).to.equal("child collection 7");
    });

    it("doesn't double wrap relationships", function() {
      expect(_(subject.attributes.first_child.attributes).size()).to.equal(2);
      expect(_(subject.attributes.second_child.attributes).size()).to.equal(2);
      subject.deserialize(subject.attributes);
      expect(_(subject.attributes.first_child.attributes).size()).to.equal(2);
      expect(_(subject.attributes.second_child.attributes).size()).to.equal(2);
    });

    describe("with existing relationships", function() {
      describe("model", function() {
        it("replaces the relationship", function() {
          subject = new TestModel({ first_child: firstChildAttributes() });
          var originalCID = subject.get("first_child").cid;
          subject.set({ first_child: { id: 3, name: "my first child updated" }});
          expect(subject.get("first_child").cid).not.to.equal(originalCID);
          expect(subject.get("first_child").id).to.equal(3);
          expect(subject.get("first_child").get("name")).to.equal("my first child updated");
        });

        it("replaces instances", function() {
          subject = new TestModel({ first_child: firstChildAttributes() });
          var originalCID = subject.get("first_child").cid;
          subject.set({ first_child: new ChildModel({ id: 3, name: "my first child updated" }) });
          expect(subject.get("first_child").cid).not.to.equal(originalCID);
          expect(subject.get("first_child").id).to.equal(3);
          expect(subject.get("first_child").get("name")).to.equal("my first child updated");
        });
      });

      describe("collection", function() {
        it("adds to the existing colleciton", function() {
          subject = new TestModel({ child_collection: childCollectionAttributes() });
          var originalCID = subject.get("child_collection").cid;
          subject.set({ child_collection: { id: 8, name: "child collection 8" }});
          expect(subject.get("child_collection").cid).to.equal(originalCID);
          expect(subject.get("child_collection").size()).to.equal(3);
          expect(subject.get("child_collection").last().id).to.equal(8);
        });

        it("replaces instances", function() {
          subject = new TestModel({ child_collection: childCollectionAttributes() });
          subject.set({ child_collection: new ChildCollection([{ id: 8, name: "child collection 8" }]) });
          expect(subject.get("child_collection").size()).to.equal(1);
          expect(subject.get("child_collection").first().id).to.equal(8);
        });
      });
    });
  });

  describe("toJSON", function() {
    it("serializes the relationships", function() {
      var json = subject.toJSON();
      expect(json.first_child).to.eql(subject.get("first_child").toJSON());
      expect(json.second_child).to.eql(subject.get("second_child").toJSON());
      expect(json.child_collection).to.eql(subject.get("child_collection").models.map(function(model) { return model.toJSON(); }));
    });
  });

  describe("serialize", function() {
    var data;
    beforeEach(function() {
      data = subject.serialize();
    });

    it("creates nested attributes", function() {
      expect(data.first_child_attributes).to.eql(firstChildAttributes());
      expect(data.second_child_attributes).to.eql(secondChildAttributes());
      expect(data.child_collection_attributes).to.eql(childCollectionAttributes());

      expect(_.isUndefined(data.first_child)).to.equal(true);
      expect(_.isUndefined(data.second_child)).to.equal(true);
      expect(_.isUndefined(data.child_collection)).to.equal(true);

      expect(_.isUndefined(subject.get("first_child_attributes"))).to.equal(true);
      expect(_.isUndefined(subject.get("second_child_attributes"))).to.equal(true);
      expect(_.isUndefined(subject.get("child_collection_attributes"))).to.equal(true);
    });
  });
});
