/*globals define, describe, beforeEach, it, expect, ctx, ctxSpy*/
define(function( require ) {
  'use strict';

  var _ = require( 'underscore' );

  var Utils = require( 'utils' );
  var Object2D = require( 'geometry/models/object2d' );

  describe( 'Object2D', function() {
    beforeEach(function() {
      // Reset Jasmine spy.
      _.functions( ctxSpy ).forEach(function( functionName ) {
        ctxSpy[ functionName ].reset();
      });
    });

    it( 'applies canvas transformations', function() {
      // No transforms.
      var object = new Object2D();

      object.applyTransform( ctxSpy );

      expect( ctxSpy.translate ).not.toHaveBeenCalled();
      expect( ctxSpy.scale ).not.toHaveBeenCalled();
      expect( ctxSpy.rotate ).not.toHaveBeenCalled();

      var x = 100;
      var y = 150;
      var scaleX = 2;
      var scaleY = 0.4;
      var angle = 30 * Utils.DEG_TO_RAD;

      // Add transforms.
      object.set({
        x: x,
        y: y,
        scaleX: scaleX,
        scaleY: scaleY,
        angle: angle
      });

      object.applyTransform( ctxSpy );
      expect( ctxSpy.translate ).toHaveBeenCalledWith( x, y );
      expect( ctxSpy.scale ).toHaveBeenCalledWith( scaleX, scaleY );
      expect( ctxSpy.rotate ).toHaveBeenCalledWith( -angle );
    });

    it( 'toLocal transforms world points to local coordinate space', function() {
      var x = 20,
          y = 30,
          scaleX = 2,
          angle = 90 * Utils.DEG_TO_RAD;

      var object = new Object2D({
        x: x,
        y: y,
        scaleX: scaleX,
        angle: angle
      });

      // Point at origin.
      var point = object.toLocal( x, y );
      expect( point.x ).toBe(0);
      expect( point.y ).toBe(0);

      // Negative Y rotated -90 degrees becomes positive x.
      // Check scaleX of 2.
      point = object.toLocal( x, y - 20 );
      expect( point.x ).toBeCloseTo( 10 );
      expect( point.y ).toBeCloseTo( 0 );
    });

    it( 'toLocal is the inverse of toWorld', function() {
      var object = new Object2D({
        x: 200,
        y: -100,
        scaleX: 20,
        scaleY: 0.3,
        angle: 120 * Utils.DEG_TO_RAD
      });


      var x = 245,
          y = -20;

      var point = object.toLocal( x, y );
      point = object.toWorld( point.x, point.y );
      expect( point.x ).toBeCloseTo( x );
      expect( point.y ).toBeCloseTo( y );
    });
  });
});
