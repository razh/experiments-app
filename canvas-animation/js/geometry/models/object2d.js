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

      this.applyCompositing( ctx );
      this.applyLineStyle( ctx );

      this.fill( ctx );
      this.stroke( ctx );

      this.restoreCompositing( ctx );
      this.restoreLineStyle( ctx );
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

    fill: function( ctx ) {
      var fill = this.get( 'fill' );

      if ( fill && fill.get( 'alpha' ) ) {
        ctx.fillStyle = fill.rgba();
        ctx.fill();
      }
    },

    stroke: function( ctx ) {
      var stroke = this.get( 'stroke' ),
          lineWidth = this.get( 'lineWidth' );

      if ( lineWidth && stroke && stroke.get( 'alpha' ) ) {
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = stroke.rgba();
        ctx.stroke();
      }
    },

    applyCompositing: function( ctx ) {
      // Set compositing if not default.
      [ 'globalAlpha', 'globalCompositeOperation' ].forEach(function( property ) {
        var value = this.get( property );
        if ( value !== defaults[ property ] ) {
          ctx[ property ] = value;
        }
      }.bind( this ));
    },

    applyLineStyle: function( ctx ) {
      // Set line style if not default.
      [ 'lineCap', 'lineJoin' ].forEach(function( property ) {
        var value = this.get( property );
        if ( value !== defaults[ property ] ) {
          ctx[ property ] = value;
        }
      }.bind( this ));

      var miterLimit = this.get( 'miterLimit' );
      if ( ctx.lineJoin === 'miter' && miterLimit !== defaults.miterLimit ) {
        ctx.miterLimit = miterLimit;
      }
    },

    restoreCompositing: function( ctx ) {
      // Restore default compositing.
      [ 'globalAlpha', 'globalCompositeOperation' ].forEach(function( property ) {
        var defaultValue = defaults[ property ];
        if ( this.get( property ) !== defaults[ property ] ) {
          ctx[ property ] = defaultValue;
        }
      }.bind( this ));
    },

    restoreLineStyle: function( ctx ) {
      [ 'lineCap', 'lineJoin', 'miterLimit' ].forEach(function( property ) {
        var value = this.get( property );
        if ( value !== defaults[ property ] ) {
          ctx[ property ] = value;
        }
      }.bind( this ));
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
