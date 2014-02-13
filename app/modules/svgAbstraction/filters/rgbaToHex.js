(function () {

  var rgbaRegex = /rgba\((\d+),(\d+),(\d+),(\d+|\d+\.\d+)\)/;

  angular.module('svgAbstraction').filter('rgbaToHex', function () {
    return function (value) {
      var rgba = rgbaRegex.exec(value);
      if(!rgba) return value;
      return '#' + rgbToHex(rgba[1], rgba[2], rgba[3]);
    };
  });

  angular.module('svgAbstraction').filter('rgbaToOpacity', function () {
    return function (value) {
      var rgba = rgbaRegex.exec(value);
      if(!rgba) return value;
      return rgba[4];
    };
  });

  function rgbToHex(R,G,B) {return toHex(R)+toHex(G)+toHex(B)}
  function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) return "00";
    n = Math.max(0,Math.min(n,255));
    return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
  }
})();