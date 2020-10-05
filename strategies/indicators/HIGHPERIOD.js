/*
 * Periodic highest price
 */
var log = require('../../core/log');

var Indicator = function(config) {
  this.input = 'high';
  this.result = 0;
  //this._size = 30;
  this.size = config.size;
  this.age = 0;
  this.highHist = new Array();
};

Indicator.prototype.update = function(high) {
  // We need sufficient history to get the right result.
  this.highHist.push(high);

  if (this.highHist.length > this.size) this.highHist.shift();
  this.age++;

  if (this.age >= this.size) {
    this.calculate(this.highHist);
  }
};

/*
 * Handle calculations
 */
Indicator.prototype.calculate = function(highHist) {
  this.result = Math.max(...highHist);
};

module.exports = Indicator;
