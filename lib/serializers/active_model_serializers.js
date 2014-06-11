Backbone.OnFire.ActiveModelSerializers = function() {
  return _(arguments).map(function(serializer) {
    var serializerName = serializer.replace(/Serializer$/, '') + "Serializer";
    return new Backbone.OnFire[serializerName];
  });
};

Backbone.OnFire.ActiveModelSerializers.all = [
  new Backbone.OnFire.NestedIdSerializer,
  new Backbone.OnFire.NestedModelSerializer,
  new Backbone.OnFire.RootPrefixSerializer
];
