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

  var compositingKeys = [ 'globalAlpha', 'globalCompositeOperation' ];
  var lineStyleKeys = [ 'lineCap', 'lineJoin', 'miterLimit' ];

  /*
    Default values as defined by the canvas spec/browser.
    Example values: {
      lineCap: 'butt',
      lineJoin: 'miter',
      miterLimit: 10,
      globalAlpha: 1,
      globalCompositeOperation: 'source-over'
    }
   */
  var defaults = (function() {
    var canvas = document.createElement( 'canvas' ),
        context = canvas.getContext( '2d' );

    var primitiveKeys = _.keys( context ).filter(function( key ) {
      return !_.isObject( context[ key ] );
    });

    return _.pick( context, primitiveKeys );
  }) ();

  // Set canvas attributes to the object properties (if not default).
  // For example, the object's globalCompositeOperation or lineCap.
  function canvasApplyFn( ctx, properties, object ) {
    properties.forEach(function( property ) {
      var value = this.get( property );
      if ( value !== defaults[ property ] ) {
        ctx[ property ] = value;
      }
    }, object );
  }

  // The reverse of canvasApplyFn.
  // Set canvas attributes to their defaults.
  function canvasRestoreFn( ctx, properties, object ) {
    properties.forEach(function( property ) {
      var defaultValue = defaults[ property ];
      if ( this.get( property ) !== defaults[ property ] ) {
        ctx[ property ] = defaultValue;
      }
    }, object );
  }

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
          // Load attrs object/array.
          if ( attrs[ property ] ) {
            attrs[ property ] = new Color( attrs[ property ] );
          }
        });
      }

      Backbone.Model.apply( this, arguments );

      colorProperties.forEach(function( property ) {
        this.listenTo( this.get( property ), 'change', function() {
          this.trigger( 'change' );
        });
      }, this );
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
      var x = this.get( 'x' ),
          y = this.get( 'y' );

      var angle = this.get( 'angle' );

      var scaleX = this.get( 'scaleX' ),
          scaleY = this.get( 'scaleY' );

      // Apply non-identity transforms.
      if ( x || y ) {
        ctx.translate( x, y );
      }

      if ( angle ) {
        ctx.rotate( -angle );
      }

      if ( scaleX !== 1 || scaleY !== 1 ) {
        ctx.scale( scaleX, scaleY );
      }
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

    // Set compositing if not default.
    applyCompositing: function( ctx ) {
      canvasApplyFn( ctx, compositingKeys, this );
    },

    // Set line style if not default.
    applyLineStyle: function( ctx ) {
      canvasApplyFn( ctx, lineStyleKeys, this );
    },

    // Restore default compositing.
    restoreCompositing: function( ctx ) {
      canvasRestoreFn( ctx, compositingKeys, this );
    },

    // Restore default line style.
    restoreLineStyle: function( ctx ) {
      canvasRestoreFn( ctx, lineStyleKeys, this );
    },

    contains: function( ctx, x, y ) {
      ctx.save();
      this.applyTransform( ctx );
      this.drawPath( ctx );
      ctx.restore();

      ctx.lineWidth = this.get( 'lineWidth' );
      this.applyLineStyle( ctx );
      var contains = ctx.isPointInPath( x, y ) || ctx.isPointInStroke( x, y );
      this.restoreLineStyle( ctx );

      return contains;
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
    },

    clone: function() {
      var cloneModel = Backbone.Model.prototype.clone.call( this );

      // Clone nested color objects.
      cloneModel.set({
        fill:   this.get( 'fill'   ).clone(),
        stroke: this.get( 'stroke' ).clone()
      });

      return cloneModel;
    }
  });

  Object2D.lineCaps = lineCaps;
  Object2D.lineJoins = lineJoins;
  Object2D.compositeOperations = compositeOperations;

  Object2D.colorProperties = colorProperties;

  return Object2D;
});
