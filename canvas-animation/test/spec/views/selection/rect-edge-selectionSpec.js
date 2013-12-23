/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var RectEdgeSelection = require( 'views/selection/rect-edge-selection' );
  var Rect = require( 'geometry/models/rect' );

  describe( 'RectEdgeSelection', function() {
    var x, y, width, height;
    var dx, dy;
    var rect;

    beforeEach(function() {
      x = 100;
      y = 20;
      width = 50;
      height = 150;

      dx = 10;
      dy = 20;

      rect = new Rect({
        x: x,
        y: y,
        width: width,
        height: height
      });
    });

    it( 'translating the top edge', function() {
      var top = rect.top;
      // Random offset.
      top.y += Math.random();
      var selection = new RectEdgeSelection( rect, 'top', top.x, top.y );

      top.x += dx;
      top.y += dy;
      selection.worldPosition = top;

      expect( rect.get( 'x' ) ).toBe( x );
      expect( rect.get( 'y' ) ).toBe( y + 0.5 * dy );

      expect( rect.get( 'width' ) ).toBe( width );
      expect( rect.get( 'height' ) ).toBe( height - dy );
    });

    it( 'translating the bottom edge', function() {
      var bottom = rect.bottom;
      bottom.y += Math.random();
      var selection = new RectEdgeSelection( rect, 'bottom', bottom.x, bottom.y );

      bottom.x += dx;
      bottom.y += dy;
      selection.worldPosition = bottom;

      expect( rect.get( 'x' ) ).toBe( x );
      expect( rect.get( 'y' ) ).toBe( y + 0.5 * dy );

      expect( rect.get( 'width' ) ).toBe( width );
      expect( rect.get( 'height' ) ).toBe( height + dy );
    });

    it( 'translating the left edge', function() {
      var left = rect.left;
      left.x += Math.random();
      var selection = new RectEdgeSelection( rect, 'left', left.x, left.y );

      left.x += dx;
      left.y += dy;
      selection.worldPosition = left;

      expect( rect.get( 'x' ) ).toBe( x + 0.5 * dx );
      expect( rect.get( 'y' ) ).toBe( y );

      expect( rect.get( 'width' ) ).toBe( width - dx );
      expect( rect.get( 'height' ) ).toBe( height );
    });

    it( 'translating the right edge', function() {
      var right = rect.right;
      right.x += Math.random();
      var selection = new RectEdgeSelection( rect, 'right', right.x, right.y );

      right.x += dx;
      right.y += dy;
      selection.worldPosition = right;

      expect( rect.get( 'x' ) ).toBe( x + 0.5 * dx );
      expect( rect.get( 'y' ) ).toBe( y );

      expect( rect.get( 'width' ) ).toBe( width + dx );
      expect( rect.get( 'height' ) ).toBe( height );
    });
  });
});
