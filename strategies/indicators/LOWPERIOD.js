/*
 * Periodic highest price
 */
var log = require('../../core/log');

var Indicator = function(config) {
    this.input = 'low';
    this.result = 0;
    //this._size = 30;
    this.size = config.size;
    this.age = 0;
    this.lowHist = new Array();
};

Indicator.prototype.update = function(low) {
    // We need sufficient history to get the right result.
    this.lowHist.push(low);

    if (this.lowHist.length > this.size) this.lowHist.shift();
    this.age++;

    if (this.age >= this.size) {
        this.calculate(this.lowHist);
    }
};

/*
 * Handle calculations
 */
Indicator.prototype.calculate = function(lowHist) {
    this.result = Math.min(...lowHist);
};

module.exports = Indicator;