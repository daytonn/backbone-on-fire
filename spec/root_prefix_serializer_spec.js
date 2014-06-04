describe("RootPrefixSerializer", function() {
  var TestModel;
  var attributes;
  var subject;
  var data;

  beforeEach(function() {
    attributes = { foo: "bar" };
    TestModel = Backbone.OnFire.Model.extend({
      root: "test",
      urlRoot: "tests",
      serializers: [new Backbone.OnFire.RootPrefixSerializer]
    });
    subject = new TestModel(_.clone(attributes));
  });

  afterEach(function() {
    data = undefined;
    attributes = undefined;
  });

  describe("deserialize", function() {
    beforeEach(function() {
      var attrs = { test: _.clone(attributes) };
      data = subject.deserialize(attrs);
    });

    it("removes the root if it exists", function() {
      expect(data.test).to.be.undefined;
      expect(subject.get("test")).to.be.undefined;
    });

    it("does not try to remove the root if it is absent", function() {
      expect(subject.deserialize(attributes)).to.be.like(attributes);
    });
  });

  describe("serialize", function() {
    beforeEach(function() {
      subject = new TestModel(_.clone(attributes));
      data = subject.serialize();
    });

    it("creates nested attributes under the root", function() {
      expect(data.test.foo).to.equal("bar");
      expect(data.foo).to.be.undefined;
      expect(subject.get("test")).to.be.undefined;
    });
  });
});
