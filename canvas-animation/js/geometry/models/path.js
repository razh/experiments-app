/*globals define*/
define([
  'geometry/models/object2d'
], function( Object2D ) {
  'use strict';

  var Path = Object2D.extend({
    defaults: function() {
      var defaults = Object2D.prototype.defaulst();
      defaults.points = [];
      return defaults;
    }
  });

  return Path;
});
