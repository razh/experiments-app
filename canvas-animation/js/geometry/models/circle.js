define([
  'geometry/models/object2d'
], function( Object2D ) {
  'use strict';

  var Circle = Object2D.extend({
    defaults: function() {
      var defaults = Object2D.prototype.defaults();
      defaults.radius = 0;
      return defaults;
    }
  });

  return Circle;
});
