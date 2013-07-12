(function () {
  angular.module('svgShell.controllers', [])
    .controller('svgShellCtrl', function ($scope, $timeout, surfaceService, drawService, selectionService, textFlowService, resizeService, dragService) {
      window.debugScope = $scope;

      // clicks
      $scope.setShapeToDraw = function (shape) {
        $scope.shapeToDraw = shape;
      }

      $scope.import = function (templateJson, dataJson) {
        drawService.clearScreen();
//        drawService.importTemplate($scope.templateJson, $scope.dataJson);
        drawService.importTemplate(templateJson, dataJson);
        textFlowService.updateTextFlowForAllShapes(drawService.shapesOnScreen);

      }

      $scope.export = function () {
        $scope.exportScreenJson = drawService.exportShapes();
      }

      // computed
      $scope.isDrawing = function () {
        if ($scope.shapeToDraw) {
          return true;
        }
        return false;
      }

      // properties
      $scope.templateJson = '';
      $scope.dataJson = '';
      $scope.exportScreenJson = '';

      $scope.isEditingText = false;
      $scope.textValue = '';
      $scope.isEditingShape = false;
      $scope.shapeToEdit;

      $scope.shapeToDraw = '';
      $scope.shapeOptions = [
        {id: 'rect', name: 'Rectangle'},
        {id: 'circle', name: 'Circle'},
        {id: 'heart', name: 'Heart'}
//        {id: 'ellipse', name: 'Ellipse'},
//        {id: 'line', name: 'Line'},
//        {id: 'polyline', name: 'Polyline'},
//        {id: 'polygon', name: 'Polygon'}
      ];

      $scope.selectedFill = 'gray';
      $scope.selectedStrokeColor = 'black';
      $scope.selectedFontColor = 'black';

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

      $scope.selectedFontSize = '14.0';
      $scope.fontSizeOptions = [
        {id: '8.0', name: '8'},
        {id: '9.0', name: '9'},
        {id: '10.0', name: '10'},
        {id: '11.0', name: '11'},
        {id: '12.0', name: '12'},
        {id: '13.0', name: '13'},
        {id: '14.0', name: '14'},
        {id: '15.0', name: '15'},
        {id: '16.0', name: '16'},
        {id: '17.0', name: '17'}
      ];

      $scope.selectedFontFamily = 'Verdana';
      $scope.fontFamilyOptions = [
        {id: 'Arial', name: 'Arial'},
        {id: 'Cambria', name: 'Cambria'},
        {id: 'Consolas', name: 'Consolas'},
        {id: 'Verdana', name: 'Verdana'}
      ];

      // clicks
      $scope.deleteShape = function () {
        drawService.deleteShape($scope.shapeToEdit);
        selectionService.clearSelection();
      };

      // watches
      $scope.$watch('isEditingText', function (newVal, oldVal) {
        if (newVal === oldVal) {
          return;
        }

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

        var text = $($scope.shapeToEdit).find('.text');
        $scope.selectedFontSize = text.attr('font-size');
        $scope.selectedFontFamily = text.attr('font-family');
        $scope.selectedFontColor = text.attr('fill');

        $scope.textValue = text.text();
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

      $scope.$watch('selectedFontSize + selectedFontFamily + selectedFontColor', function () {
        if (!$scope.isEditingShape) {
          return
        }

        var text = $($scope.shapeToEdit).find('.text');
        text.attr({
          'font-family': $scope.selectedFontFamily,
          'font-size': $scope.selectedFontSize,
          'fill': $scope.selectedFontColor
        });
        textFlowService.updateTextFlowForAllShapes(drawService.shapesOnScreen);
      });

      // provide services functions to update scope
      drawService.setShapeToEdit = function (shape) {
        safeApply(function () {
          $scope.isEditingShape = true;
          $scope.shapeToDraw = '';
          $scope.shapeToEdit = shape;
        });
      };

      drawService.isDrawing = $scope.isDrawing;

      drawService.shapeToDraw = function () {
        return $scope.shapeToDraw;
      };

      selectionService.clearSelectedShape = function () {
        safeApply(function () {
          $scope.isEditingText = false;
          $scope.isEditingShape = false;

          textFlowService.updateTextFlowForAllShapes(drawService.shapesOnScreen);
        });
      };

      selectionService.startEditingText = function () {
        safeApply(function () {
          $scope.isEditingText = true;
        });
      };

      textFlowService.currentShape = function () {
        return $scope.shapeToEdit;
      };

      resizeService.resizeStarted = function () {
        selectionService.hideSelectionBox();
        $($scope.shapeToEdit).find('.text').hide();
      };

      resizeService.resizeEnded = function () {
        $($scope.shapeToEdit).find('.text').show();
        textFlowService.updateTextFlowForAllShapes(drawService.shapesOnScreen);
        selectionService.showSelectionBox();
      };

      dragService.dragStarted = function () {
        selectionService.removeSelection();
      };

      dragService.dragEnded = function () {
        if(!dragService.isDrawing()) {
          return;
        }

        textFlowService.updateTextFlowForAllShapes(drawService.shapesOnScreen);
        selectionService.createSelectionBox($scope.shapeToEdit);
      };

      dragService.isDrawing = $scope.isDrawing;

      function safeApply(fn) {
        ($scope.$$phase || $scope.$root.$$phase) ? fn() : $scope.$apply(fn);
      }
    });
})();