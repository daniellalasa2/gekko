//Author: Danial Lalasa <daniel.lalasa@gmail.com>
//Standard time period for this strategy is 15min candle
var strat = {};
var log = require('../core/log.js');
strat.init = function() {
    this.name = 'BBEMA';
    this.takeProfit = 1.3 / 100;
    this.requiredHistory = this.tradingAdvisor.historySize;
    this.addTulipIndicator('ema100', 'ema', { optInTimePeriod: 100 });
    this.addTulipIndicator('ema50', 'ema', { optInTimePeriod: 50 });
    this.addTulipIndicator('ema200', 'ema', { optInTimePeriod: 200 });
    this.addTulipIndicator('bbands', 'bbands', {
        optInTimePeriod: 20,
        optInNbStdDevs: 2
    });
    this.history = [];
    this.adviced = false;
    this.advicedPrice = 0;
};
strat.log = function(candle) {
    // log.debug('\t', 'ind:', this.tulipIndicators);
};
strat.update = function(candle) {
    //   this.indicators.highperiod.update(candle.high);
    //   this.indicators.avgvol.update(candle.volume);
};

strat.check = function(candle) {
    var ema50 = this.tulipIndicators.ema50.result.result;
    var ema20 = this.tulipIndicators.ema20.result.result;
    var ema5 = this.tulipIndicators.ema5.result.result;
    var BB = this.tulipIndicators.bbands.result;
    var BBP = ((candle.close - BB.bbandsLower) / (BB.bbandsUpper - BB.bbandsLower)) * 100;
    var TP = 1 + this.takeProfit;
    var AP = this.advicedPrice;
    if (this.adviced &&
        (candle.close >= AP * TP || candle.open >= AP * TP || candle.high >= AP * TP || candle.low >= AP * TP
            //|| candle.close < ema200 || candle.open < ema200 || candle.high < ema200 || candle.low < ema200
        )
    ) {
        this.advice("short");
        this.adviced = false;
        this.advicedPrice = 0;
    }
    // if (BB.bbandsLower && BB.bbandsUpper) {
    if (!this.adviced &&
        ema20 > ema50 &&
        ema5 > 20 &&
        this.history[0] < ema20
        // BBP > 0
    ) {
        this.advice({
            direction: 'long'
        });
        // log.debug(`\t`, "BUY: ", "BBP_PREV: ", this.history[0], " BBP_NOW: ", BBP)
        this.adviced = true;
        this.advicedPrice = ema20;
    }
    this.history[0] = ema50;
    // }
};

module.exports = strat;