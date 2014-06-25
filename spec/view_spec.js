describe("View", function() {
  var subject;
  var $el;
  var TestView;
  beforeEach(function() {
    $fixtures.append('<div id="view-root" />');
    $el = $("#view-root");
  });

  describe("bindings", function() {
    var callFunction;
    beforeEach(function() {
      callFunction = function(callback) {
        this.scope = "callFunction";
        return callback();
      };
      TestView = Backbone.OnFire.View.extend({
        scope: "TestView",
        whichScope: function() { return this.scope; },
        anotherScope: function() { return this.scope; }
      });

      subject = new TestView;
    });

    it("binds all methods to the view", function() {
      expect(callFunction(subject.whichScope)).to.equal("TestView");
      expect(callFunction(subject.anotherScope)).to.equal("TestView");
    });
  });

  describe("toggleLoading", function() {
    beforeEach(function() {
      TestView = Backbone.OnFire.View.extend();
      subject = new TestView({
        el: "#view-root"
      });
      subject.toggleLoading();
    });

    it("toggles the loading class on the $el", function() {
      expect(subject.$el.hasClass("loading")).to.equal(true);
      subject.toggleLoading();
      expect(subject.$el.hasClass("loading")).to.equal(false);
    });

    it("prepends a loading mask div to the view", function() {
      expect(subject.$el.find(".loading-mask")).to.exist;
    });

    it("saves a reference to the loading mask", function() {
      expect(_.isUndefined(subject.loadingMask)).to.equal(false);
      expect(subject.loadingMask.hasClass("loading-mask")).to.equal(true);
    });

    describe("with renderLoadingMask set to false", function() {
      beforeEach(function() {
        $el.empty();
        subject = new TestView({
          el: "#view-root",
          renderLoadingMask: false
        });
        subject.toggleLoading();
      });

      it("does not render a loading mask", function() {
        expect(subject.$(".loading-mask").length).to.equal(0);
        expect(_.isUndefined(subject.loadingMask)).to.equal(true);
      });
    });
  });
});
