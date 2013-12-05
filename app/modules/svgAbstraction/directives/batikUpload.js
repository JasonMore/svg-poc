(function () {
  angular.module('svgAbstraction.directives')
    .directive('batikUpload', function (svgReferenceService) {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/batikUpload.html',
        link: function ($scope, element, attr) {
          $scope.$on('submitSvgToBatik', function () {
            el.find("textarea").val(svgReferenceService.svg.toSVG());
            el.submit();
          })
        }
      }
    });
}());