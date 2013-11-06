(function () {
  // wrap jquery svg draw methods which produce errors with angular
  angular.module('svgAbstraction.directives')
    .directive('ngSvgShape', function ($compile, $timeout, pathService) {
      return {
        require: '^ngSvg',
        link: function ($scope, element, attr, ngSvgController) {
          var ngSvg = ngSvgController;

          $timeout(function () {
            $scope.viewModel.svg = ngSvg.svg;
            $scope.viewModel.svgElementShapeGroup = element.find('g.shape')[0];
            $scope.viewModel.svgElementParentGroup = element[0];
            $scope.viewModel.svgText = element.find('text')[0];
            $scope.viewModel.svgElementPath = angular.element(ngSvg.svg._svg)
              .find('#' + $scope.viewModel.id())[0];
          })

          $scope.$watch('viewModel.model.image.url', function (url, oldVal) {
            if (url === oldVal) {
              return;
            }

            calculateImageHeightWidth($scope);
          });
        }
      };

      function calculateImageHeightWidth($scope) {
        // if drawing image, calculate path
        if (!$scope.viewModel.model.image.url) {
          return;
        }

        var width,
          height,
          img = new Image();

        img.onload = function () {
          width = this.width;
          height = this.height;

          $scope.$apply(function () {
            $scope.viewModel.model.image.width = width;
            $scope.viewModel.model.image.height = height;
          });
        };

        img.src = $scope.viewModel.model.image.url;
      }

    });
})();