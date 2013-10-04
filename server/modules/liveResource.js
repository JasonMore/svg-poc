var liveResourceModule = angular.module('liveResource', []);

module.exports = liveResourceModule;

liveResourceModule.service('liveResourceProvider', function ($q, $http, $timeout, $rootScope) {
  var racer = require('racer');

  // init
  var initDefer = $q.defer();
  this.createLiveResource = initDefer.promise;

  $http.get('/racerInit').success(function (data) {
    racer.init(data);
  });

  racer.ready(function (racerModel) {

    window.debugRacerModel = racerModel;

    // currently singleton, refactor to factory
    var returnService = function liveResource(path) {
      this._racerModel = racerModel;
      var liveData = {};

      window.debugLiveData = liveData;

      // racer functions
      this.add = function (newModel) {
        newModel = angular.copy(newModel);
        return racerModel.add(path, newModel);
      };

      this.at = function () {
        return racerModel.at(path);
      };

      this.query = function (queryParams) {
        return racerModel.query(path, queryParams);
      };

      this.delete = function (model) {
        if (_.contains(path, model.id)) {
          return racerModel.del(path);
        }

        return racerModel.del(path + "." + model.id);
      };

      this.get = function() {
        return racerModel.get(path);
      };

      this.subscribe = function (queryOrScope) {
        if (!queryOrScope) {
          queryOrScope = racerModel.at(path);
        }

        racerModel.subscribe(queryOrScope, function () {

          // not sure why I have to do this
          if (queryOrScope.constructor.name === 'Query') {
            queryOrScope.ref('_page._' + path);
          }

          $timeout(function () {
            _.extend(liveData, angular.copy(racerModel.get(path)));
          });
        });

        return liveData;
      };

      this.scope = function(subPath){
        return racerModel.scope(path + '.' + subPath);
      }

      // these don't work yet
//
//      this.fn = function(name, fn){
//        return racerModel.fn(path + "_" + name, fn);
//      };
//
//      this.evaluate = function(name){
//        return racerModel.evaluate(path + "_" + name, path);
//      };
//
//      this.start = function() {
//
//      };

      // when local modifications are made, update the server model
      $rootScope.$watch(function () {
        return JSON.stringify(liveData);
      }, function (newModels, oldModels) {
        if (!oldModels || newModels === oldModels) {
          return;
        }

        // remove $$ from objects
        newModels = angular.copy(JSON.parse(newModels));
        oldModels = angular.copy(JSON.parse(oldModels));

        if (_.isEmpty(oldModels)) {
          return;
        }

        // are we actually at a model?
        if (newModels.id) {
          updateModel(newModels, oldModels);
          return;
        }

        for (var modelKey in newModels) {
          if (modelKey === "undefined") {
            continue;
          }

          updateModel(newModels[modelKey], oldModels[modelKey]);
        }
      }, true);

      function updateModel(newModel, oldModel, childPath) {
        if (!childPath) {
          childPath = path;
        }

        var newModelJson = JSON.stringify(newModel);
        var oldModelJson = JSON.stringify(oldModel);

        if ((newModelJson === oldModelJson)) {
          return;
        }

        // path must have an id in it, which we check with a .
        if (!oldModel && _.contains(path, '.')) {
          racerModel.setDiff(childPath, newModel);
          return;
        }

        for (var propertyKey in newModel) {
          if (oldModel && (propertyKey in oldModel) && oldModel[propertyKey] === newModel[propertyKey]) {
            continue;
          }

          var setPath = childPath;

          if (newModel.id && !_.contains(childPath, newModel.id)) {
            setPath += '.' + newModel.id;
          }

          setPath += '.' + propertyKey;

          if (_.isArray(newModel[propertyKey])) {
            updateArrayModel(newModel[propertyKey], oldModel ? oldModel[propertyKey] : null, setPath);
            continue;
          }

          if (_.isObject(newModel[propertyKey])) {
            updateModel(newModel[propertyKey], oldModel ? oldModel[propertyKey] : null, setPath);
            continue;
          }

          racerModel.setDiff(setPath, newModel[propertyKey]);
        }
      }

      function updateArrayModel(newModelArray, oldModelArray, childPath) {
        if (JSON.stringify(newModelArray) === JSON.stringify(oldModelArray)) {
          return;
        }

        // removed array items
        var removed = _.difference(oldModelArray, newModelArray);

        for (var i = 0; i < oldModelArray.length; i++) {

          if (!_.contains(removed, oldModelArray[i])) {
            continue;
          }

          racerModel.remove(childPath, i);
        }

        var oldModelArrayWithoutRemovedItems = _.without(oldModelArray, removed);

        for (i = 0; i < newModelArray.length; i++) {
          updateModel(newModelArray[i], oldModelArrayWithoutRemovedItems[i], childPath + "." + i);
        }
      }

      // when server modificaitons are made, update the local model
      racerModel.on('all', path + '**', function (property, type, newVal, oldVal, passed) {

        // this $timeout is needed to avoid $$hashkey being added
        // to the op insert payload when new items are being created.
        $timeout(function () {
          var newServerModel = angular.copy(racerModel.get(path));

          // if a collection, remove deleted data
          if (!newServerModel || !newServerModel.id) {
            var keysRemoved = _.difference(_.keys(liveData), _.keys(newServerModel));

            _.each(keysRemoved, function (key) {
              delete liveData[key];
            });
          }

          _.extend(liveData, newServerModel);
        });
      });
    };

    $timeout(function () {
      initDefer.resolve(function (path) {
        return new returnService(path);
      });
    });
  });

});
