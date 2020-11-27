//Author: Danial Lalasa <daniel.lalasa@gmail.com>
//Standard time period for this strategy is 15min candle
var strat = {};
var log = require('../core/log.js');
strat.init = function () {
  this.name = 'cus_EMASTOCH_scalp';
  this.takeProfit = 1 + 0.5 / 100;
  this.stopLoss = 1 - 3 / 100;
  this.requiredHistory = this.tradingAdvisor.historySize;
  this.candleSize = this.tradingAdvisor.candleSize;
  this.addTulipIndicator('ema100', 'ema', { optInTimePeriod: 100 });
  this.addTulipIndicator('ema50', 'ema', { optInTimePeriod: 50 });
  this.addTulipIndicator('stoch', 'stoch', {
    optInFastKPeriod: 5,
    optInSlowKPeriod: 3,
    optInSlowDPeriod: 3,
  });
  this.history = { prevStochK: null };
  this.adviced = false;
  this.advicedPrice = 0;
  this.profitCount = 0;
  this.lossCount = 0;
  this.barCount = 0;
  this.averageHoldingBar = [];
  this.tradeCount = 0;
  this.lossSum = 0;
  this.EMAcross = false;
};
strat.check = function (candle) {
  const EMA50 = this.tulipIndicators.ema50.result.result;
  const EMA100 = this.tulipIndicators.ema100.result.result;
  const STOCH = this.tulipIndicators.stoch.result;
  const { stochK } = STOCH;
  const { prevStochK } = this.history;
  if (this.adviced) {
    this.barCount++;
    // Take profit
    if (
      candle.close >= this.advicedPrice * this.takeProfit ||
      candle.high >= this.advicedPrice * this.takeProfit
    ) {
      log.debug(
        `\n\t ${candle.start}`,
        `SELL AT ${this.advicedPrice * this.takeProfit}`
      );
      //   this.advice('short');
      this.adviced = false;
      this.EMAcross = false;
      this.advicedPrice = 0;
      this.averageHoldingBar.push(this.barCount);
      // reset values
      this.barCount = 0;
      this.profitCount++;
    }
    // Stoploss
    // else if (candle.close <= this.advicedPrice * this.stopLoss) {
    // else if (
    //   candle.close < candle.open &&
    //   candle.close < this.advicedPrice * this.stopLoss
    // ) {
    //   //   this.advice('short');
    //   const _loss = -parseInt((1 - candle.close / this.advicedPrice) * 100);
    //   this.lossSum += _loss;
    //   log.debug(`\n\t ${candle.start}`, `!!!!!!! LOSS ${_loss}%`);
    //   this.adviced = false;
    //   this.advicedPrice = 0;

    //   this.averageHoldingBar.push(this.barCount);
    //   // reset values
    //   this.barCount = 0;
    //   this.lossCount++;
    // }
  }

  if (!this.adviced && EMA50 && EMA100 && stochK && prevStochK) {
    if (EMA50 > EMA100 && this.history.prevEMA100 >= this.history.prevEMA50) {
      this.EMAcross = true;
    }
    if (this.EMAcross && EMA50 > EMA100 && stochK > 20 && prevStochK < 20) {
      //   this.advice('long');
      this.adviced = true;
      this.advicedPrice = candle.close;
      this.tradeCount++;
      log.debug(`\n\t ${candle.start}`, `BUY AT ${this.advicedPrice}`);
    }
  }
  this.history['prevStochK'] = stochK;
  this.history['prevEMA100'] = EMA100;
  this.history['prevEMA50'] = EMA50;
};
strat.end = function () {
  console.log('AVG HOLD TIME: ', this.averageHoldingBar);
  this.averageHoldingBar = this.averageHoldingBar.reduce(
    (acc, curr) => acc + curr
  );
  log.debug('\n\n\n');
  log.debug(
    '\t',
    `Number of LOSS with ${this.stopLoss}% StopLoss: ${this.lossCount}`
  );
  log.debug(
    '\t',
    `Number of PROFIT with ${this.takeProfit}% Take Profit: ${this.profitCount}`
  );
  log.debug(
    '\t',
    `Average holding bar ${Math.round(this.averageHoldingBar / this.tradeCount)}
     candle size: ${this.candleSize}`
  );
  log.debug(
    '\t',
    `Average holding time ${
      (Math.round(this.averageHoldingBar / this.tradeCount) * this.candleSize) /
      60
    } hour(s)`
  );
  log.debug('\t', `Loss sum: ${this.lossSum}`);
  log.debug('\t', `Trade count: ${this.tradeCount}`);
};
module.exports = strat;
