backbone-on-fire
================

Supercharged Backbone

Development
-----------

Install dependencies
```sh
npm install -g gulp
npm install -g karma
npm install
```

Run the watching compiler
```sh
gulp
```

Run the specs
```sh
karma start karma.config
```
(view mocha specs in the browser at [http://localhost:9876/debug.html](http://localhost:9876/debug.html))

Install Example dependencies
```sh
cd example
bower install
```

Run the example site
```sh
node server.js
```
