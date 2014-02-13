(function() {
  angular.module('svgAbstraction')
    .directive('svgCanvasLeftMenu', function() {
      return {
        restrict: 'E',
        templateUrl: 'modules/svgAbstraction/directives/svgCanvasLeftMenu.html',
        controller: 'svgCanvasLeftMenuCtrl',
        scope: {
          sideMenuOpen: '=isOpen',
          selectedShape: '=',
          template: '=',
          liveTemplate: '=',
          vocabulary: '=',
          liveShapes: '=',
          shapes: '='
        }
      };
    })
    .controller('svgCanvasLeftMenuCtrl', function($scope, $modal, collectionArraySync) {
      window.debugLeftMenuCtrl = $scope;

      // Properties

      $scope.leftSubmenu = null;

      // Actions

      $scope.closeSideMenu = function() {
        if ($scope.leftSubmenu) {
          $scope.leftSubmenu = null;
          return;
        }

        $scope.sideMenuOpen = false;
      };

      $scope.exportPdf = function() {
        $scope.$emit('submitSvgToBatik');
      };

      $scope.deleteShape = function(selectedShape) {
        moveShapesAboveDownOneInOrder(selectedShape);
        $scope.leftSubmenu = null;

        $scope.liveShapes.del(selectedShape.model.id);

        // Since the canvas directives appear to be siblings,
        // regular broadcast is not being caught by other directives
        $scope.$parent.$broadcast('shapeDeleted', selectedShape);
      };

      $scope.canMoveUp = function(shape) {
        if (!shape) return false;
        var newOrderSpot = shape.model.order + 1;
        return newOrderSpot !== nextOrderNumber();
      };

      $scope.canMoveDown = function(shape) {
        if (!shape) return false;
        var newOrderSpot = shape.model.order - 1;
        return newOrderSpot !== -1;
      };

      $scope.moveToTop = function(shape) {
        //TODO: this is a lazy way
        while ($scope.canMoveUp(shape)) {
          $scope.moveUp(shape);
        }
      };

      $scope.moveToBottom = function(shape) {
        //TODO: this is a lazy way
        while ($scope.canMoveDown(shape)) {
          $scope.moveDown(shape);
        }
      };

      $scope.moveUp = function(shape) {
        if (!$scope.canMoveUp(shape)) return;
        moveShape('up', shape);
      };

      $scope.moveDown = function(shape) {
        if (!$scope.canMoveDown(shape)) return;
        moveShape('down', shape);
      };

      function moveShape(direction, shape) {
        var directionInt = direction === 'up' ? 1 : -1;

        var newOrderSpot = shape.model.order + directionInt;

        var originalSpot = _.find($scope.shapes, function(shape) {
          return shape.model.order === newOrderSpot;
        });

        originalSpot.model.order -= directionInt;

        shape.model.order = newOrderSpot;
      }

      // Functions

      function moveShapesAboveDownOneInOrder(selectedShape) {
        var deletedOrder = selectedShape.model.order;

        _($scope.shapes)
          .where(function(shape) {
            return shape.model.order > deletedOrder;
          })
          .each(function(shape) {
            shape.model.order -= 1;
          });
      }

      function nextOrderNumber() {
        return _.keys($scope.shapes).length;
      }

      // Events

      $scope.$on('unSelectShape', function() {
        $scope.leftSubmenu = null;
      });

      // Watches

      $scope.$watch('vocabulary', computedVocabularyGroup, true);
      function computedVocabularyGroup(vocabulary, oldValues) {
        if (vocabulary === oldValues) return;

        $scope.vocabularyGroups = _.groupBy(vocabulary, 'type');
      }

      // binding modal windows
      var bindingViewMap = {
        'background': 'color',
        'borderColor': 'color',
        'fontColor': 'color',
        'image': 'image'
      };

      $scope.openBindingsWindow = function(selectedShape, property) {
        if (!selectedShape.model.fieldBindings[property]) {
          selectedShape.model.fieldBindings[property] = {
            boundTo: '',
            bindings: {}
          };
        }

        var fieldBinding = selectedShape.model.fieldBindings[property];
        var vocabularyGroups = $scope.vocabularyGroups;
        var bindingsKey = ['shapes', selectedShape.model.id, 'fieldBindings', property, 'bindings'].join('.');
        var liveBindings = $scope.liveTemplate.scope(bindingsKey);

        var modalInstance = $modal.open({
          templateUrl: 'modules/svgAbstraction/bindingViews/' + bindingViewMap[property] + '.html',
          controller: function($scope, $modalInstance) {
            $scope.fieldBinding = fieldBinding;
            $scope.vocabularyGroups = vocabularyGroups;

            $scope.mappedBindings = collectionArraySync.create(fieldBinding.bindings, liveBindings);

            $scope.addNewBinding = function() {
              liveBindings.add({type: 'eq', fieldValue: '', overrideValue: ''});
//              $scope.mappedBindings.push({type: 'eq', fieldValue: '', overrideValue: ''});
            };

            $scope.removeBinding = function(binding) {
              liveBindings.del(binding.id);
            };

            $scope.save = function() {
              $modalInstance.close();
            };

            $scope.cancel = function() {
              $modalInstance.dismiss('cancel');
            };
          }
        });

        modalInstance.result.then(function(template) {

        });
      };

      // fonts / colors
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
        {id: 10, name: '10'},
        {id: 11, name: '11'},
        {id: 12, name: '12'},
        {id: 13, name: '13'},
        {id: 14, name: '14'}
      ];

      $scope.fontSizeOptions = [
        {id: '8.0', name: '8'},
        {id: '9.0', name: '9'},
        {id: '10.0', name: '10'},
        {id: '11.0', name: '11'},
        {id: '12.0', name: '12'},
        {id: '13.0', name: '13'},
        {id: '14.0', name: '14'},
        {id: '18.0', name: '18'},
        {id: '24.0', name: '24'},
        {id: '30.0', name: '30'},
        {id: '36.0', name: '36'},
        {id: '48.0', name: '48'},
        {id: '60.0', name: '60'},
        {id: '72.0', name: '72'},
        {id: '96.0', name: '96'}
      ];

      $scope.fontFamilyOptions = [
        {id: 'Arial', name: 'Arial'},
        {id: 'Cambria', name: 'Cambria'},
        {id: 'Consolas', name: 'Consolas'},
        {id: 'Verdana', name: 'Verdana'},
        {id: 'Code39Azalea', name: 'Barcode 39'}
      ];
    });


}());