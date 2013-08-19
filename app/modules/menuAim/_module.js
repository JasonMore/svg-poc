(function () {
  var menuAimModule = angular.module('menuAim', []);

  menuAimModule.directive('menuAim', function () {
    var height, width;

    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<ul ng-transclude></ul>',
      link: function ($scope, $element) {
        $element.menuAim({
          activate: activateSubmenu,
          deactivate: deactivateSubmenu
        });


        function activateSubmenu(row) {
          var rowScope = angular.element(row).find('.contentAim').scope();

          rowScope.$apply(function () {
            rowScope.isShown = true;
            rowScope.height = $element.outerHeight() - 3;
            rowScope.width = $element.outerWidth() - 3;
          });
        }

        function deactivateSubmenu(row) {
          var rowScope = angular.element(row).find('.contentAim').scope();
          rowScope.$apply(function () {
            rowScope.isShown = false;
          });
        }
      }
    };
  });

  menuAimModule.directive('submenuAim', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      require: '^menuAim',
      template: '<li ng-transclude></li>'
    };
  });

  menuAimModule.directive('titleAim', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      require: '^submenuAim',
      template: '<a ng-href="" ng-transclude></a>'
    };
  });

  menuAimModule.directive('contentAim', function () {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      require: '^submenuAim',
      template: '' +
        '<div class="contentAim" style="top: -1px; min-height: 300px;"' +
        'ng-style="{height: height, display: displayComputed(isShown), left: width}"' +
        'ng-transclude></div>',
      controller: function ($scope) {
        $scope.displayComputed = function (isShown) {
          return isShown ? "block" : "hidden";
        }
      }
    };
  });
})();