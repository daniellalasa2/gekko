var chai = require('chai');
var expect = chai.expect;

var _ = require('lodash');

var util = require('../../core/util');
var dirs = util.dirs();
var INDICATOR_PATH = dirs.indicators;

// Fake input prices to verify all indicators
// are working correctly by comparing fresh
// calculated results to pre calculated results.

// The precalculated results are already compared
// to MS Excel results, more info here:
//
// https://github.com/askmike/gekko/issues/161

var prices = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  6,
  5,
  4,
  3,
  5,
  4,
  9,
  8,
  5,
  4,
  6,
  7,
  5,
  4,
  2,
  1,
  2,
  1,
  0,
  1,
  2,
  3,
  5,
  2,
  6,
  4,
  4,
  5,
  6,
  9,
  8,
  5,
  6,
  9,
  10,
  23,
  2,
  1,
  0,
  1,
  1,
  1,
  2,
  4,
  6,
  2,
  0,
  1,
  0,
  1,
  10,
  9,
  22,
];

describe('indicators/HIGHPRIOD', function() {
  var HIGHPERIOD = require(INDICATOR_PATH + 'HIGHPERIOD');

  var verified_HP_10 = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    7,
    7,
    7,
    7,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    8,
    7,
    7,
    7,
    7,
    5,
    5,
    5,
    6,
    6,
    6,
    6,
    6,
    9,
    9,
    9,
    9,
    9,
    10,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    6,
    6,
    6,
    6,
    6,
    10,
    10,
    22,
  ];
  var verified_HP_20 = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    8,
    7,
    7,
    9,
    9,
    9,
    9,
    9,
    10,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
  ];
  var verified_HP_60 = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    23,
  ];
  it('should correctly calculate Highest price of 10 candles', function() {
    let hp = new HIGHPERIOD({ size: 10 });
    _.each(prices, function(p, i) {
      hp.update(p);
      expect(hp.result).to.equal(verified_HP_10[i]);
    });
  });
  it('should correctly calculate Highest price of 20 candles', function() {
    let hp = new HIGHPERIOD({ size: 20 });
    _.each(prices, function(p, i) {
      hp.update(p);
      expect(hp.result).to.equal(verified_HP_20[i]);
    });
  });
  it('should correctly calculate Highest price of 60 candles', function() {
    let hp = new HIGHPERIOD({ size: 60 });
    _.each(prices, function(p, i) {
      hp.update(p);
      expect(hp.result).to.equal(verified_HP_60[i]);
    });
  });
});
