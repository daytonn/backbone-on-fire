describe("CollectionView", function() {
  var subject;
  var $el;
  var TestView;
  var TestModel;
  var TestModelView;
  var TestCollection;
  beforeEach(function() {
    $fixtures.append('<div id="view-root" />');
    $el = $("#view-root");
    TestModel = Backbone.OnFire.Model.extend();
    TestCollection = Backbone.OnFire.Collection.extend({
      model: TestModel
    });
    TestModelView = Backbone.OnFire.View.extend({
      initialize: function(options) {
        options = options || {};
        this.index = options.index;
      }
    });
    TestView = Backbone.OnFire.CollectionView.extend({
      modelConstructor: TestModel,
      modelView: TestModelView
    });

    subject = new TestView({
      el: "#view-root",
      collection: new TestCollection([{ id: 1 }, { id: 2 }])
    });
  });

  it("has modelViews", function() {
    expect(subject.modelViews).to.be.an(Array);
  });

  it("has a modelConstructor", function() {
    expect(_.isUndefined(subject.modelConstructor)).to.equal(false);
  });

  it("has a modelView", function() {
    expect(_.isUndefined(subject.modelView)).to.equal(false);
  });

  it("is a unordered list by default", function() {
    expect(subject.tagName).to.equal("ul");
  });

  describe("invalid definition", function() {
    it("throws an error if there is no model constructor", function() {
      expect(function() {
        new Backbone.OnFire.CollectionView.extend({ modelView: TestModelView });
      }).to.throwError("CollectionView: modelConstructor is undefined.");
    });

    it("throws an error if there is no model view", function() {
      expect(function() {
        new Backbone.OnFire.CollectionView.extend({ modelConstructor: TestModel });
      }).to.throwError("CollectionView: modelView is undefined.");
    });

    it("throws an error if there is no collection", function() {
      expect(function() {
        subject = new TestView({
          el: "#view-root"
        });
      }).to.throwError("CollectionView: collection is undefined.");
    });
  });

  describe("with options", function() {
    var emptyTemplate;
    beforeEach(function() {
      emptyTemplate = _.template('<li class="empty">The collection is empty</li>');
      TestView = Backbone.OnFire.CollectionView.extend({
        modelConstructor: TestModel,
        modelView: TestModelView,
        emptyTemplate: emptyTemplate
      });

      subject = new TestView({
        el: "#view-root",
        collection: new TestCollection([{ id: 1 }, { id: 2 }])
      });
    });

    it("sets the empty template", function() {
      expect(subject.emptyTemplate()).to.equal(emptyTemplate());
    });
  });

  describe("render", function() {
    beforeEach(function() {
      subject.render();
    });

    it("returns the element", function() {
      expect(subject.render()).to.equal(subject.$el);
    });

    describe("when item views already exist", function() {
      beforeEach(function() {
        subject.modelViews.length = 20;
        sinon.spy(subject, "renderItemViews");
        subject.render();
      });

      afterEach(function() {
        subject.renderItemViews.restore();
      });

      it("does not render the item views", function() {
        expect(subject.renderItemViews.called).to.equal(false);
      });
    });

    describe("when collection is empty", function() {
      beforeEach(function() {
        TestView = Backbone.OnFire.CollectionView.extend({
          modelConstructor: TestModel,
          modelView: TestModelView,
          emptyTemplate: _.template("empty")
        });

        subject = new TestView({
          el: "#view-root",
          collection: new TestCollection
        });

        sinon.spy(subject.$el, "html");
        sinon.spy(subject, "renderItemViews");
        sinon.spy(subject, "createItemViews");
        subject.render();
      });

      afterEach(function() {
        subject.$el.html.restore();
        subject.renderItemViews.restore();
        subject.createItemViews.restore();
      });

      it("it does not create list item views", function() {
        expect(subject.createItemViews.called).to.equal(false);
      });

      it("it does not render list item views", function() {
        expect(subject.renderItemViews.called).to.equal(false);
      });

      describe("when an emptyTemplate is defined", function() {
        it("renders the empty template", function() {
          expect(subject.$el.text()).to.match(/empty/);
        });
      });
    });
  });

  describe("createItemView", function() {
    var createdView;
    beforeEach(function() {
      createdView = subject.createItemView(subject.collection.first(), 0);
    });

    it("adds a view to the modelViews", function() {
      expect(subject.modelViews.length).to.equal(3);
      expect(subject.modelViews.last()).to.be.a(TestModelView);
      expect(subject.modelViews.last().model).to.equal(subject.collection.first());
      expect(subject.modelViews.last().index).to.equal(0);
    });

    it("returns the item view it created", function() {
      expect(createdView).to.equal(subject.modelViews.last());
    });
  });

  describe("renderItemView", function() {
    beforeEach(function() {
      subject.createItemView(subject.collection.first(), 0);
      sinon.spy(subject.$el, "append");
      subject.renderItemView(subject.modelViews.first());
    });

    afterEach(function() {
      subject.$el.append.restore();
    });

    it("appends the rendered list item view to the element", function() {
      expect(subject.$el.append.calledWith(subject.modelViews.first().render())).to.equal(true);
    });
  });

  describe("createItemViews", function() {
    beforeEach(function() {
      subject.createItemViews();
    });

    it("creates a list item view for each item", function() {
      expect(subject.modelViews.length).to.equal(2);
    });

    it("clears the modelViews array", function() {
      subject.createItemViews();
      expect(subject.modelViews.length).to.equal(2);
    });
  });

  describe("renderItemViews", function() {
    beforeEach(function() {
      subject.createItemViews();
      sinon.spy(subject, "renderItemView");
      subject.renderItemViews();
    });

    afterEach(function() {
      subject.renderItemView.restore();
    });

    it("renders each list item view", function() {
      expect(subject.renderItemView.callCount).to.equal(2);
    });
  });

  describe("addItemView", function() {
    var model;
    beforeEach(function() {
      model = new TestModel({ id: 3 });
      sinon.spy(subject.$el, "append");
      subject.createItemViews();
      subject.addItemView(model);
    });

    it("creates a list item view", function() {
      expect(subject.modelViews.length).to.equal(3);
    });

    it("appends the new item view $el", function() {
      expect(subject.$el.append.called).to.equal(true);
    });
  });

  describe("removeItemViews", function() {
    it("removes all the item views", function() {
      subject.removeItemViews();
      expect(subject.modelViews).to.eql([]);
    });
  });

  describe("remove", function() {
    beforeEach(function() {
      sinon.spy(Backbone.View.prototype, "remove");
      sinon.spy(subject, "removeItemViews");
      subject.remove();
    });

    afterEach(function() {
      Backbone.View.prototype.remove.restore();
      subject.removeItemViews.restore();
    });

    it("removes the item views", function() {
      expect(subject.removeItemViews.called).to.equal(true);
    });

    it("removes itself", function() {
      expect(Backbone.View.prototype.remove.called).to.equal(true);
    });
  });

  describe("events", function() {
    it("listens to the collection's add event", function() {
      var model = new TestModel({ id: 3 });
      expect(subject.modelViews.length).to.equal(2);
      subject.collection.add(model);
      expect(subject.modelViews.length).to.equal(3);
      expect(_(subject.modelViews).last().model).to.equal(model);
    });
  });
});
