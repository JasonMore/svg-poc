(function () {
  angular.module('svgShell.controllers', [])
    .controller('svgShellCtrl', function ($scope, $timeout, surfaceService, drawService, selectionService, textFlowService, resizeService, dragService) {
      window.debugScope = $scope;

      // clicks
      $scope.setShapeToDraw = function (shape) {
        $scope.shapeToDraw = shape;
      }

      // computed
      $scope.isDrawing = function () {
        if ($scope.shapeToDraw) {
          return true;
        }
        return false;
      }

      // properties
//      $scope.isDrawing = false;
      $scope.isEditingText = false;
      $scope.textValue = '';
      $scope.isEditingShape = false;
      $scope.shapeToEdit;
      $scope.dynamicTooltip = 'abc123';

      $scope.shapeToDraw = '';
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
      $scope.$watch('isEditingText', function (newVal, oldVal) {
        if(newVal === oldVal){return;}

        // setTimeout needed so we don't recalculate the textflow until
        // the text area has gone away
        $timeout(function () {
          if (newVal) {
            selectionService.removeSelection();
          } else {
            textFlowService.updateTextFlowForCurrentShape($scope.textValue);
            selectionService.createSelectionBox($scope.shapeToEdit);
          }
        });
      });

      $scope.$watch('shapeToEdit', function (newVal, oldVal) {
        if (!newVal || newVal === oldVal) {
          return;
        }

        var shape = $($scope.shapeToEdit).find('.shape');
        $scope.selectedFill = shape.attr('fill');
        $scope.selectedStrokeColor = shape.attr('stroke');
        $scope.selectedStrokeWidth = Number(shape.attr('stroke-width'));

        var text = $($scope.shapeToEdit).find('.text')[0];
        $scope.textValue = text.firstChild.nodeValue;
      });

      $scope.$watch('selectedFill + selectedStrokeColor + selectedStrokeWidth', function () {
        if (!$scope.isEditingShape) {
          return
        }

        var shape = $($scope.shapeToEdit).find('.shape');
        shape.attr({
          fill: $scope.selectedFill,
          stroke: $scope.selectedStrokeColor,
          'stroke-width': $scope.selectedStrokeWidth
        });

      });

      // provide services functions to update scope
      drawService.setShapeToEdit = function (shape) {
        safeApply(function () {
//          $scope.isDrawing = false;
          $scope.isEditingShape = true;
          $scope.shapeToDraw = '';
          $scope.shapeToEdit = shape;
        });
      };

      drawService.isDrawing = $scope.isDrawing;

      drawService.shapeToDraw = function () {
        return $scope.shapeToDraw;
      }

      selectionService.clearSelectedShape = function () {
        safeApply(function () {
          $scope.isEditingText = false;
          $scope.isEditingShape = false;

          textFlowService.updateTextFlowForAllShapes(drawService.drawNodes);
        });
      };

      selectionService.startEditingText = function () {
        safeApply(function () {
          $scope.isEditingText = true;
        });
      }

      textFlowService.currentShape = function () {
        return $scope.shapeToEdit;
      };

      resizeService.resizeStarted = function () {
        selectionService.hideSelectionBox();
        $($scope.shapeToEdit).find('.text').hide();
      };

      resizeService.resizeEnded = function () {
//        textFlowService.updateTextFlowForCurrentShape();
        textFlowService.updateTextFlowForAllShapes(drawService.drawNodes);
        $($scope.shapeToEdit).find('.text').show();
        selectionService.showSelectionBox();
      };

      dragService.dragStarted = function () {
//        $($scope.shapeToEdit).find('.text').hide();
        selectionService.removeSelection();
      };

      dragService.dragEnded = function () {
//        $($scope.shapeToEdit).find('.text').show();
        textFlowService.updateTextFlowForAllShapes(drawService.drawNodes);
        selectionService.createSelectionBox($scope.shapeToEdit);
      };

      function safeApply(fn) {
        ($scope.$$phase || $scope.$root.$$phase) ? fn() : $scope.$apply(fn);
      }
    });
})();