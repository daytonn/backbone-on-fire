describe("ActiveModelSerializers", function() {
  var subject;
  beforeEach(function() {
    subject = Backbone.OnFire.ActiveModelSerializers;
  });

  describe("all", function() {
    it("returns all the serializers", function() {
      expect(subject.all).to.eql([
        new Backbone.OnFire.NestedIdSerializer,
        new Backbone.OnFire.NestedModelSerializer,
        new Backbone.OnFire.RootPrefixSerializer
      ]);
    });
  });

  it("returns specific serializers", function() {
    expect(subject("NestedIdSerializer", "RootPrefixSerializer")).to.eql([
      new Backbone.OnFire.NestedIdSerializer,
      new Backbone.OnFire.RootPrefixSerializer
    ]);
  });

  describe("without Serializer suffix", function() {
    it("returns specific serializers", function() {
      expect(subject("NestedId", "RootPrefix")).to.eql([
        new Backbone.OnFire.NestedIdSerializer,
        new Backbone.OnFire.RootPrefixSerializer
      ]);
    });
  });
});
