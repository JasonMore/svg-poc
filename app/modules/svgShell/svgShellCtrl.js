(function () {
  angular.module('svgShell.controllers', [])
    .controller('svgShellCtrl', function ($scope, $timeout, surfaceService, drawService, selectionService, textFlowService, resizeService) {
      window.debugScope = $scope;


      // properties
      $scope.isDrawing = true;
      $scope.isEditingText = false;
      $scope.textValue = '';
      $scope.shape;

      $scope.selectedShape = 'rect';
      $scope.shapeOptions = [
        {id: 'rect', name: 'Rectangle'},
        {id: 'circle', name: 'Circle'}
//        {id: 'ellipse', name: 'Ellipse'},
//        {id: 'line', name: 'Line'},
//        {id: 'polyline', name: 'Polyline'},
//        {id: 'polygon', name: 'Polygon'}
      ];

      $scope.selectedFill = 'gray';
      $scope.selectedStrokeColor = 'black';

      $scope.colorOptions = [
        {id: 'red', name: 'Red'},
        {id: 'yellow', name: 'Yellow'},
        {id: 'green', name: 'Green'},
        {id: 'blue', name: 'Blue'},
        {id: 'white', name: 'White'},
        {id: 'gray', name: 'Gray'},
        {id: 'black', name: 'Black'},
        {id: 'none', name: '-- None -- '}
      ];

      $scope.selectedStrokeWidth = 3;
      $scope.strokeWidthOptions = [
        {id: 1, name: '1'},
        {id: 2, name: '2'},
        {id: 3, name: '3'},
        {id: 4, name: '4'},
        {id: 5, name: '5'},
        {id: 6, name: '6'},
        {id: 7, name: '7'},
        {id: 8, name: '8'},
        {id: 9, name: '9'},
        {id: 10, name: '10'}
      ];

      // watches
      $scope.$watch('isDrawing', function (val) {
        //selectionService.clearSelection();
      });

      $scope.$watch('isEditingText', function(newVal, oldVal){
        // need to wait for the textarea to go away before
        // calculating the new textflow
        $timeout(function() {
          if(newVal) {
            selectionService.hideSelectionBox();
          } else {
            textFlowService.updateTextFlowForCurrentShape($scope.textValue);
            selectionService.showSelectionBox();
          }
        });
      });

      $scope.$watch('shape', function(newVal, oldVal){
        if(!newVal || newVal === oldVal){
          return;
        }

        var textElement = $($scope.shape).find('.text')[0];
        $scope.textValue = textElement.firstChild.nodeValue;
      });

      $scope.$watch('selectedShape + selectedFill + selectedStrokeColor + selectedStrokeWidth', function() {
        drawService.drawSettings = {
          shape: $scope.selectedShape,
          fill: $scope.selectedFill,
          stroke: $scope.selectedStrokeColor,
          strokeWidth: $scope.selectedStrokeWidth
        };

        if($scope.shape){
          drawService.updateShape($scope.shape);
        }
      });

      // provide surfaceService some scope information
      surfaceService.setShapeToEdit = function(shape){
        safeApply(function() {
          $scope.isDrawing = false;
          $scope.shape = shape;
        });
      };

      selectionService.resetSelectedShape = function() {
        safeApply(function () {
          $scope.shape = null;
          $scope.isEditingText = false;
        });
      };

      drawService.isDrawing = function() {
        return $scope.isDrawing;
      };

      textFlowService.currentShape = function() {
        return $scope.shape;
      };

      resizeService.resizeStarted = function() {
        selectionService.hideSelectionBox();
        $($scope.shape).find('.text').hide();
      };

      resizeService.resizeEnded = function() {
        $($scope.shape).find('.text').show();
        textFlowService.updateTextFlowForCurrentShape();
        selectionService.showSelectionBox();
      };

      // hack while service and controller are still tightly coupled.
      function safeApply(fn) {
        ($scope.$$phase || $scope.$root.$$phase) ? fn() : $scope.$apply(fn);
      }
    });
})();