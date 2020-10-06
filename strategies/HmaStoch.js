//Author: Danial Lalasa <daniel.lalasa@gmail.com>
//Standard time period for this strategy is 15min candle
var strat = {};
var log = require('../core/log.js');
strat.init = function() {
  this.name = 'HmaStoch';
  this.takeProfit = 1.3 / 100;
  this.requiredHistory = this.tradingAdvisor.historySize;
  this.addTulipIndicator('hma9', 'hma', { optInTimePeriod: 9 });
  this.addTulipIndicator('hma25', 'hma', { optInTimePeriod: 25 });
  this.addTulipIndicator('stoch1453', 'stoch', {
    optInFastKPeriod: 14, //%K
    optInSlowDPeriod: 5, //%D
    optInSlowKPeriod: 3, //Smooth%K
  });
  this.history = [];
};
strat.log = function(candle) {
  // log.debug('\t', 'ind:', this.tulipIndicators);
};
strat.update = function(candle) {
  //   this.indicators.highperiod.update(candle.high);
  //   this.indicators.avgvol.update(candle.volume);
};

strat.check = function(candle) {
  var hma9 = this.tulipIndicators.hma9.result.result;
  var hma25 = this.tulipIndicators.hma25.result.result;
  var stochK = this.tulipIndicators.stoch1453.result.stochK;
  var stochD = this.tulipIndicators.stoch1453.result.stochD;
  if (stochK && stochD) {
    log.debug('\t', 'history', this.history[0], 'now', stochK, stochD);
    if (
      stochK > stochD &&
      this.history[0].stochK <= this.history[0].stochD &&
      hma9 > hma25 &&
      this.history[1].hma9 <= this.history[1].hma25 &&
      stochK < 25
    ) {
      this.history = [];
      // this.advice('long');
      this.advice({
        direction: 'long',
        trigger: {
          type: 'trailingStop',
          trailPercentage: 3,
          // trailValue: 100
        },
      });
    }
    this.history[0] = this.tulipIndicators.stoch1453.result;
    this.history[1] = { hma9: hma9, hma25: hma25 };
  }
};

module.exports = strat;
