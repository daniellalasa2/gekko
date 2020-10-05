// Let's create our own strategy
var strat = {};
var log = require('../core/log.js');
// Prepare everything our strat needs
strat.init = function() {
  // your code!
  this.name = 'ReCrypto';
  this.takeProfit = 1.3 / 100;
  this.requiredHistory = this.tradingAdvisor.historySize;
  this.addIndicator('avgvol', 'AVGVOL', { size: 30 });
  this.addIndicator('highperiod', 'HIGHPERIOD', { size: 30 });
};
// For debugging purposes.
strat.log = function(candle) {
  // your code!
  // log.debug('\t', 'ind:', this.indicators);
};
strat.update = function(candle) {
  this.indicators.highperiod.update(candle.high);
  this.indicators.avgvol.update(candle.volume);
};
// Based on the newly calculated
// information, check if we should
// update or not.
strat.check = function(candle) {
  // your code!
  const { volume, close, open } = candle;
  var HP = this.indicators.highperiod.result;
  var AV = this.indicators.avgvol.result;
  // log.debug('\t', 'candle', volume, close, open);
  // console.log('AV', AV, 'HP', HP, 'vol', volume, 'close', close, 'open', open);
  if (
    AV &&
    HP &&
    volume &&
    close &&
    open &&
    volume >= AV &&
    close > open
    // close >= 1.02 * HP
  ) {
    this.advice({
      direction: 'long',
      // trigger: {
      //   // ignored when direction is not "long"
      //   type: 'trailingStop',
      //   trailPercentage: 2,
      //   // or:
      //   // trailValue: 100
      // },
    });
  }
  if (volume <= 0.33 * AV) {
    this.advice('short');
  }
};

module.exports = strat;
