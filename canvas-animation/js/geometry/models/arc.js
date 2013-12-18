/*globals define*/
define([
  'geometry/models/circle',
  'utils'
], function( Circle, Utils ) {
  'use strict';

  var PI2 = Utils.PI2;

  var Arc = Circle.extend({
    defaults: function() {
      var defaults = Circle.prototype.defaults();
      defaults.startAngle = 0;
      defaults.endAngle = PI2;
      defaults.anticlockwise = false;
      return defaults;
    },

    drawPath: function( ctx ) {
      ctx.beginPath();

      ctx.arc(
        0, 0,
        this.get( 'radius' ),
        this.get( 'startAngle' ),
        this.get( 'endAngle' ),
        this.get( 'anticlockwise' )
      );

      ctx.closePath();
    }
  });

  return Arc;
});
