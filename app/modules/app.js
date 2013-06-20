(function() {
  'use strict';
  angular.module('app', ['main','svgPoc','svgJS', 'svgShell'])
    .config(function ($routeProvider, $injector) {
      $routeProvider
        .otherwise({
          redirectTo: '/'
        });
    });

  // best place for this array extension? not sure
  Array.prototype.remove = function (valueOrPredicate) {
    var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate
      : function (value) { return value === valueOrPredicate; };

    for (var i = 0; i < this.length; i++) {
      var value = this[i];
      if (predicate(value)) {
        this.splice(i, 1);
        i--;
      }
    }
    return this;
  };

}());



