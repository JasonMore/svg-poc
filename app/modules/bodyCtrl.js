angular.module('svg-poc').controller('bodyCtrl', function($scope){
  $scope.blankSpaceClicked = function($event){
    $scope.$broadcast('blankSpaceOnBodyClicked', $event);
  }
});
