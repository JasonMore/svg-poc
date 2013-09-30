var liveResourceModule = angular.module('liveResource', []);

module.exports = liveResourceModule;

liveResourceModule.service('liveResourceProvider', function ($q, $http, $timeout, $rootScope) {
  var liveScope = $rootScope.$new();

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

      this.subscribe = function (queryOrScope) {
        if (!queryOrScope) {
          queryOrScope = racerModel.at(path);
        }

        racerModel.subscribe(queryOrScope, function () {

          // not sure why I have to do this
          if (queryOrScope.constructor.name === 'Query') {
            queryOrScope.ref('_page._' + path);
          }

          liveScope[path] = liveData;

          $timeout(function () {
            angular.extend(liveData, racerModel.get(path));
          });
        });

        return liveData;
      };

      // when local modifications are made, update the server model
      liveScope.$watch(function () {
        return JSON.stringify(liveScope[path]);
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

//        if (!oldModelJson || (newModelJson === oldModelJson)) {
        if ((newModelJson === oldModelJson)) {
          return;
        }

        if(!oldModel){
          racerModel.set(childPath, newModel);
          return;
        }

        for (var propertyKey in newModel) {
          if (oldModel && oldModel[propertyKey] && oldModel[propertyKey] === newModel[propertyKey]) {
            continue;
          }

          var setPath = childPath;

          // real code
//          if (!_.contains(childPath, newModel.id)) {
//            setPath += '.' + newModel.id;
//          }

          // hack
          if (!newModel.path && !_.contains(childPath, newModel.id)) {
            setPath += '.' + newModel.id;
          }

          setPath += '.' + propertyKey;

          if (_.isArray(newModel[propertyKey])) {
            updateArrayModel(newModel[propertyKey], oldModel ? oldModel[propertyKey] : null, setPath);
            return;
          }

          if (_.isObject(newModel[propertyKey])) {
            updateModel(newModel[propertyKey], oldModel ? oldModel[propertyKey] : null, setPath);
            return;
          }

          racerModel.set(setPath, newModel[propertyKey]);
        }
      }

      function updateArrayModel(newModelArray, oldModelArray, childPath) {
        for (i = 0; i < newModelArray.length; i++) {

            updateModel(newModelArray[i], oldModelArray[i], childPath + "." + i);


        }
      }

      // when server modificaitons are made, update the local model
      racerModel.on('all', path + '**', function (property, type, newVal, oldVal, passed) {

//        if(!passed.$remote){
//          return;
//        }

        // this $timeout is needed to avoid $$hashkey being added
        // to the op insert payload when new items are being created.
        $timeout(function () {
          var newServerModel = racerModel.get(path);

          // if a collection, remove deleted data
          if (!newServerModel || !newServerModel.id) {
            var keysRemoved = _.difference(_.keys(liveData), _.keys(newServerModel));

            _.each(keysRemoved, function (key) {
              delete liveData[key];
            });
          }

          angular.extend(liveData, newServerModel);
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
