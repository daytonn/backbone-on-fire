chai.use(function(_chai, utils) {
  utils.addProperty(_chai.Assertion.prototype, 'function', function () {
    this.assert(
      typeof this._obj === 'function',
      'expected #{this} to be a Function',
      'expected #{this} to not be a Function'
    );
  });

  utils.addProperty(_chai.Assertion.prototype, 'object', function () {
    this.assert(
      this._obj === Object(this._obj),
      'expected #{this} to be a Function',
      'expected #{this} to not be a Function'
    );
  });

  utils.addProperty(_chai.Assertion.prototype, 'defined', function () {
    this.assert(
      typeof this._obj !== 'undefined',
      'expected #{this} to be defined',
      'expected #{this} to be undefined'
    );
  });

  utils.addProperty(_chai.Assertion.prototype, 'undefined', function () {
    this.assert(
      typeof this._obj === 'undefined',
      'expected #{this} to be undefined',
      'expected #{this} to be defined'
    );
  });

  utils.addProperty(_chai.Assertion.prototype, 'true', function () {
    this.assert(
      this._obj === true,
      'expected #{this} to be true',
      'expected #{this} to be false'
    );
  });

  utils.addProperty(_chai.Assertion.prototype, 'false', function () {
    this.assert(
      this._obj === false,
      'expected #{this} to be false',
      'expected #{this} to be true'
    );
  });
});
