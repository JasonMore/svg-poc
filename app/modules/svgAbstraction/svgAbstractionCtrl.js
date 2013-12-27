(function () {
  angular.module('svgAbstraction.controllers')
    .controller('svgAbstractionCtrl', function ($scope, $stateParams, $timeout, shapePaths, shapeViewModelService, liveResource, textReflowService, dotNotation, $modal, dataMergeService) {
      window.debugScope = $scope;

      // load data
      var templateKey = 'templates.' + $stateParams.id;
      var liveTemplate = liveResource(templateKey);
      $scope.template = liveTemplate.subscribe();

      var liveStudents = liveResource('students');
      var studentsQuery = liveStudents.query({});
      $scope.students = liveStudents.subscribe(studentsQuery);

      var liveVocabulary = liveResource('vocabulary');
      var vocabularyQuery = liveVocabulary.query({});
      $scope.vocabulary = liveVocabulary.subscribe(vocabularyQuery);

      // lets you do crud on templates.[id].shapes directly
      var liveShapes = liveTemplate.scope('shapes');

      // add default template data
      if (!$scope.template.width || !scope.template.height) {
        $scope.template.width = 1500;
        $scope.template.height = 1500;
      }

      // properties
      $scope.showDrawMenu = false;
      $scope.showSettingsMenu = false;
      $scope.showDataMenu = false;
      $scope.selectedShape = null;
      $scope.shapeToDraw = null;
      $scope.shapePaths = shapePaths.list;
      $scope.shapeKeyValues = shapePaths.keyValues;
      $scope.shapes = {};
      $scope.zoom = 1;
      $scope.mergeDataId = null;
      $scope.templatedShapes = {};
      $scope.openShapeMenu = false;
      $scope.sideMenuOpen = true;
      $scope.leftSubmenu = null;
      $scope.menuTop = 0;
      $scope.menuLeft = 0;

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

      // watches
      $scope.$watch(function () {
        return _.keys($scope.template.shapes).length;
      }, function (newVals, oldVals) {
        // find shapes that were removed remotely
        var viewModelIds = _.keys($scope.shapes);
        var modelIds = _.keys($scope.template.shapes);

        var idsToRemove = _.difference(viewModelIds, modelIds);

        for (var property in $scope.shapes) {
          if (_.contains(idsToRemove, property)) {
            delete $scope.shapes[property];
          }
        }

        // find shapes that were added
        viewModelIds = _.keys($scope.shapes);
        var idsToAdd = _.difference(modelIds, viewModelIds);

        _.each(idsToAdd, function (id) {
          function getModelFn() {
            return $scope.template.shapes[id];
          }

          $scope.shapes[id] = shapeViewModelService.create(getModelFn);
        });

      });

      var updateAllTextReflows = _.debounce(function () {
        textReflowService.recalculateAllText($scope.computedShapes());
      }, 200);

      $scope.$watch('template.shapes', function () {
        if ($scope.selectedShape && $scope.selectedShape.isEditingText) {
          return;
        }

        updateAllTextReflows();
      });

      $scope.$watch('mergeDataId', function (mergeDataId, oldValue) {
        if (mergeDataId === oldValue) return;

        if (!mergeDataId) {
          updateAllTextReflows();
          $scope.shapesCopy = null;
          return;
        }

        // by only copying the shapes in between merges, prevents flicker
        // when updating template data or changing templates
        if (!oldValue) {
          $scope.templatedShapes = {};
          $scope.shapesCopy = angular.copy($scope.template.shapes);

          _($scope.shapesCopy).each(function (shape) {
            function getModelFn() {
              return shape;
            }

            $scope.templatedShapes[shape.id] = shapeViewModelService.create(getModelFn);
          });
        }

        applyTemplateDataToTemplateShapes();

        updateAllTextReflows();
      });

      function applyTemplateDataToTemplateShapes() {
        var data = $scope.students[$scope.mergeDataId];
        var mergedShapes = dataMergeService.getMergedShapesWithData($scope.shapesCopy, data);
        _.merge($scope.shapesCopy, mergedShapes);
      }

      $scope.$watch('vocabulary', computedVocabularyGroup, true);
      function computedVocabularyGroup(vocabulary, oldValues) {
        if (vocabulary === oldValues) return;

        $scope.vocabularyGroups = _.groupBy(vocabulary, 'type');
      }

      $scope.$watch('students', function () {
        if (!$scope.mergeDataId) return;
        applyTemplateDataToTemplateShapes()

      }, true);

      // actions

      $scope.shapeClick = function (shape) {
        $scope.openShapeMenu = false;
        $scope.setSelectedShape(shape);
      };

      $scope.setSelectedShape = function (shape) {
        if ($scope.selectedShape === shape || $scope.mergeDataId) {
          return;
        }

        // sent a model instead of viewmodel
        if (!shape.model) {
          $timeout(function () {
            var viewModel = _.find($scope.shapes, function (viewModel) {
              return viewModel.model.id === shape.id;
            });
            $scope.setSelectedShape(viewModel);
          });
          return;
        }

        $scope.unSelectShape();

        // when creating a new shape, its not always drawn yet
        $timeout(function () {
          $scope.selectedShape = shape;
          $scope.shapeToDraw = null;
        })
      };

      $scope.deleteShape = function (selectedShape) {
        moveShapesAboveDownOneInOrder(selectedShape);
        $scope.unSelectShape();
        liveShapes.del(selectedShape.model.id);
      };

      $scope.canDragShape = function (shape) {
        return !$scope.mergeDataId;
      };

      $scope.drawShape = function (shape) {
        $scope.openMenu('close');
        $scope.unSelectShape();

        // if they click the button twice, undo
        if ($scope.shapeToDraw === shape) {
          $scope.shapeToDraw = null;
        } else {
          $scope.shapeToDraw = shape;
        }
      };

      $scope.unSelectShape = function () {
        $scope.openShapeMenu = false;
        $scope.leftSubmenu = null;

        if (!$scope.selectedShape) {
          return;
        }

        if ($scope.selectedShape.isEditingText) {
          updateAllTextReflows();
        }

        $scope.selectedShape.isEditingText = false;
        $scope.selectedShape.showPreviewImage = false;
        $scope.selectedShape = null;

        $scope.openMenu('close');

        // HACK
        updateAllTextReflows();
      };

      $scope.shapeDrawn = function (shape) {
        shape.order = nextOrderNumber();

        liveShapes.add(shape);
        $scope.setSelectedShape(shape);
      };

      $scope.fontSize = function (addHowMuch) {
        addHowMuch = parseInt(addHowMuch);
        var oldValue = parseInt($scope.selectedShape.model.fontSize);
        $scope.selectedShape.model.fontSize = oldValue + addHowMuch;
      };

      $scope.copyCurrentShape = function () {
        if (!$scope.selectedShape) return;
        $scope.copiedShapeModel = angular.copy($scope.selectedShape.model);
        delete $scope.copiedShapeModel.id;
      };

      $scope.pasteCopiedShape = function () {
        if ($scope.mergeDataId) return;

        // offset new shape
        $scope.copiedShapeModel.top += 25;
        $scope.copiedShapeModel.left += 25;
        $scope.copiedShapeModel.order = nextOrderNumber();

        liveShapes.add($scope.copiedShapeModel);
        $scope.setSelectedShape($scope.copiedShapeModel);
//        $scope.copyCurrentShape();
        $scope.copiedShapeModel = null;
      };

      $scope.exportPdf = function () {
        $scope.unSelectShape();
        $scope.$broadcast('submitSvgToBatik');
      };

      $scope.openMenu = function (menu) {
        var oldVal = $scope[menu];

        $scope.showDrawMenu = false;
        $scope.showSettingsMenu = false;
        $scope.showDataMenu = false;

        if (menu !== 'close') {
          $scope[menu] = !oldVal;
        }

        //HACK
        $timeout(function () {
          if (oldVal) {
            updateAllTextReflows();
          }

        }, 200)


      };

      $scope.mergeData = function (id) {
        $scope.mergeDataId = id;
      };

      $scope.shapeMenuOpen = function ($event, toggle) {
        $scope.menuTop = $event.pageY + 10;
        $scope.menuLeft = $event.pageX + 10;

        if (toggle) {
          $scope.openShapeMenu = !$scope.openShapeMenu;
        }
        else {
          $scope.openShapeMenu = true;
        }
      };

      $scope.closeSideMenu = function () {
        if ($scope.leftSubmenu) {
          $scope.leftSubmenu = null;
          return;
        }

        $scope.sideMenuOpen = false;
      };

      var bindingViewMap = {
        'background': 'color',
        'borderColor': 'color',
        'fontColor': 'color',
        'image': 'image'
      };

      $scope.openBindingsWindow = function (selectedShape, property) {
        if (!selectedShape.model.fieldBindings[property]) {
          selectedShape.model.fieldBindings[property] = {
            boundTo: '',
            bindings: {}
          };
        }

        var fieldBinding = selectedShape.model.fieldBindings[property];
        var vocabularyGroups = $scope.vocabularyGroups;
        var bindingsKey = ['shapes', selectedShape.model.id, 'fieldBindings', property, 'bindings'].join('.');
        var liveBindings = liveTemplate.scope(bindingsKey);

        var modalInstance = $modal.open({
          templateUrl: 'modules/svgAbstraction/bindingViews/' + bindingViewMap[property] + '.html',
          controller: function ($scope, $modalInstance) {
//            $scope.isNew = template ? false : true;
//            $scope.template = template || {};

            $scope.fieldBinding = fieldBinding;
            $scope.vocabularyGroups = vocabularyGroups;

            $scope.addNewBinding = function () {
              liveBindings.add({type: 'eq', fieldValue: '', overrideValue: ''});
            };

            $scope.removeBinding = function (binding) {
              liveBindings.del(binding.id);
            };

            $scope.save = function () {
              $modalInstance.close();
            };

            $scope.cancel = function (isNew) {
              $modalInstance.dismiss('cancel');
            };
          }
        });

        modalInstance.result.then(function (template) {
//          if(!template.id){
//            template.templateType = $scope.templateType.id;
//            template.created = new Date();
//            liveTemplates.add(template);
//          }
        });
      };

      // computed
      $scope.computedShapes = function () {
        if ($scope.mergeDataId) {
          return $scope.templatedShapes;
        }

        return $scope.shapes;
      };

      $scope.shapeType = function () {
        if ($scope.shapeToDraw) {
          return $scope.shapeToDraw.key;
        }
      };

      $scope.isDrawing = function () {
        return _.isObject($scope.shapeToDraw);
      };

      $scope.isActiveShape = function (shape) {
        return $scope.shapeToDraw === shape;
      };

      $scope.showShapeMenu = function () {
        if (!$scope.openShapeMenu) {
          return false;
        }

        var shape = $scope.selectedShape;

        if (shape.isDragging || shape.isResizing) {
          return false;
        }

        if ($scope.showDrawMenu || $scope.showSettingsMenu || $scope.showDataMenu) {
          return false;
        }

        return true;
      };

      // events

      $scope.$on('blankSpaceOnBodyClicked', function ($event) {
        $scope.unSelectShape();
      });

      // keyboard shortcuts

      kDown.whenShortcut("esc", function () {
        $scope.$apply(function () {
          if ($scope.mergeDataId) {
            $scope.mergeDataId = null;
          }

          $scope.unSelectShape();
        });
      });

      kDown.whenShortcut("cmd+c", function () {
        $scope.$apply(function () {
          $scope.copyCurrentShape();
        });
      });

      kDown.whenShortcut("cmd+v", function () {
        if (!$scope.copiedShapeModel) return;

        $scope.$apply(function () {
          $scope.pasteCopiedShape();
        });
      });

//      kDown.whenDown('backspace', function (e) {
//        if (!$scope.selectedShape) return;
//
//        $scope.$apply(function () {
//          $scope.deleteShape();
//        });
//
//      });

      // shape ordering
      function nextOrderNumber() {
        return _.keys($scope.shapes).length;
      }

      $scope.canMoveUp = function (shape) {
        if (!shape) return false;
        var newOrderSpot = shape.model.order + 1;
        return newOrderSpot !== nextOrderNumber();
      };

      $scope.canMoveDown = function (shape) {
        if (!shape) return false;
        var newOrderSpot = shape.model.order - 1;
        return newOrderSpot !== -1;
      };

      $scope.moveToTop = function (shape) {
        //TODO: this is a lazy way
        while ($scope.canMoveUp(shape)) {
          $scope.moveUp(shape);
        }
      };

      $scope.moveToBottom = function (shape) {
        //TODO: this is a lazy way
        while ($scope.canMoveDown(shape)) {
          $scope.moveDown(shape);
        }
      };

      $scope.moveUp = function (shape) {
        if (!$scope.canMoveUp(shape)) return;
        moveShape('up', shape);
      };

      $scope.moveDown = function (shape) {
        if (!$scope.canMoveDown(shape)) return;
        moveShape('down', shape);
      };

      function moveShape(direction, shape) {
        var directionInt = direction === 'up' ? 1 : -1;

        var newOrderSpot = shape.model.order + directionInt;

        var originalSpot = _.find($scope.shapes, function (shape) {
          return shape.model.order === newOrderSpot;
        });

        originalSpot.model.order -= directionInt;

        shape.model.order = newOrderSpot;
      }

      function moveShapesAboveDownOneInOrder(selectedShape) {
        var deletedOrder = selectedShape.model.order;

        _($scope.shapes)
          .where(function (shape) {
            return shape.model.order > deletedOrder;
          })
          .each(function (shape) {
            shape.model.order -= 1;
          });
      }

    });


}());