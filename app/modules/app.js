(function() {
  'use strict';
  angular.module('app', ['main','svgPoc','svgJS', 'svgShell'])
    .config(function ($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'modules/main/views/main.html',
          controller: 'mainCtrl'
        })
        .when('/svgPoc', {
          templateUrl: 'modules/svgPoc/views/main.html',
          controller: 'svgCtrl'
        })
        .when('/svgJS', {
          templateUrl: 'modules/svgJS/views/main.html',
          controller: 'svgJSCtrl'
        })
        .when('/svgShell', {
          templateUrl: 'modules/svgShell/views/main.html',
          controller: 'svgShellCtrl'
        })
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



