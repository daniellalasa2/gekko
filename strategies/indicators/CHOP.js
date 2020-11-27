// required indicators
var TR = require('tulind');

var Indicator = function(settings) {
    this.input = 'candle';
    this.addTulipIndicator('tr', 'tr');
    this.addIndicator('highperiod', 'HIGHPERIOD', { size: 14 });
    this.addIndicator('lowperiod', 'LOWPERIOD', { size: 14 });
}

Indicator.prototype.update = function(candle) {

}

module.exports = Indicator;