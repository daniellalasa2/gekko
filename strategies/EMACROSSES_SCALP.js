//Author: Danial Lalasa <daniel.lalasa@gmail.com>
//Standard time period for this strategy is 15min candle
var strat = {};
var log = require('../core/log.js');
strat.init = function () {
  this.name = 'EMACOSSES_SCALP';
  this.takeProfit = 1 + 0.5 / 100;
  this.requiredHistory = this.tradingAdvisor.historySize;
  // this.CHOP = null;
  // this.addTulipIndicator('rsi', 'rsi', { optInTimePeriod: 14 });
  this.addTulipIndicator('sma50', 'sma', { optInTimePeriod: 50 });
  this.addTulipIndicator('sma20', 'sma', { optInTimePeriod: 20 });
  this.addTulipIndicator('ema100', 'ema', { optInTimePeriod: 100 });
  // this.addIndicator('highperiod', 'HIGHPERIOD', { size: 14 });
  // this.addIndicator('lowperiod', 'LOWPERIOD', { size: 14 });
  // this.addIndicator('lowperiod30', 'LOWPERIOD', { size: 30 });
  // this.addIndicator('highperiod96', 'HIGHPERIOD', { size: 96 });

  this.TPprice = 0;
  this.SL = 0;
  this.barCount = 0;
  // this.addTulipIndicator('ema200', 'ema', { optInTimePeriod: 200 });
  this.history = [];
  this.adviced = false;
  this.advicedPrice = 0;
};
strat.log = function (candle) {
  // log.debug('\t', 'ind:', this.tulipIndicators);
};
strat.update = function (candle) {
  // this.indicators.highperiod.update(candle.high);
  // this.indicators.lowperiod.update(candle.low);
  // this.indicators.lowperiod30.update(candle.low);
  // this.indicators.highperiod96.update(candle.high);
  // var HP = this.indicators.highperiod.result;
  // var LP = this.indicators.lowperiod.result;
  // var tr = this.tulipIndicators.atr1.result.result;
  // this.atr1Sum14.add(tr);
  // this.CHOP = 100 * Math.log10(this.atr1Sum14.result / (HP - LP)) / Math.log10(14);
};

strat.check = function (candle) {
  // var RSI = this.tulipIndicators.rsi.result.result;
  var AP = this.advicedPrice;
  var SMA20 = this.tulipIndicators.sma20.result.result;
  var SMA50 = this.tulipIndicators.sma50.result.result;
  var EMA100 = this.tulipIndicators.em100.result.result;
  // var CHOP = this.CHOP;
  // var LP14 = this.indicators.lowperiod.result;
  // var LP30 = this.indicators.lowperiod30.result;
  // var HP96 = this.indicators.highperiod96.result;
  // var HP14 = this.indicators.highperiod.result;
  // var SP = this.history[3]; // Sell Price
  // log.debug('\t', CHOP);
  // if (CHOP < 45 && RSI > 30 && this.history[0] < 30) {
  //     log.debug("\t", candle);
  // }
  if (this.adviced) {
    // if (candle.close >= this.history[2] * 1.02) {
    //     this.TPprice = this.history[2] * 1.03;
    // }
    // this.barCount++;
    if (
      //candle.close < this.SL ||
      // candle.close < this.advicedPrice * 0.97 &&
      // EMA5 < EMA50 * 0.98 ||
      candle.close < this.SL ||
      candle.close >= this.TPprice ||
      candle.high >= this.TPprice
      //|| this.barCount === 40
    ) {
      // if ( //this.barCount === 40
      //     candle.close < EMA50 * 0.95
      // ) {
      //     console.log("\t", "STOP LOSS!");
      //     console.log(Math.round(100 * ((candle.close / this.advicedPrice) - 1)));
      // }
      this.advice('short');
      this.adviced = false;
      this.advicedPrice = 0;
      this.barCount = 0;
    }
    // log.debug("\t", SP, candle);
  }
  if (SMA50 && SMA20 && EMA100) {
    if (
      !this.adviced &&
      //candle.close > this.history[1] &&
      // CHOP < 45 &&
      SMA20 > SMA50 &&
      SMA50 > SMA100 &&
      // RSI > 40 &&
      this.history[0] < 40 &&
      RSI - this.history[0] >= 10
      //&& candle.close > LP30
    ) {
      this.TPprice = candle.close;
      this.advice('long');
      this.barCount = 0;
      this.adviced = true;
      this.advicedPrice = candle.close;
      this.SL = LP30;
    }
  }
  this.history[0] = RSI;
  this.history[1] = EMA5;
  this.history[2] = EMA50;
  // this.history[2] = LP30;
};
module.exports = strat;
