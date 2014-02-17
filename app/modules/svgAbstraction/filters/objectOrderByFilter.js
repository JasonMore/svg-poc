(function () {
  angular.module('svg-poc').filter('objectOrderBy', function (orderByFilter) {
    return function (value, predicate, reverse) {
      if (_.isObject(value)) {
        value = _.values(value);
      }

      return orderByFilter(value, predicate, reverse);
    };
  });
})();


