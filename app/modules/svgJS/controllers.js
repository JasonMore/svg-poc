(function () {
  'use strict';

  angular.module('svgJS.controllers', [])
    .controller('svgJSCtrl', function ($scope) {
      $scope.shapes = [
        {type: 'rect', canDrag: true, width: 100, height: 100},
        //{type: 'circle', radius: 50},
        {type: 'path', canDrag: false, define: 'M 100 350 L 250 50 M 250 50 L 400 350 M 175 200 L 325 200 M 100 350 Q 250 50 400 350'}
      ];


      $scope.change = function( ){
//        $scope.shapes[0].width = 200;
//        $scope.shapes[1].define = 'M 50 175 L 125 25 M 125 25 L 200 175 M 90 100 L 150 100 M 50 175 Q 125 25 200 175';
//        $scope.shapes.splice(0,1);
      }

      window.debugScope = $scope;
    })
  ;

}());