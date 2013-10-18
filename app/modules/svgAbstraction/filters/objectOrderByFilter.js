(function () {
  angular.module('svgAbstraction.filters').filter('objectOrderBy', function (orderByFilter) {
    return function (value, predicate, reverse) {
      if (_.isObject(value)) {
        value = _.values(value);
      }

      return orderByFilter(value, predicate, reverse);
    };
  });
})();


