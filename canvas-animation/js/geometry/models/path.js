/*globals define*/
define([
  'geometry/models/object2d'
], function( Object2D ) {
  'use strict';

  var Interpolation = {
    LINEAR:      0,
    QUADRATIC:   1,
    CATMULL_ROM: 2
  };

  var Path = Object2D.extend({
    defaults: function() {
      var defaults = Object2D.prototype.defaults();
      defaults.points = [];
      return defaults;
    },

    drawPath: function( ctx ) {
      this.drawLinear( ctx );
      this.drawQuadratic( ctx );
    },

    drawLinear: function( ctx ) {
      var pointCount = this.pointCount();
      var points = this.get( 'points' );

      ctx.beginPath();
      ctx.moveTo( points[0], points[1] );

      var xi, yi;
      for ( var i = 1; i < pointCount; i++ ) {
        xi = points[ 2 * i ];
        yi = points[ 2 * i + 1 ];
        ctx.lineTo( xi, yi );
      }
    },

    drawQuadratic: function( ctx ) {
      var pointCount = this.pointCount();
      var points = this.get( 'points' );

      ctx.beginPath();
      ctx.moveTo( points[0], points[1] );

      var xi, yi, xj, yj;
      var mx, my;
      var i, il;
      for ( i = 1, il = pointCount - 2; i < il; i++ ) {
        xi = points[ 2 * i ];
        yi = points[ 2 * i + 1 ];
        xj = points[ 2 * ( i + 1 ) ];
        yj = points[ 2 * ( i + 1 ) + 1 ];

        mx = 0.5 * ( xi + xj );
        my = 0.5 * ( yi + yj );

        ctx.quadraticCurveTo( xi, yi, mx, my );
      }

      xi = points[ 2 * i ];
      yi = points[ 2 * i + 1 ];
      xj = points[ 2 * ( i + 1 ) ];
      yj = points[ 2 * ( i + 1 ) + 1 ];

      ctx.quadraticCurveTo( xi, yi, xj, yj );
    },

    pointCount: function() {
      return 0.5 * this.get( 'points' ).length;
    }
  });

  Path.Interpolation = Interpolation;

  return Path;
});
