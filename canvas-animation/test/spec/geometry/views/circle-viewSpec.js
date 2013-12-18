/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var $ = require( 'jquery' );

  var CircleView = require( 'geometry/views/circle-view' );
  var Circle = require( 'geometry/models/circle' );

  describe( 'CircleView', function() {
    var circle, circleView;

    beforeEach(function() {
      circle = new Circle();
      circleView = new CircleView({
        el: $( '<div>' ),
        model: circle
      });

      circleView.render();
    });

    it( 'radius input updates the model', function() {
      var $radiusEl = circleView.$( '#radius' );
      $radiusEl.val( 20 ).trigger( 'change' );
      expect( circle.get( 'radius' ) ).toBe( 20 );
    });

    it( 'radius changes update the view value', function() {
      circle.set( 'radius', 8 );
      expect( parseFloat( circleView.$( '#radius' ).val() ) ).toBe(8);
    });
  });
});
