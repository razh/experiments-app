/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var $ = require( 'jquery' );

  var ColorView = require( 'views/color-view' );
  var Color = require( 'models/color' );

  describe( 'ColorView', function() {
    var model, view;

    beforeEach(function() {
      model = new Color();
      view = new ColorView({
        el: $( '<div>' ),
        model: model
      });

      view.render();
    });

    it( 'view values are equal to the model', function() {
      [ 'red', 'green', 'blue', 'alpha' ].forEach(function( component ) {
        expect( model.get( component ) ).toBe( parseFloat( view.$( '#' + component ).val() ) );
      });
    });

    it( 'changes to view numeric inputs affects the model', function() {
      view.$( '#red' ).val( 255 ).trigger( 'change' );
      expect( model.get( 'red' ) ).toBe( 255 );
    });

    it( 'hex string inputs update the model', function() {
      // Three hex.
      view.$( 'input[type=text]' ).val( 'fff' ).trigger( 'change' );
      expect( model.get( 'red' ) ).toBe( 255 );
      expect( model.get( 'green' ) ).toBe( 255 );
      expect( model.get( 'blue' ) ).toBe( 255 );

      // Three hex with pound symbol.
      view.$( 'input[type=text]' ).val( '#000' ).trigger( 'change' );
      expect( model.get( 'red' ) ).toBe( 0 );
      expect( model.get( 'green' ) ).toBe( 0 );
      expect( model.get( 'blue' ) ).toBe( 0 );

      // Six hex.
      view.$( 'input[type=text]' ).val( '0f0' ).trigger( 'change' );
      expect( model.get( 'red' ) ).toBe( 0 );
      expect( model.get( 'green' ) ).toBe( 255 );
      expect( model.get( 'blue' ) ).toBe( 0 );

      // Six hex with pound symbol.
      view.$( 'input[type=text]' ).val( '#242' ).trigger( 'change' );
      expect( model.get( 'red' ) ).toBe( 34 );
      expect( model.get( 'green' ) ).toBe( 68 );
      expect( model.get( 'blue' ) ).toBe( 34 );
    });

    it( 'model updates change view values', function() {
      model.set({
        red: 68,
        green: 34,
        blue: 34
      });

      [ 'red', 'green', 'blue', 'alpha' ].forEach(function( component ) {
        expect( view.$( '#' + component ).val() ).toBe( model.get( component ).toString() );
      });

      expect( view.$( 'input[type=text]' ).val() ).toBe( '#442222' );
    });
  });
});
