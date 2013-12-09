/*globals define*/
define([
  'backbone',
  'models/color'
], function( Backbone, Color ) {
  'use strict';

  var Object2D = Backbone.Model.extend({
    defaults: function() {
      return {
        x: 0,
        y: 0,

        angle: 0,

        scaleX: 1,
        scaleY: 1,

        fill: new Color(),
        stroke: new Color(),
        lineWidth: 1
      };
    },

    draw: function( ctx ) {
      ctx.save();

      ctx.translate( this.get( 'x' ), this.get( 'y' ) );
      ctx.rotate( -this.get( 'angle' ) );
      ctx.scale( this.get( 'scaleX' ), this.get( 'scaleY' ) );

      this.drawPath( ctx );

      ctx.restore();

      var fill = this.get( 'fill' ),
          stroke = this.get( 'stroke' ),
          lineWidth = this.get( 'lineWidth' );

      if ( fill.get( 'alpha' ) ) {
        ctx.fillStyle = fill.rgba();
        ctx.fill();
      }

      if ( lineWidth && stroke.get( 'alpha' ) ) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = stroke.rgba();
        ctx.stroke();
      }
    },

    drawPath: function() {}
  });

  return Object2D;
});
