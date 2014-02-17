(function () {
  angular.module('svg-poc')
    .directive('editableField', function($compile, $templateCache, $http) {
    var templateUrl = 'modules/main/directives/editableField.html';
    return {
      restrict:'EA',
      scope: true,
      link: function($scope, el, attr){
        $scope.edit = false;
        var modelName = attr.editableField || attr.model;
        modelName = '$parent.' + modelName;

        $http.get(templateUrl, {cache:true}).success(function(result){
          var template = angular.element(result);
          template.filter('span.editable-field-readonly').attr('ng-bind', modelName);
          template.find('input.editable-field-value').attr('ng-model', modelName);

          $compile(template)($scope);

          el.append(template);
        });

        $scope.$on('startEditMode', function(){
          $scope.edit = true;
        });

        $scope.$on('endEditMode', function(){
          $scope.edit = false;
        });
      }
    }
  });
}());

