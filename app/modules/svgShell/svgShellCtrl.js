(function () {
  angular.module('svgShell.controllers', [])
    .controller('svgShellCtrl', function ($scope, $timeout, surfaceService, drawService, selectionService, textFlowService, resizeService) {
      window.debugScope = $scope;


      // properties
      $scope.isDrawing = true;
      $scope.isEditingText = false;
      $scope.textValue = '';
      $scope.isEditingShape = false;
      $scope.shapeToEdit;
      $scope.dynamicTooltip = 'abc123';

      $scope.shapeToDraw = 'rect';
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
      $scope.$watch('isEditingText', function(newVal, oldVal){
        // setTimeout needed so we don't recalculate the textflow until
        // the text area has gone away
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

        var textElement = $($scope.shapeToEdit).find('.text')[0];
        $scope.textValue = textElement.firstChild.nodeValue;
      });

      $scope.$watch('shapeToDraw + selectedFill + selectedStrokeColor + selectedStrokeWidth', function() {
        drawService.drawSettings = {
          shape: $scope.shapeToDraw,
          fill: $scope.selectedFill,
          stroke: $scope.selectedStrokeColor,
          strokeWidth: $scope.selectedStrokeWidth
        };

        if($scope.isEditingShape){
          drawService.updateShape($scope.shapeToEdit);
        }
      });

      // provide services functions to update scope
      surfaceService.setShapeToEdit = function(shape){
        safeApply(function() {
          $scope.isDrawing = false;
          $scope.isEditingShape = true;
          $scope.shapeToEdit = shape;
        });
      };

      drawService.isDrawing = function() {
        return $scope.isDrawing;
      };

      selectionService.resetSelectedShape = function() {
        safeApply(function () {
          $scope.isEditingText = false;
          $scope.isEditingShape = false;
        });
      };

      selectionService.startEditingText = function() {
        safeApply(function() {
          $scope.isEditingText = true;
        });
      }

      textFlowService.currentShape = function() {
        return $scope.shapeToEdit;
      };

      resizeService.resizeStarted = function() {
        selectionService.hideSelectionBox();
        $($scope.shapeToEdit).find('.text').hide();
      };

      resizeService.resizeEnded = function() {
        $($scope.shapeToEdit).find('.text').show();
        textFlowService.updateTextFlowForCurrentShape();
        selectionService.showSelectionBox();
      };

      function safeApply(fn) {
        ($scope.$$phase || $scope.$root.$$phase) ? fn() : $scope.$apply(fn);
      }
    });
})();