(function () {
  var menuAimModule = angular.module('menuAim', []);

  menuAimModule.controller('menuAimCtrl', function($scope){
    var rows = [];

    $scope.$on('newRow', function(e,row){
      rows.push(row);
    });

    this.closeAllRows = function() {
      angular.forEach(rows, function(row){
        row.isShown = false;
      });
    }
  });

  menuAimModule.directive('menuAim', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      template: '<ul ng-transclude></ul>',
      controller: 'menuAimCtrl',
      link: function($scope, $element, $attr, menuAimCtrl) {
        $element.menuAim({
          activate: activateSubmenu,
          deactivate: deactivateSubmenu,
          exitMenu: exitMenu
        });

        function activateSubmenu(row){
          var rowScope = angular.element(row).find('.contentAim').scope();

          rowScope.$apply(function() {
            rowScope.isShown = true;
            rowScope.height = $element.outerHeight() -3;
            rowScope.width = $element.outerWidth() - 3;
          });
        }

        function deactivateSubmenu(row) {
          var rowScope = angular.element(row).find('.contentAim').scope();
          rowScope.$apply(function() {
            rowScope.isShown = false;
          });
        }

        function exitMenu(){
          $scope.$apply(function() {
            menuAimCtrl.closeAllRows();
          });
        }
      }
    };
  });

  menuAimModule.directive('submenuAim', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      require: '^menuAim',
      template: '<li ng-transclude></li>'
    };
  });

  menuAimModule.directive('titleAim', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      require: '^submenuAim',
      template: '<a ng-href="" ng-transclude></a>'
    };
  });

  menuAimModule.directive('contentAim', function() {
    return {
      restrict: 'E',
      replace: true,
      transclude: true,
      require: '^submenuAim',
      template: ''+
        '<div class="contentAim" style="top: -1px; min-height: 250px;"' +
        'ng-style="{height: height, display: displayComputed(isShown), left: width}"' +
        'ng-transclude></div>',
      controller: function($scope){
        $scope.$emit('newRow', $scope);

        $scope.displayComputed = function(isShown){
          return isShown ? "block" : "hidden";
        };
      }
    };
  });
})();