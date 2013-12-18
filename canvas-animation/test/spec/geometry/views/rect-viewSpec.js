/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var $ = require( 'jquery' );

  var RectView = require( 'geometry/views/rect-view' );
  var Rect = require( 'geometry/models/rect' );

  describe( 'RectView', function() {
    var rect, rectView;

    beforeEach(function() {
      rect = new Rect();
      rectView = new RectView({
        el: $( '<div>' ),
        model: rect
      });

      rectView.render();
    });

    it( 'width and height input changes update the model', function() {
      [ 'width', 'height' ].forEach(function( dimension ) {
        var $dimensionEl = rectView.$( '#' + dimension );
        $dimensionEl.val( 100 * Math.random() ).trigger( 'change' );
        expect( rect.get( dimension ) ).toBe( parseFloat( $dimensionEl.val() ) );
      });
    });
  });
});
