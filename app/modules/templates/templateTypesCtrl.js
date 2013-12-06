(function () {
  angular.module('templates.controllers')
    .controller('templateTypesCtrl', function ($scope, liveResource, $modal) {

      var liveTemplateTypes = liveResource('templateTypes');
      var templateTypesQuery = liveTemplateTypes.query({});
      $scope.templateTypes = liveTemplateTypes.subscribe(templateTypesQuery);

      $scope.orderByDate = function(templateType){
        console.log(templateType);
      };


      $scope.addOrEdit = function (templateType) {
        var modalInstance = $modal.open({
          templateUrl: 'modules/templates/templateTypeModal.html',
          controller: function($scope, $modalInstance) {
            $scope.isNew = templateType ? false : true;
            $scope.templateType = templateType || {};

            $scope.save = function () {
              $modalInstance.close($scope.templateType);
            };

            $scope.cancel = function (isNew) {
              $modalInstance.dismiss('cancel');
            };
          }
        });

        modalInstance.result.then(function (templateType) {
          if(!templateType.id){
            templateType.created = new Date();
            liveTemplateTypes.add(templateType);
          }
        });

//        templateTypesLive.add({ name: $scope.newName });
      };

      $scope.delete = function (templateType) {
        var modalInstance = $modal.open({
          templateUrl: 'modules/templates/templateTypeDeleteModal.html',
          controller: function($scope, $modalInstance) {
            $scope.templateType = templateType;

            $scope.ok = function () {
              $modalInstance.close(true);
            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }
        });

        modalInstance.result.then(function () {
          liveTemplateTypes.delete(templateType);
        });
      };

    });
}());