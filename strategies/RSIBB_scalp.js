//Author: Danial Lalasa <daniel.lalasa@gmail.com>
//Standard time period for this strategy is 15min candle
var strat = {};
var log = require('../core/log.js');
strat.init = function() {
    this.name = 'RSIBB_scalp';
    this.takeProfit = 0.5 / 100;
    this.requiredHistory = this.tradingAdvisor.historySize;
    // this.addTulipIndicator('ema100', 'ema', { optInTimePeriod: 100 });
    this.addTulipIndicator('ema50', 'ema', { optInTimePeriod: 50 });
    this.addTulipIndicator('ema20', 'ema', { optInTimePeriod: 20 });
    // this.addTulipIndicator('ema200', 'ema', { optInTimePeriod: 200 });
    this.addTulipIndicator('bbands', 'bbands', {
        optInTimePeriod: 20,
        optInNbStdDevs: 2
    });
    this.addTulipIndicator('rsi', 'rsi', {
        optInTimePeriod: 20
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
    // var ema5 = this.tulipIndicators.ema5.result.result;
    var BB = this.tulipIndicators.bbands.result;
    var BBP = ((candle.close - BB.bbandsLower) / (BB.bbandsUpper - BB.bbandsLower)) * 100;
    var RSI = this.tulipIndicators.rsi.result.result;
    var TP = 1 + this.takeProfit;
    var AP = this.advicedPrice;
    // log.debug('\t', RSI);
    if (this.adviced &&
        (candle.close >= AP * TP || candle.open >= AP * TP || candle.high >= AP * TP || candle.low >= AP * TP)
    ) {
        this.advice("short");
        this.adviced = false;
        this.advicedPrice = 0;
    }
    // if (BB.bbandsLower && BB.bbandsUpper) {
    if (!this.adviced &&
        // RSI <= 35 &&
        this.history[0] < 0 &&
        BBP > 0
    ) {
        this.advice("long");
        // log.debug(`\t`, "BUY: ", "BBP_PREV: ", this.history[0], " BBP_NOW: ", BBP)
        this.adviced = true;
        this.advicedPrice = candle.close;
    }
    this.history[0] = BBP;
    this.history[1] = ema20;
    // this.history[0] = ema50;
    // }
};

module.exports = strat