(function() {
  angular.module('main.directives')
    .directive('editableGroupButton', function () {
      return {
        restrict:'EA',
        templateUrl:'modules/main/directives/editableGroupButton.html',
        link: function ($scope) {
          $scope.editing = false;

          $scope.editAll = function () {
            $scope.editing = true;
            $scope.$broadcast('startEditMode');
          };

          $scope.doneEditing = function () {
            $scope.editing = false;
            $scope.$broadcast('endEditMode');
          };
        }
      }
    });
}());