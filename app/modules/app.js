(function () {
  'use strict';
  var using = [
    'main',
    'svgShell',
    'svgAbstraction',
    'templateList',
    'testData'
  ];

  angular.module('app', using)
    .config(function ($routeProvider) {
      $routeProvider
        .otherwise({
          redirectTo: '/'
        });
    });

  // best place for extensions? not sure

  Array.prototype.remove = function (valueOrPredicate) {
    var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate
      : function (value) {
      return value === valueOrPredicate;
    };

    for (var i = 0; i < this.length; i++) {
      var value = this[i];
      if (predicate(value)) {
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

  // Decimal round
  Math.roundPrecision = function (value, points) {
    if(!points){
      return Math.round(value);
    }
    var precision = Math.pow(10, points);
    return Math.round(value * precision) / precision;
  };


}());



