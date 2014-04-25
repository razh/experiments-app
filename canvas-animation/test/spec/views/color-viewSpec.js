/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var $ = require( 'jquery' );

  var ColorView = require( 'views/color-view' );
  var Color = require( 'models/color' );

  describe( 'ColorView', function() {
    var color, colorView;

    beforeEach(function() {
      color = new Color();
      colorView = new ColorView({
        el: $( '<div>' ),
        model: color
      });

      colorView.render();
    });

    it( 'view values are equal to the model', function() {
      [ 'red', 'green', 'blue', 'alpha' ].forEach(function( component ) {
        expect( color.get( component ) ).toBe( parseFloat( colorView.$( '#' + component ).val() ) );
      });
    });

    it( 'numeric inputs update the model', function() {
      colorView.$( '#red' ).val( 255 ).trigger( 'input' );
      expect( color.get( 'red' ) ).toBe( 255 );
    });

    it( 'hex string inputs update the model', function() {
      // Three hex.
      colorView.$( 'input[type=text]' ).val( 'fff' ).trigger( 'input' );
      expect( color.get( 'red' ) ).toBe( 255 );
      expect( color.get( 'green' ) ).toBe( 255 );
      expect( color.get( 'blue' ) ).toBe( 255 );

      // Three hex with pound symbol.
      colorView.$( 'input[type=text]' ).val( '#000' ).trigger( 'input' );
      expect( color.get( 'red' ) ).toBe( 0 );
      expect( color.get( 'green' ) ).toBe( 0 );
      expect( color.get( 'blue' ) ).toBe( 0 );

      // Six hex.
      colorView.$( 'input[type=text]' ).val( '00ff00' ).trigger( 'input' );
      expect( color.get( 'red' ) ).toBe( 0 );
      expect( color.get( 'green' ) ).toBe( 255 );
      expect( color.get( 'blue' ) ).toBe( 0 );

      // Six hex with pound symbol.
      colorView.$( 'input[type=text]' ).val( '#224422' ).trigger( 'input' );
      expect( color.get( 'red' ) ).toBe( 34 );
      expect( color.get( 'green' ) ).toBe( 68 );
      expect( color.get( 'blue' ) ).toBe( 34 );
    });

    it( 'model updates change view values', function() {
      color.set({
        red: 68,
        green: 34,
        blue: 34
      });

      [ 'red', 'green', 'blue', 'alpha' ].forEach(function( component ) {
        expect( colorView.$( '#' + component ).val() ).toBe( color.get( component ).toString() );
      });

      expect( colorView.$( 'input[type=text]' ).val() ).toBe( '#442222' );
    });
  });
});
