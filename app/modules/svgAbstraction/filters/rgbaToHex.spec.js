describe('rgbaToHex.js >', function() {
  var rgbaToHex, rgbaToOpacity;

  beforeEach(module('svg-poc'));
  beforeEach(inject(function(_rgbaToHexFilter_, _rgbaToOpacityFilter_){
    rgbaToHex = _rgbaToHexFilter_;
    rgbaToOpacity = _rgbaToOpacityFilter_;
  }));

  it('converts rga red to hex', function() {
    expect(rgbaToHex("rgba(255,0,0,1)")).toEqual('#FF0000');
  });

  it('converts green red to hex', function() {
    expect(rgbaToHex("rgba(0,255,0,1)")).toEqual('#00FF00');
  });

  it('converts blue red to hex', function() {
    expect(rgbaToHex("rgba(0,0,255,1)")).toEqual('#0000FF');
  });

  it('converts purple to hex', function() {
    expect(rgbaToHex('rgba(218,112,214,1)')).toEqual('#DA70D6');
  })

  it('gets opacity 1', function() {
    expect(rgbaToOpacity("rgba(255,0,0,1)")).toEqual('1');
  });

  it('gets opacity 0.75', function() {
    expect(rgbaToOpacity("rgba(255,0,0,0.75)")).toEqual('0.75');
  });

  it('gets opacity 0', function() {
    expect(rgbaToOpacity("rgba(255,0,0,0)")).toEqual('0');
  });

  it('ignores non rgba values hex', function() {
    expect(rgbaToHex("black")).toEqual('black');
  });

  it('ignores non rgba values opacity', function() {
    expect(rgbaToOpacity("black")).toEqual('black');
  });
});
