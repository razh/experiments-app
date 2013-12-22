/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var RectEdgeSelection = require( 'views/rect-edge-selection' );
  var Rect = require( 'geometry/models/rect' );

  describe( 'RectEdgeSelection', function() {
    var rect;

    beforeEach(function() {
      rect = new Rect({
        x: 100,
        y: 20,
        width: 50,
        height: 100
      });
    });

    it( '', function() {
      var selection = new RectEdgeSelection( rect, 'top' );
      expect( selection.model ).toBe( rect );
    });
  });
});
