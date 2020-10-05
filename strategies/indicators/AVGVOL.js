/*
 * Average Volume
 */
var log = require('../../core/log');

var Indicator = function(config) {
  this.input = 'volume';
  this.result = 0;
  this.size = config.size;
  //this._size = 30;
  this.age = 0;
  this.volHist = new Array();
};

Indicator.prototype.update = function(volume) {
  // We need sufficient history to get the right result.
  this.volHist.push(volume);

  if (this.volHist.length > this.size) this.volHist.shift();
  this.age++;

  if (this.age >= this.size) this.calculate(this.volHist);

  return this.result;
};

/*
 * Handle calculations
 */
Indicator.prototype.calculate = function(volHist) {
  var VolSum = 0;
  for (var vol of volHist) {
    VolSum += vol;
  }
  this.result = VolSum / this.size;
};

module.exports = Indicator;
