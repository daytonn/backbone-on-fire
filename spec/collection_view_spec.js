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

    describe("when it has a template", function() {
      beforeEach(function() {
        subject.template = _.template("template");
        spyOn(subject.$el, "html");
        subject.render();
      });

      it("renders the template", function() {
        expect(subject.$el.html.calledWith(subject.template())).to.equal(true);
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

        spyOn(subject.$el, "html");
        spyOn(subject, "renderItemViews");
        spyOn(subject, "createItemViews");
        subject.render();
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
      spyOn(subject.$el, "append");
      subject.renderItemView(subject.modelViews.first());
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
      spyOn(subject, "renderItemView");
      subject.renderItemViews();
    });

    it("renders each list item view", function() {
      expect(subject.renderItemView.callCount).to.equal(2);
    });
  });

  describe("addItemView", function() {
    var model;
    beforeEach(function() {
      model = new TestModel({ id: 3 });
      spyOn(subject.$el, "append");
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

  describe("removeItemView", function() {
    var viewToRemove;
    beforeEach(function() {
      viewToRemove = subject.modelViews[0];
      spyOn(viewToRemove, "remove");
    });

    it("removes an itemView with a given model", function() {
      subject.removeItemView(viewToRemove.model);
      expect(subject.modelViews.length).to.equal(1);
      expect(viewToRemove.remove.called).to.equal(true);
      expect(_(subject.modelViews).contains(viewToRemove)).to.equal(false);
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
      spyOn(Backbone.View.prototype, "remove");
      spyOn(subject, "removeItemViews");
      subject.remove();
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

    it("listens to the collection's remove event", function() {
      var lastModelView = subject.modelViews.last();
      expect(subject.modelViews.length).to.equal(2);
      subject.collection.remove(subject.modelViews.first().model);
      expect(subject.modelViews.length).to.equal(1);
      expect(subject.modelViews.first()).to.equal(lastModelView);
    });

    it("listens to the collection's destroy event", function() {
      var lastModelView = subject.modelViews.last();
      expect(subject.modelViews.length).to.equal(2);
      subject.collection.remove(subject.modelViews.first().model);
      expect(subject.modelViews.length).to.equal(1);
      expect(subject.modelViews.first()).to.equal(lastModelView);
    });
  });
});
