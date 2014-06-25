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
      expect(_.isUndefined(data.test)).to.equal(true);
      expect(_.isUndefined(subject.get("test"))).to.equal(true);
    });

    it("does not try to remove the root if it is absent", function() {
      expect(subject.deserialize(attributes)).to.eql(attributes);
    });
  });

  describe("serialize", function() {
    beforeEach(function() {
      subject = new TestModel(_.clone(attributes));
      data = subject.serialize();
    });

    it("creates nested attributes under the root", function() {
      expect(data.test.foo).to.equal("bar");
      expect(_.isUndefined(data.foo)).to.equal(true);
      expect(_.isUndefined(subject.get("test"))).to.equal(true);
    });
  });
});
