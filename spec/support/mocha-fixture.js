var $fixtures;
beforeEach(function() {
  $("body").append('<div id="mocha-fixtures" />');
  $fixtures = $("#mocha-fixtures");
});

afterEach(function() {
  $("#mocha-fixtures").empty();
  subject = undefined;
});
