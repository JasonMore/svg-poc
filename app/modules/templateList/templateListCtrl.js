(function () {


  angular.module('templateList.controllers', [])
    .controller('templateListCtrl', function ($scope, liveResource, $modal) {

      var templateTypesLive = liveResource('templateTypes');
      var allTemplateTypesQuery = templateTypesLive.query({});
      $scope.templates = templateTypesLive.subscribe(allTemplateTypesQuery);

      $scope.add = function () {
//        templateTypesLive.add({ name: $scope.newName });
      };

      $scope.delete = function (template) {

//
//        var modalInstance = $modal.open({
//          templateUrl: 'modules/templateList/deleteModal.html',
//          controller: function($scope, $modalInstance) {
//            $scope.template = template;
//
//            $scope.ok = function() {
//              $modalInstance.close(true);
//            }
//
//            $scope.cancel = function () {
//              $modalInstance.dismiss('cancel');
//            };
//          }
//        });
//
//        modalInstance.result.then(function () {
//          templateTypesLive.delete(template);
//        });
      };

    });
}());