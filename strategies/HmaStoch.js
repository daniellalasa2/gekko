//Author: Danial Lalasa <daniel.lalasa@gmail.com>
//Standard time period for this strategy is 15min candle
var strat = {};
var log = require('../core/log.js');
strat.init = function() {
  this.name = 'HmaStoch';
  this.takeProfit = 1.3 / 100;
  this.requiredHistory = this.tradingAdvisor.historySize;
  this.addTulipIndicator('Hma9', 'hma', { optInTimePeriod: 9 });
  this.addTulipIndicator('Hma25', 'hma', { optInTimePeriod: 25 });
  this.addIndicator('Stoch', 'stoch', {
    optInFastKPeriod: 14, //%K
    optInSlowDPeriod: 5, //%D
    optInSlowKPeriod: 3, //Smooth%K
  });
};
strat.log = function(candle) {
  log.debug('\t', 'ind:', this.indicators);
};
strat.update = function(candle) {
  //   this.indicators.highperiod.update(candle.high);
  //   this.indicators.avgvol.update(candle.volume);
};

strat.check = function(candle) {
  if (Hma9 > Hma25 && Stoch.K < 40 && Stoch.K > Stoch.D) {
    this.advice({
      direction: 'long',
      trigger: {
        type: 'trailingStop',
        trailPercentage: 1.5,
        // trailValue: 100
      },
    });
  }
};

module.exports = strat;
