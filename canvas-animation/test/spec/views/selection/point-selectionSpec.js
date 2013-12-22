/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var PointSelection = require( 'views/selection/point-selection' );
  var Path = require( 'geometry/models/path' );

  describe( 'PointSelection', function() {
    var path, points;

    beforeEach(function() {
      points = [
        -100, -100,
        100, -100,
        100, 100,
        -100, 100
      ];

      path = new Path({
        points: points
      });
    });

    it( 'selection targets a specific point in the path', function() {
      // Mouse position.
      var x = 20;
      var y = -30;

      // Mouse movement.
      var dx = -15;
      var dy = 10;

      var selection = new PointSelection(
        path, 1,
        x, y
      );

      var point = {
        x: points[ 2 * 1 ],
        y: points[ 2 * 1 + 1 ]
      };

      expect( selection.offset.x ).toBe( point.x - x );
      expect( selection.offset.y ).toBe( point.y - y );

      expect( selection.worldPosition ).toEqual( point );

      // Move the selection by (dx, dy).
      selection.worldPosition = {
        x: x + dx,
        y: y + dy
      };

      expect( selection.worldPosition ).toEqual({
        x: point.x + dx,
        y: point.y + dy
      });

      // Check that it changes the oriinal points array.
      expect( points ).toEqual([
        -100, -100,
        point.x + dx, point.y + dy,
        100, 100,
        -100, 100
      ]);
    });
  });
});
