require("colors");
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
app.use(express.static('example'));
app.listen(port);
console.log("Server started at: " + "http://localhost:".concat(port).magenta);
