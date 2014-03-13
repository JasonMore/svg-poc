(function() {

  /*
    Rounds a number to a specific number of decimal places
   */
  Object.defineProperty(Math, 'roundPrecision', {
    value: function(value, points) {
      if (!points) {
        return Math.round(value);
      }
      var precision = Math.pow(10, points);
      return Math.round(value * precision) / precision;
    }
  });

}());