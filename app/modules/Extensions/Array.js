(function() {
  'use strict';

  Object.defineProperty(Array.prototype, 'remove', {
    value: function(valueOrPredicate) {
      var predicate = typeof valueOrPredicate == "function" ? valueOrPredicate
        : function(value) {
        return value === valueOrPredicate;
      };

      for (var i = 0; i < this.length; i++) {
        var value = this[i];
        if (predicate(value)) {
          this.splice(i, 1);
          i--;
        }
      }
      return this;
    }
  });

  Object.defineProperty(Array.prototype, 'extend', {
    value: function(other_array) {
      if (_.isArray(other_array)) {
        other_array.forEach(function(v) {
          this.push(v)
        }, this);
      }
    }
  });

}());