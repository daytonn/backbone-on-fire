var $fixtures;
beforeEach(function() {
  $("#mocha").append('<div id="mocha-fixtures" />');
  $fixtures = $("#mocha-fixtures");
});

afterEach(function() {
  $("#mocha-fixtures").remove();
  $fixtures = undefined;
});
