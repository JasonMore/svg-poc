(function () {
  angular.module('svgShell.controllers', [])
    .controller('svgShellCtrl', function ($scope, surfaceService, textFlowService) {
      window.debugScope = $scope;


      // hack until things get moved around
      surfaceService.$scope = $scope;


      $scope.isDrawing = true;
      $scope.$watch('isDrawing', function (val) {
        surfaceService.clearSelection();
      });

      $scope.textValue = '';

      $scope.$watch('textValue', _.debounce(function(val){
        if(!val) {
          return;
        }

        var text = $($scope.shape).find('.text')[0];
        var container = $($scope.shape).find('.shape')[0];

        text.firstChild.nodeValue = val;
        textFlowService.recalcText(text, container);
      }, 250));
    })
  ;

})();