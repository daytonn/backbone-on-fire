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
    expect(subject.modelViews).to.be.like([]);
  });

  it("has a modelConstructor", function() {
    expect(subject.modelConstructor).to.be.defined;
  });

  it("has a modelView", function() {
    expect(subject.modelView).to.be.defined;
  });

  it("is a unordered list by default", function() {
    expect(subject.tagName).to.equal("ul");
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
        expect(subject.createItemViews).not.to.have.been.called;
      });

      it("it does not render list item views", function() {
        expect(subject.renderItemViews).not.to.have.been.called;
      });

      describe("when an emptyTemplate is defined", function() {
        it("renders the empty template", function() {
          expect(subject.$el).to.have.text("empty");
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
      expect(subject.modelViews.length).to.equal(1);
      expect(subject.modelViews.first()).to.be.an.instanceof(TestModelView);
      expect(subject.modelViews.first().model).to.equal(subject.collection.first());
      expect(subject.modelViews.first().index).to.equal(0);
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
      expect(subject.$el.append).to.have.been.calledWith(subject.modelViews.first().render());
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
      expect(subject.renderItemView).to.have.callCount(2);
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
      expect(subject.$el.append).to.have.been.called;
    });
  });
});
