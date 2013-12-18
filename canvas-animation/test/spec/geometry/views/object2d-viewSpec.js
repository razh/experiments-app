/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var $ = require( 'jquery' );

  var Object2DView = require( 'geometry/views/object2d-view' );
  var Object2D = require( 'geometry/models/object2d' );

  describe( 'Object2DView', function() {
    var object, objectView;

    beforeEach(function() {
      object = new Object2D();
      objectView = new Object2DView({
        el: $( '<div>' ),
        model: object
      });

      objectView.render();
    });

    it( 'has fill and stroke subviews and elements', function() {
      var fillEl = objectView.$( '.fill' )[0];
      expect( objectView.$( '.fill' ).length ).toBe(1);
      // The contents of the fill element found by jQuery are the same
      // as the contents of the child fillView.
      expect( fillEl.innerHTML ).toBe( objectView.fillView.el.innerHTML );

      var strokeEl = objectView.$( '.stroke' )[0];
      expect( objectView.$( '.stroke' ).length ).toBe(1);
      expect( strokeEl.innerHTML ).toBe( objectView.strokeView.el.innerHTML );
    });

    it( 'inputs to fill and stroke subviews update the model', function() {
      objectView.$( '.fill input[type=text]' ).val( '#342' ).trigger( 'change' );
      expect( object.get( 'fill' ).hexString() ).toBe( '#334422' );

      objectView.$( '.stroke input[type=text]' ).val( '#f8d' ).trigger( 'change' );
      expect( object.get( 'stroke' ).hexString() ).toBe( '#ff88dd' );

      objectView.$( '.stroke #red' ).val( 255 ).trigger( 'change' );
      objectView.$( '.stroke #green' ).val( 0 ).trigger( 'change' );
      objectView.$( '.stroke #blue' ).val( 68 ).trigger( 'change' );
      expect( object.get( 'stroke' ).hexString() ).toBe( '#ff0044' );
    });

    it( 'changes to nested fill and stroke objects update the view', function() {
      Object2D.colorProperties.forEach(function( property ) {
        var $propEl = objectView.$( '.' + property + ' input[type=text]' );
        expect( $propEl.val() ).toBe( '#000000' );

        object.get( property ).set({
          red: 255,
          green: 255,
          blue: 255,
          alpha: 1
        });

        expect( $propEl.val() ).toBe( '#ffffff' );
      });
    });
  });
});
