(function() {
 var app =  angular.module('svgAbstraction.controllers', []);

  app.controller('svgAbstractionCtrl', function($scope) {
    $scope.width = 500;
    $scope.height = 500;
    $scope.zoom = 1;

    $scope.svgWidth = function() {
      return $scope.width * $scope.zoom;
    }

    $scope.svgHeight = function() {
      return $scope.height * $scope.zoom;
    }

    $scope.openMenu = function(menu){
      var oldVal = $scope[menu];

      $scope.showDrawMenu = false;
      $scope.showSettingsMenu = false;

      if(menu){
        $scope[menu] = !oldVal;
      }
    }

    $scope.showDrawMenu = false;
    $scope.showSettingsMenu = false;

    $scope.icons = [
      {name:"trassh", type:"fa-trash-o"},
      {name:"book", type:"fa-book"},
      {name:"book", type:"fa-book"},
      {name:"trassssh", type:"fa-trash-o"},
      {name:"book", type:"fa-book"},
      {name:"boooook", type:"fa-book"},
      {name:"trash", type:"fa-trash-o"},
      {name:"book", type:"fa-book"},
      {name:"booook", type:"fa-book"},
      {name:"trash", type:"fa-trash-o"},
      {name:"bookkkkk", type:"fa-book"},
      {name:"booooook", type:"fa-book"},
      {name:"trash", type:"fa-trash-o"},
      {name:"book", type:"fa-book"},
      {name:"booooook", type:"fa-book"},
      {name:"trash", type:"fa-trash-o"},
      {name:"book", type:"fa-book"},
      {name:"booooook", type:"fa-book"},
      {name:"trash", type:"fa-trash-o"}
    ]
  });

  app.directive('svgAttrViewbox', function() {
    return function(scope, el, attr) {
      scope.$watch(function() { return attr.svgAttrViewbox; }, function(val){
        el[0].setAttribute('viewBox', val);
      });
    }
  });

}());
