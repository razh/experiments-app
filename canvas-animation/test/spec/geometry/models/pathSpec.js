/*globals define, describe, beforeEach, it, expect, ctx*/
define(function( require ) {
  'use strict';

  var Utils = require( 'utils' );

  var Path = require( 'geometry/models/path' );

  describe( 'Path', function() {
    var path;
    var points = [
      -100, -100,
      100, -100,
      100, 100,
      -100, 100
    ];

    beforeEach(function() {
      ctx.calls = [];

      path = new Path({
        points: points,
        closed: false,
        interpolation: 'linear'
      });
    });

    it( 'open linear drawing', function() {
      path.drawPath( ctx );

      // beginPath, moveTo, than 3 lineTos to all points but first.
      expect( ctx.calls.length ).toBe(5);
      expect( ctx.calls[0] ).toEqual( [ 'beginPath' ] );
      expect( ctx.calls[1] ).toEqual( [ 'moveTo', points[0], points[1] ] );
      expect( ctx.calls[4] ).toEqual( [ 'lineTo', points[6], points[7] ] );
    });

    it( 'closed linear drawing', function() {
      path.set( 'closed', true );
      path.drawPath( ctx );

      // beginPath, moveTo, then 4 lineTos to all points.
      expect( ctx.calls.length ).toBe(6);
      expect( ctx.calls[5] ).toEqual( [ 'lineTo', points[0], points[1] ] );
    });

    it( 'open quadratic drawing', function() {
      path.set( 'interpolation', 'quadratic' );
      path.drawPath( ctx );

      // beginPath, moveTo, a midpoint, then curve to last point.
      expect( ctx.calls.length ).toBe(4);
      expect( ctx.calls[2] ).toEqual([
        'quadraticCurveTo',
        points[2],
        points[3],
        0.5 * ( points[2] + points[4] ),
        0.5 * ( points[3] + points[5] )
      ]);

      // Last curve.
      expect( ctx.calls[3] ).toEqual([
        'quadraticCurveTo',
        points[4],
        points[5],
        points[6],
        points[7]
      ]);
    });

    it( 'closed quadratic drawing', function() {
      path.set({
        closed: true,
        interpolation: 'quadratic'
      });
      path.drawPath( ctx );

      // Intial midpoint.
      var mx0 = 0.5 * ( points[0] + points[2] );
      var my0 = 0.5 * ( points[1] + points[3] );

      // beginPath, moveTo, and all 4 midpoints
      expect( ctx.calls.length ).toBe(6);
      // Start at initial midpoint.
      expect( ctx.calls[1] ).toEqual([ 'moveTo', mx0, my0 ]);
      // End at initial midpoint.
      expect( ctx.calls[5] ).toEqual([
        'quadraticCurveTo',
        points[0],
        points[1],
        mx0,
        my0
      ]);
    });

    it( 'getWorldPoints() transforms path points to world space', function() {
      var x = 60,
          y = 40,
          scaleX = 10,
          scaleY = 2,
          angle = 90 * Utils.DEG_TO_RAD;

      path.set({
        x: x,
        y: y,
        scaleX: scaleX,
        scaleY: scaleY,
        angle: angle
      });

      var worldPoints = path.getWorldPoints();
      expect( worldPoints[0] ).toBeCloseTo( points[1] * scaleY + x );
      expect( worldPoints[1] ).toBeCloseTo( -points[0] * scaleX + y );
    });

    it( 'computeCentroid()', function() {
      var centroid = path.computeCentroid();
      expect( centroid.x ).toBe(0);
      expect( centroid.y ).toBe(0);
    });
  });
});
