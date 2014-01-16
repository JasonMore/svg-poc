(function() {
  angular.module('svgAbstraction.directives')
    .directive('svgCanvasLeftMenu', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/svgCanvasLeftMenu.html',
        controller: 'svgCanvasLeftMenuCtrl',
        scope: {
          sideMenuOpen: '=isOpen',
          selectedShape: '=',
          template: '='
        }
      };
    })
    .controller('svgCanvasLeftMenuCtrl', function($scope) {
      // Properties
      $scope.leftSubmenu = null;

      // text
      // open/close

      // Actions

      $scope.closeSideMenu = function () {
        if ($scope.leftSubmenu) {
          $scope.leftSubmenu = null;
          return;
        }

        $scope.sideMenuOpen = false;
      };

      // Events

      $scope.$on('unSelectShape',function() {
        $scope.leftSubmenu = null;
      });

      // binding modal windows

      // fonts / colors
      $scope.colorOptions = [
        {id: 'red', name: 'Red'},
        {id: 'yellow', name: 'Yellow'},
        {id: 'green', name: 'Green'},
        {id: 'blue', name: 'Blue'},
        {id: 'white', name: 'White'},
        {id: 'gray', name: 'Gray'},
        {id: 'black', name: 'Black'},
        {id: 'none', name: '-- None -- '}
      ];

      $scope.strokeWidthOptions = [
        {id: 1, name: '1'},
        {id: 2, name: '2'},
        {id: 3, name: '3'},
        {id: 4, name: '4'},
        {id: 5, name: '5'},
        {id: 6, name: '6'},
        {id: 7, name: '7'},
        {id: 8, name: '8'},
        {id: 9, name: '9'},
        {id: 10, name: '10'},
        {id: 11, name: '11'},
        {id: 12, name: '12'},
        {id: 13, name: '13'},
        {id: 14, name: '14'}
      ];

      $scope.fontSizeOptions = [
        {id: '8.0', name: '8'},
        {id: '9.0', name: '9'},
        {id: '10.0', name: '10'},
        {id: '11.0', name: '11'},
        {id: '12.0', name: '12'},
        {id: '13.0', name: '13'},
        {id: '14.0', name: '14'},
        {id: '18.0', name: '18'},
        {id: '24.0', name: '24'},
        {id: '30.0', name: '30'},
        {id: '36.0', name: '36'},
        {id: '48.0', name: '48'},
        {id: '60.0', name: '60'},
        {id: '72.0', name: '72'},
        {id: '96.0', name: '96'}
      ];

      $scope.fontFamilyOptions = [
        {id: 'Arial', name: 'Arial'},
        {id: 'Cambria', name: 'Cambria'},
        {id: 'Consolas', name: 'Consolas'},
        {id: 'Verdana', name: 'Verdana'},
        {id: 'Code39Azalea', name: 'Barcode 39'}
      ];
    });
}());