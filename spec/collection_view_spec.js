describe("CollectionView", function() {
  var subject;
  var $el;
  var TestView;
  var TestModel;
  var TestModelView;
  beforeEach(function() {
    $fixtures.append('<div id="view-root" />');
    $el = $("#view-root");
    TestModel = Backbone.OnFire.Model.extend();
    TestModelView = Backbone.OnFire.View.extend();
    TestView = Backbone.OnFire.CollectionView.extend({
      modelConstructor: TestModel,
      modelView: TestModelView
    });

    subject = new TestView({
      el: "#view-root",
      collection: new Backbone.OnFire.Collection([{ id: 1 }, { id: 2 }])
    });
  });

  it("has modelViews", function() {
    expect(subject.modelViews).to.be.like([]);
  });

  it("has a modelConstructor", function() {
    expect(subject.modelConstructor).to.be.defined;
  });

  it("has a modelView", function() {
    expect(subject.modelView).to.be.defined;
  });

  describe("invalid definition", function() {
    it("throws an error if there is no model constructor", function() {
      expect(function() {
        new Backbone.OnFire.CollectionView.extend({ modelView: TestModelView });
      }).to.throw("CollectionView: modelConstructor is undefined.");
    });

    it("throws an error if there is no model view", function() {
      expect(function() {
        new Backbone.OnFire.CollectionView.extend({ modelConstructor: TestModel });
      }).to.throw("CollectionView: modelView is undefined.");
    });

    it("throws an error if there is no collection", function() {
      expect(function() {
        subject = new TestView({
          el: "#view-root"
        });
      }).to.throw("CollectionView: collection is undefined.");
    });
  });

  describe("render", function() {
    beforeEach(function() {
      sinon.spy(subject.$el, "empty");
      subject.render();
    });

    it("empties the element", function() {
      expect(subject.$el.empty).to.have.been.called;
    });

    it("returns the element", function() {
      expect(subject.render()).to.equal(subject.$el);
    });

    describe("when collection is empty", function() {
      beforeEach(function() {
        sinon.spy(subject.$el, "html");
        sinon.spy(subject, "renderListItemViews");
        sinon.spy(subject, "createListItemViews");
        subject.collection.reset();
        subject.render();
      });

      it("it does not create list item views", function() {
        expect(subject.createListItemViews).not.to.have.been.called;
      });

      it("it does not render list item views", function() {
        expect(subject.renderListItemViews).not.to.have.been.called;
      });
    });
  });
});
