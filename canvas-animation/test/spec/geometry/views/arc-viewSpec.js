/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var ctxSpy = require( 'canvas-spy' ).ctxSpy;

  var $ = require( 'jquery' );

  var ArcView = require( 'geometry/views/arc-view' );
  var Arc = require( 'geometry/models/arc' );

  describe( 'ArcView', function() {
    var arc, arcView;

    beforeEach(function() {
      ctxSpy.reset();

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
        $angleEl.val( value ).trigger( 'input' );
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

    it( 'closed checkbox input determines if drawn path is closed', function() {
      var $closedEl = arcView.$( '#closed' );

      $closedEl.prop( 'checked', false ).trigger( 'change' );
      expect( arc.get( 'closed' ) ).toBe( false );
      arc.drawPath( ctxSpy );
      expect( ctxSpy.closePath ).not.toHaveBeenCalled();

      $closedEl.prop( 'checked', true ).trigger( 'change' );
      expect( arc.get( 'closed' ) ).toBe( true );
      arc.drawPath( ctxSpy );
      expect( ctxSpy.closePath ).toHaveBeenCalled();
    });

    it( 'anticlockwise/closed attribute changes update view values', function() {
      [ 'anticlockwise', 'closed' ].forEach(function( attr ) {
        var $attrEl = arcView.$( '#' + attr );
        arc.set( attr, false );
        expect( $attrEl.prop( 'checked' ) ).toBe( false );

        arc.set( attr, true );
        expect( $attrEl.prop( 'checked' ) ).toBe( true );
      });
    });
  });
});
