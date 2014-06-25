describe("Collection", function() {
  var subject;
  var TestCollection;
  var TestModel;
  beforeEach(function() {
    TestModel = Backbone.OnFire.Model.extend();
    TestCollection = Backbone.OnFire.Collection.extend({
      model: TestModel
    });
    subject = new TestCollection([{ id: 1 }]);
  });

  it("allows passing raw attributes", function() {
    subject.add({ id: 2 });
    expect(subject.size()).to.equal(2);
  });

  describe("isNotEmpty", function() {
    it("inverts the isEmpty logic for convenience", function() {
      expect(subject.isNotEmpty()).to.equal(true);
      subject.reset();
      expect(subject.isNotEmpty()).to.equal(false);
    });
  });

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
