describe("Collection", function() {
  describe("bindings", function() {
    var callFunction;
    beforeEach(function() {
      TestCollection = Backbone.OnFire.Collection.extend({
        scope: "TestCollection",
        whichScope: function() {
          return this.scope;
        },
        anotherScope: function() {
          return this.scope;
        }
      });

      callFunction = function(callback) {
        this.scope = "callFunction";
        return callback();
      };

      subject = new TestCollection;
    });

    it("binds all methods to the collection", function() {
      expect(callFunction(subject.whichScope)).to.equal("TestCollection");
      expect(callFunction(subject.anotherScope)).to.equal("TestCollection");
    });
  });
});
