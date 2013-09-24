(function () {


  angular.module('templateList.controllers', [])
    .controller('templateListCtrl', function ($scope, socket) {
      $scope.templates = [];

//      socket.on('')

      $scope.newTemplate = function() {
        socket.emit('newTemplate', function(id){
          $scope.templates.add()
        });
      };

    });
}());