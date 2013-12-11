/*globals define*/
define([
  'geometry/models/object2d',
  'utils'
], function( Object2D, Utils ) {
  'use strict';

  var PI2 = Utils.PI2;

  var Interpolation = {
    LINEAR:    0,
    QUADRATIC: 1
  };

  var Path = Object2D.extend({
    defaults: function() {
      var defaults = Object2D.prototype.defaults();
      defaults.points = [];
      defaults.closed = false;
      defaults.interpolation = Interpolation.LINEAR;
      return defaults;
    },

    drawPath: function( ctx ) {
      this.drawPoints( ctx );
      this.drawCentroid( ctx );

      var interpolation = this.get( 'interpolation' ),
          closed = this.get( 'closed' );

      if ( interpolation === Interpolation.LINEAR ) {
        this.drawLinear( ctx );
      } else if ( interpolation === Interpolation.QUADRATIC ) {
        if ( closed ) {
          this.drawQuadraticClosed( ctx );
        } else {
          this.drawQuadratic( ctx );
        }
      }
    },

    getWorldPoints: function() {
      var pointCount = this.pointCount();
      // Shallow copy of points.
      var points = this.get( 'points' ).slice();

      var point;
      var x, y;
      for ( var i = 0; i < pointCount; i++ ) {
        x = points[ 2 * i ];
        y = points[ 2 * i + 1 ];

        point = this.toWorld( x, y );
        points[ 2 * i ] = point.x;
        points[ 2 * i + 1 ] = point.y;
      }

      return points;
    },

    drawPoints: function( ctx ) {
      var pointCount = this.pointCount();
      var points = this.get( 'points' );

      ctx.beginPath();

      var x, y;
      for ( var i = 0; i < pointCount; i++ ) {
        x = points[ 2 * i ];
        y = points[ 2 * i + 1 ];
        ctx.moveTo( x, y );
        ctx.arc( x, y, 6, 0, PI2 );
      }

      ctx.fillStyle = 'red';
      ctx.fill();
    },

    drawCentroid: function( ctx ) {
      var centroid = this.computeCentroid();

      ctx.beginPath();
      ctx.arc( centroid.x, centroid.y, 10, 0, PI2 );
      ctx.fillStyle = 'red';
      ctx.fill();
    },

    drawLinear: function( ctx ) {
      var pointCount = this.pointCount();
      var points = this.get( 'points' );

      ctx.beginPath();
      ctx.moveTo( points[0], points[1] );

      var x, y;
      for ( var i = 1; i < pointCount; i++ ) {
        x = points[ 2 * i ];
        y = points[ 2 * i + 1 ];
        ctx.lineTo( x, y );
      }

      if ( this.get( 'closed' ) ) {
        ctx.lineTo( points[0], points[1] );
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

    drawQuadraticClosed: function( ctx ) {
      var pointCount = this.pointCount();
      var points = this.get( 'points' );

      ctx.beginPath();

      // Draw nothing if degenerate.
      if ( pointCount < 2 ) {
        ctx.closePath();
        return;
      }

      var xi, yi, xj, yj;
      var mx, my;

      // Draw initial midpoint.
      xi = points[0];
      yi = points[1];
      xj = points[2];
      yj = points[3];

      mx = 0.5 * ( xi + xj );
      my = 0.5 * ( yi + yj );

      ctx.moveTo( mx, my );

      // Draw path (connects all midpoints).
      var index;
      var i, il;
      for ( i = 1, il = pointCount + 1; i < il; i++ ) {
        // For i >= pointCount.
        index = i % pointCount;

        // (xj, yj) modulo is for i + 1 >= pointCount, where (xi, yi) would be
        // the last point.
        xi = points[ 2 * index ];
        yi = points[ 2 * index + 1 ];
        xj = points[ 2 * ( ( index + 1 ) % pointCount ) ];
        yj = points[ 2 * ( ( index + 1 ) % pointCount ) + 1 ];

        mx = 0.5 * ( xi + xj );
        my = 0.5 * ( yi + yj );

        ctx.quadraticCurveTo( xi, yi, mx, my );
      }
    },

    computeCentroid: function() {
      var pointCount = this.pointCount();
      var points = this.get( 'points' );

      // Centroid.
      var x = 0,
          y = 0;

      var area = 0;
      var x0 = 0,
          y0 = 0;

      var third = 1 / 3;

      var triangleArea;
      var x1, y1, x2, y2;
      var dx0, dy0, dx1, dy1;
      for ( var i = 0; i < pointCount; i++ ) {
        x1 = points[ 2 * i ];
        y1 = points[ 2 * i + 1 ];
        x2 = points[ 2 * ( ( i + 1 ) % pointCount ) ];
        y2 = points[ 2 * ( ( i + 1 ) % pointCount ) + 1 ];

        dx0 = x1 - x0;
        dy0 = y1 - x0;
        dx1 = x2 - x1;
        dy1 = y2 - y1;

        // Half the 2D 'cross product'.
        triangleArea = 0.5 * ( dx0 * dy1 - dx1 * dy0 );

        area += triangleArea;
        x += triangleArea * third * ( x0 + x1 + x2 );
        y += triangleArea * third * ( y0 + y1 + y2 );
      }

      return {
        x: x / area,
        y: y / area
      };
    },

    pointCount: function() {
      return 0.5 * this.get( 'points' ).length;
    }
  });

  Path.Interpolation = Interpolation;

  return Path;
});
