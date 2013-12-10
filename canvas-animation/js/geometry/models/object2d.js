/*globals define*/
define([
  'underscore',
  'backbone',
  'models/color'
], function( _, Backbone, Color ) {
  'use strict';

  var Object2D = Backbone.Model.extend({
    defaults: function() {
      return {
        x: 0,
        y: 0,

        angle: 0,

        scaleX: 1,
        scaleY: 1,

        fill: null,
        stroke: null,
        lineWidth: 1
      };
    },

    constructor: function() {
      var attributes = arguments[0];

      [ 'fill', 'stroke' ].forEach(function( prop ) {
        if ( _.isArray( attributes[ prop ] ) ) {
          attributes[ prop ] = new Color( attributes[ prop ] );
        }
      });

      Backbone.Model.apply( this, arguments );
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

      if ( fill && fill.get( 'alpha' ) ) {
        ctx.fillStyle = fill.rgba();
        ctx.fill();
      }

      if ( lineWidth && stroke && stroke.get( 'alpha' ) ) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = stroke.rgba();
        ctx.stroke();
      }
    },

    drawPath: function() {}
  });

  return Object2D;
});
