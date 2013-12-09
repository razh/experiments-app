/*globals define*/
define([
  'geometry/models/object2d'
], function( Object2D ) {
  'use strict';

  var Rect = Object2D.extend({
    defaults: function() {
      var defaults = Object2D.prototype.defaults();
      defaults.width  = 0;
      defaults.height = 0;
      return defaults;
    }
  });

  return Rect;
});
