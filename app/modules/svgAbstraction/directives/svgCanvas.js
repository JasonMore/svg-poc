(function() {
  angular.module('svgAbstraction.directives', function() {
    return {
      restrict: 'E',
      templateUrl: 'modules/svgAbstraction/directives/svgCanvas.html',
      replace: true,
      scope: {
        template: '&',
        shapes: '&'
      },
      controller: function($scope){

      }
    }
  });
}());