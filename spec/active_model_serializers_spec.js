describe("ActiveModelSerializers", function() {
  var subject;
  beforeEach(function() {
    subject = Backbone.OnFire.ActiveModelSerializers;
  });

  describe("all", function() {
    it("returns all the serializers", function() {
      expect(subject.all).to.be.like([
        new Backbone.OnFire.NestedIdSerializer,
        new Backbone.OnFire.NestedModelSerializer,
        new Backbone.OnFire.RootPrefixSerializer
      ]);
    });
  });

  it("returns specific serializers", function() {
    expect(subject("NestedIdSerializer", "RootPrefixSerializer")).to.be.like([
      new Backbone.OnFire.NestedIdSerializer,
      new Backbone.OnFire.RootPrefixSerializer
    ]);
  });

  describe("without Serializer suffix", function() {
    it("returns specific serializers", function() {
      expect(subject("NestedId", "RootPrefix")).to.be.like([
        new Backbone.OnFire.NestedIdSerializer,
        new Backbone.OnFire.RootPrefixSerializer
      ]);
    });
  });
});
