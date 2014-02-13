(function() {
  angular.module('templates')
    .controller('templatesCtrl', function($scope, $stateParams, liveResource, $modal) {

      // load data
      var templateKey = 'templateTypes.' + $stateParams.id;
      var liveTemplateType = liveResource(templateKey);
      $scope.templateType = liveTemplateType.subscribe();

      var liveTemplates = liveResource('templates');
      var templatesQuery = liveTemplates.query({templateType: $stateParams.id});
      $scope.templates = liveTemplates.subscribe(templatesQuery);

      // actions
      $scope.addOrEdit = function (template) {
        var modalInstance = $modal.open({
          templateUrl: 'modules/templates/templateModal.html',
          controller: function($scope, $modalInstance) {
            $scope.isNew = template ? false : true;
            $scope.template = template || {};

            $scope.save = function () {
              $modalInstance.close($scope.template);
            };

            $scope.cancel = function (isNew) {
              $modalInstance.dismiss('cancel');
            };
          }
        });

        modalInstance.result.then(function (template) {
          if(!template.id){
            template.templateType = $scope.templateType.id;
            template.created = new Date();
            liveTemplates.add(template);
          }
        });
      };

      $scope.delete = function (template) {
        var modalInstance = $modal.open({
          templateUrl: 'modules/templates/templateDeleteModal.html',
          controller: function($scope, $modalInstance) {
            $scope.template = template;

            $scope.ok = function () {
              $modalInstance.close(true);
            };

            $scope.cancel = function () {
              $modalInstance.dismiss('cancel');
            };
          }
        });

        modalInstance.result.then(function () {
          liveTemplates.del(template);
        });
      };
    });
}());