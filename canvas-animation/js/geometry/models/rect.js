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
    },

    drawPath: function( ctx ) {
      var width  = this.get( 'width' ),
          height = this.get( 'height' );

      ctx.beginPath();
      ctx.rect( -0.5 * width, -0.5 * height, width, height );
      ctx.closePath();
    }
  });

  return Rect;
});
