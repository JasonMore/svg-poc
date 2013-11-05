//module(function ($provide) {
//  $provide.service('liveResource', function ($delegate) {
    function mockLiveResourceService(path){
      // racer functions
      this.add = function (newModel) {
//        newModel = angular.copy(newModel);
//        return racerModel.add(path, newModel);
      };

      this.at = function () {
//        return racerModel.at(path);
      };

      this.query = function (queryParams) {
//        return racerModel.query(path, queryParams);
      };

      this.delete = function (model) {
//        if (_.contains(path, model.id)) {
//          return racerModel.del(path);
//        }
//
//        return racerModel.del(path + "." + model.id);
      };

      this.get = function() {
//        return racerModel.get(path);
      };

      this.subscribe = function (queryOrScope) {
//        if (!queryOrScope) {
//          queryOrScope = racerModel.at(path);
//        }
//
//        racerModel.subscribe(queryOrScope, function () {
//
//          // not sure why I have to do this
//          if (queryOrScope.constructor.name === 'Query') {
//            queryOrScope.ref('_page._' + path);
//          }
//
//          $timeout(function () {
//            _.extend(liveData, angular.copy(racerModel.get(path)));
//          });
//        });
//
//        return liveData;

        return {};
      };

      this.scope = function (subPath) {
//        return racerModel.scope(path + '.' + subPath);
      };

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
    }

window.liveResourceMock =  function(path){
      return new mockLiveResourceService(path);
    }
//  });
//});