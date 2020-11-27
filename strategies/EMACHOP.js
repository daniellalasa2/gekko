//Author: Danial Lalasa <daniel.lalasa@gmail.com>
//Standard time period for this strategy is 15min candle
var strat = {};
var log = require('../core/log.js');
strat.init = function() {
    this.name = 'RSICHOP';
    this.takeProfit = 1 + (1.3 / 100);
    this.requiredHistory = this.tradingAdvisor.historySize;
    this.CHOP = null;
    this.addTulipIndicator('rsi', 'rsi', { optInTimePeriod: 14 });
    this.addTulipIndicator('ema5', 'ema', { optInTimePeriod: 5 });
    this.addTulipIndicator('ema50', 'ema', { optInTimePeriod: 50 });
    this.addIndicator('highperiod', 'HIGHPERIOD', { size: 14 });
    this.addIndicator('lowperiod', 'LOWPERIOD', { size: 14 });
    this.addIndicator('lowperiod96', 'LOWPERIOD', { size: 96 });
    this.addIndicator('highperiod96', 'HIGHPERIOD', { size: 96 });
    this.addTulipIndicator('atr1', 'atr', { optInTimePeriod: 1 });
    this.mathSum = function(limit) {
        var sumArr = new Array();

        this.result = NaN;
        this.add = function(input) {
            sumArr.push(input);
            if (sumArr.length > limit - 1) {
                sumArr.shift();
                this.result = sumArr.reduce(function(a, b) {
                    return a + b;
                }, 0);
            }
        }
    };
    this.TPprice = 0;
    this.atr1Sum14 = new this.mathSum(14);
    // this.addTulipIndicator('ema200', 'ema', { optInTimePeriod: 200 });
    this.history = [];
    this.adviced = false;
    this.advicedPrice = 0;
};
strat.log = function(candle) {
    // log.debug('\t', 'ind:', this.tulipIndicators);
};
strat.update = function(candle) {
    this.indicators.highperiod.update(candle.high);
    this.indicators.lowperiod.update(candle.low);
    this.indicators.lowperiod96.update(candle.low);
    this.indicators.highperiod96.update(candle.high);
    var HP = this.indicators.highperiod.result;
    var LP = this.indicators.lowperiod.result;
    var tr = this.tulipIndicators.atr1.result.result;
    this.atr1Sum14.add(tr);
    this.CHOP = 100 * Math.log10(this.atr1Sum14.result / (HP - LP)) / Math.log10(14);
};

strat.check = function(candle) {
    var RSI = this.tulipIndicators.rsi.result.result;
    var AP = this.advicedPrice;
    var CHOP = this.CHOP;
    var ema50 = this.tulipIndicators.ema50.result.result;
    var ema5 = this.tulipIndicators.ema5.result.result;
    var LP14 = this.indicators.lowperiod.result;
    var LP96 = this.indicators.lowperiod96.result;
    var HP96 = this.indicators.highperiod96.result;
    var HP14 = this.indicators.highperiod.result;
    var SP = ema50; // Sell Price
    this.TPprice = 1.01 * this.advicedPrice;
    // log.debug('\t', CHOP);
    // if (CHOP < 45 && RSI > 30 && this.history[0] < 30) {
    //     log.debug("\t", candle);
    // }

    if (this.adviced) {
        // if (candle.close >= this.history[2] * 1.02) {
        //     this.TPprice = this.history[2] * 1.03;
        // }
        if ( //candle.close < SP || candle.low < SP || 
            candle.close >= this.TPprice) {
            this.advice("short");
            this.adviced = false;
            this.advicedPrice = 0;
        }
        // log.debug("\t", SP, candle);
    }
    if (!isNaN(CHOP)) {
        if (!this.adviced &&
            ema50 > this.history[0] &&
            ema50 < ema5 &&
            CHOP < 38.2
        ) {
            this.advice("long");
            this.adviced = true;
            this.advicedPrice = candle.close;
        }
    }
    this.history[0] = ema5;
    // this.history[1] = LP96;
    // this.history[2] = HP96;
};
module.exports = strat;