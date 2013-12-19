/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var $ = require( 'jquery' );

  var ArcView = require( 'geometry/views/arc-view' );
  var Arc = require( 'geometry/models/arc' );

  describe( 'ArcView', function() {
    var arc, arcView;

    beforeEach(function() {
      arc = new Arc();
      arcView = new ArcView({
        el: $( '<div>' ),
        model: arc
      });

      arcView.render();
    });

    it( 'startAngle/endAngle inputs update the model', function() {
      [ 'startAngle', 'endAngle' ].forEach(function( angle ) {
        var $angleEl = arcView.$( '#' + angle );
        var value = Math.random() * Math.PI;
        $angleEl.val( value ).trigger( 'change' );
        expect( arc.get( angle ) ).toBe( value );
      });
    });

    it( 'startAngle/endAngle changes update view values', function() {
      [ 'startAngle', 'endAngle' ].forEach(function( angle ) {
        var $angleEl = arcView.$( '#' + angle );
        var value = Math.random() * Math.PI;
        arc.set( angle, value );
        expect( parseFloat( $angleEl.val() ) ).toBe( value );
      });
    });
  });
});
