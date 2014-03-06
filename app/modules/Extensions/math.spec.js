describe('math round spec', function() {
  var value;
  beforeEach(function() {
    value = 1234.56789;
  });
  it('rounds to 0 when no precision set', function() {
    expect(Math.roundPrecision(value)).toEqual(1235);
  });
  it('rounds to 1 spot', function () {
    expect(Math.roundPrecision(value, 1)).toEqual(1234.6);
  });
  it('rounds to 2 spots', function () {
    expect(Math.roundPrecision(value, 2)).toEqual(1234.57);
  });
  it('rounds to 12 spots', function () {
    expect(Math.roundPrecision(value, 12)).toEqual(1234.56789);
  });
});