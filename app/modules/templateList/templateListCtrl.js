(function () {


  angular.module('templateList.controllers', [])
    .controller('templateListCtrl', function ($scope, liveResource, $modal) {

      var templatesLive = liveResource('templates');
      var allTemplatesQuery = templatesLive.query({});
      $scope.templates = templatesLive.subscribe(allTemplatesQuery);

      $scope.add = function () {
        templatesLive.add({ name: $scope.newName });
      };

      $scope.delete = function (template) {


        var modalInstance = $modal.open({
          templateUrl: 'modules/templateList/deleteModal.html',
          controller: function($scope, $modalInstance) {
            $scope.template = template;

            $scope.ok = function() {
              $modalInstance.close(true);
            }

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }
        });

        modalInstance.result.then(function () {
          templatesLive.delete(template);
        });

      };

    });
}());