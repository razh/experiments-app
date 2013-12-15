/*globals define*/
define([
  'underscore',
  'backbone',
  'models/color'
], function( _, Backbone, Color ) {
  'use strict';

  var lineCaps = [ 'butt', 'round', 'square' ];
  var lineJoins = [ 'bevel', 'round', 'miter' ];

  var colorProperties = [ 'fill', 'stroke' ];

  var compositeOperations = [
    'source-over',
    'source-in',
    'source-out',
    'source-atop',
    'destination-over',
    'destination-in',
    'destination-out',
    'destination-atop',
    'lighter',
    'darker',
    'copy',
    'xor'
  ];

  // Default values as defined in the canvas spec.
  var defaults = {
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    globalAlpha: 1,
    globalCompositeOperation: 'source-over'
  };

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
        lineWidth: 1,

        lineCap: defaults.lineCap,
        lineJoin: defaults.lineJoin,
        miterLimit: defaults.miterLimit,

        globalAlpha: defaults.globalAlpha,
        globalCompositeOperation: defaults.globalCompositeOperation,

        zIndex: 0
      };
    },

    constructor: function() {
      var attrs = arguments[0];

      if ( attrs ) {
        colorProperties.forEach(function( property ) {
          if ( _.isArray( attrs[ property ] ) ) {
            attrs[ property ] = new Color( attrs[ property ] );
          }
        });
      }

      Backbone.Model.apply( this, arguments );

      colorProperties.forEach(function( property ) {
        this.listenTo( this.get( property ), 'change', function() {
          this.trigger( 'change' );
        }.bind( this ));
      }.bind( this ));
    },

    draw: function( ctx ) {
      ctx.save();

      this.applyTransform( ctx );
      this.drawPath( ctx );

      ctx.restore();

      // Set compositing if not default.
      var globalAlpha = this.get( 'globalAlpha' ),
          globalCompositeOperation = this.get( 'globalCompositeOperation' );

      if ( globalAlpha !== defaults.globalAlpha ) {
        ctx.globalAlpha = globalAlpha;
      }

      if ( globalCompositeOperation !== defaults.globalCompositeOperation ) {
        ctx.globalCompositeOperation = globalCompositeOperation;
      }

      // Set line style if not default.
      var lineCap = this.get( 'lineCap' ),
          lineJoin = this.get( 'lineJoin' ),
          miterLimit = this.get( 'miterLimit' );

      if ( lineCap !== defaults.lineCap ) {
        ctx.lineCap = lineCap;
      }

      if ( lineJoin !== defaults.lineJoin ) {
        ctx.lineJoin = lineJoin;
      }

      if ( ctx.lineJoin === 'miter' && miterLimit !== defaults.miterLimit ) {
        ctx.miterLimit = miterLimit;
      }

      // Fill and stroke.
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

      // Restore default compositing.
      if ( globalAlpha !== defaults.globalAlpha ) {
        ctx.globalAlpha = defaults.globalAlpha;
      }

      if ( globalCompositeOperation !== defaults.globalCompositeOperation ) {
        ctx.globalCompositeOperation = defaults.globalCompositeOperation;
      }

      // Restore default line style.
      if ( lineCap !== defaults.lineCap ) {
        ctx.lineCap = defaults.lineCap;
      }

      if ( lineJoin !== defaults.lineJoin ) {
        ctx.lineJoin = defaults.lineJoin;
      }

      if ( miterLimit !== defaults.miterLimit ) {
        ctx.miterLimit = defaults.miterLimit;
      }
    },

    drawPath: function( ctx ) {
      // Draw an empty path so .contains() doesn't use the last drawn path.
      ctx.beginPath();
      ctx.closePath();
    },

    applyTransform: function( ctx ) {
      ctx.translate( this.get( 'x' ), this.get( 'y' ) );
      ctx.rotate( -this.get( 'angle' ) );
      ctx.scale( this.get( 'scaleX' ), this.get( 'scaleY' ) );
    },

    contains: function( ctx, x, y ) {
      ctx.save();
      this.applyTransform( ctx );
      this.drawPath( ctx );
      ctx.restore();

      return ctx.isPointInPath( x, y );
    },

    toLocal: function( x, y ) {
      x -= this.get( 'x' );
      y -= this.get( 'y' );

      var angle = this.get( 'angle' );
      var cos, sin;
      var rx, ry;

      if ( angle ) {
        cos = Math.cos( angle );
        sin = Math.sin( angle );

        rx = cos * x - sin * y;
        ry = sin * x + cos * y;

        x = rx;
        y = ry;
      }

      return {
        x: x / this.get( 'scaleX' ),
        y: y / this.get( 'scaleY' )
      };
    },

    toWorld: function( x, y ) {
      x *= this.get( 'scaleX' );
      y *= this.get( 'scaleY' );

      var angle = this.get( 'angle' );
      var cos, sin;
      var rx, ry;

      if ( angle ) {
        cos = Math.cos( -angle );
        sin = Math.sin( -angle );

        rx = cos * x - sin * y;
        ry = sin * x + cos * y;

        x = rx;
        y = ry;
      }

      return {
        x: x + this.get( 'x' ),
        y: y + this.get( 'y' )
      };
    }
  });

  Object2D.lineCaps = lineCaps;
  Object2D.lineJoins = lineJoins;
  Object2D.compositeOperations = compositeOperations;

  Object2D.colorProperties = colorProperties;

  return Object2D;
});
