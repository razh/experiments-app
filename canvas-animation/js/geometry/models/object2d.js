/*globals define*/
define([
  'underscore',
  'backbone',
  'models/color'
], function( _, Backbone, Color ) {
  'use strict';

  var colorProperties = [ 'fill', 'stroke' ];

  var defaultLineStyle = {
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10
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

        lineCap: defaultLineStyle.lineCap,
        lineJoin: defaultLineStyle.lineJoin,
        miterLimit: defaultLineStyle.miterLimit,

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

      // Set line style if not default.
      var lineCap = this.get( 'lineCap' ),
          lineJoin = this.get( 'lineJoin' ),
          miterLimit = this.get( 'miterLimit' );

      if ( lineCap !== defaultLineStyle.lineCap ) {
        ctx.lineCap = lineCap;
      }

      if ( lineJoin !== defaultLineStyle.lineJoin ) {
        ctx.lineJoin = lineJoin;
      }

      if ( ctx.lineJoin === 'miter' && miterLimit !== defaultLineStyle.miterLimit ) {
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

      // Restore default line style state.
      if ( lineCap !== defaultLineStyle.lineCap ) {
        ctx.lineCap = defaultLineStyle.lineCap;
      }

      if ( lineJoin !== defaultLineStyle.lineJoin ) {
        ctx.lineJoin = defaultLineStyle.lineJoin;
      }

      if ( miterLimit !== defaultLineStyle.miterLimit ) {
        ctx.miterLimit = defaultLineStyle.miterLimit;
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

  Object2D.colorProperties = colorProperties;

  return Object2D;
});
