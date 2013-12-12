/*globals define*/
define([
  'geometry/models/object2d',
  'utils'
], function( Object2D, Utils ) {
  'use strict';

  var PI2 = Utils.PI2;

  var Circle = Object2D.extend({
    defaults: function() {
      var defaults = Object2D.prototype.defaults();
      defaults.radius = 0;
      return defaults;
    },

    drawPath: function( ctx ) {
      ctx.beginPath();
      ctx.arc( 0, 0, this.get( 'radius' ), 0, PI2 );
      ctx.closePath();
    }
  });

  return Circle;
});
