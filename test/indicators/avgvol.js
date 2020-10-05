var chai = require('chai');
var expect = chai.expect;
var should = chai.should;
var sinon = require('sinon');

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

var volumes = [
  120010,
  88978,
  54867,
  521,
  52154,
  64525455,
  54562,
  4561,
  1120.212,
  5526.2201,
  1255540.33200012,
  78978.1211,
  152.23,
  1255546.2,
  1255545,
  9988995,
  125,
  45615,
  545615,
  456897,
  7894185,
  156564,
  4897,
  120,
  220,
  7894185,
  156564,
  4897,
  120,
  220,
];

describe('indicators/AVGVOL', function() {
  var AVGVOL = require(INDICATOR_PATH + 'AVGVOL');

  var verified_AVGVOL_10 = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    6490775.44321,
    6604328.476410012,
    6603328.488520012,
    6597857.011520011,
    6723359.531520012,
    6843698.631520012,
    1390052.631520012,
    1384608.931520012,
    1388714.331520012,
    1443163.8103200118,
    1488300.888310012,
    2152165.35511,
    2159923.943,
    2160398.42,
    2034855.8,
    1909323.3,
    1699842.3,
    1715486.2,
    1711414.4,
    1656864.9,
    1611197.2,
  ];
  var verified_AVGVOL_30 = [
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
    3196757.843840004,
  ];
  it('should correctly calculate average volume of 10 candles', function() {
    let AV = new AVGVOL({ size: 10 });
    debugger;
    _.each(volumes, function(v, i) {
      AV.update(v);
      expect(AV.result).to.equal(verified_AVGVOL_10[i]);
    });
  });
  it('should correctly calculate average volume of 30 candles', function() {
    let AV = new AVGVOL({ size: 30 });
    _.each(volumes, function(v, i) {
      AV.update(v);
      expect(AV.result).to.equal(verified_AVGVOL_30[i]);
    });
  });
});
