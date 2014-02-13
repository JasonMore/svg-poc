(function () {
  angular.module('svgAbstraction')
    .directive('batikUpload', function (svgReferenceService) {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/batikUpload.html',
        link: function ($scope, el, attr) {
          $scope.$on('submitSvgToBatik', function () {
            el.find("textarea").val(svgReferenceService.svg.toSVG());
            el.find('form').submit();
          })
        }
      }
    });
}());