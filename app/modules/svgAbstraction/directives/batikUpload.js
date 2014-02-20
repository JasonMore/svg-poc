(function () {
  angular.module('svg-poc')
    .directive('batikUpload', function (svgReferenceService) {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/batikUpload.html',
        link: function ($scope, el, attr) {
          $scope.target = $scope.$eval(attr.sameWindow) ? '_self' : '_blank';

          $scope.$on('submitSvgToBatik', function () {
            el.find("textarea").val(svgReferenceService.svg.toSVG());
            el.find('form').submit();
          })
        }
      }
    });
}());