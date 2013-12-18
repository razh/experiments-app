/*globals define, describe, it, expect*/
define(function( require ) {
  'use strict';

  var Color = require( 'models/color' );

  describe( 'Color', function() {
    it( 'constructor can take an array of values as a parameter', function() {
      var color = new Color([ 16, 23, 42, 0.2 ]);
      expect( color.get( 'red' ) ).toBe( 16 );
      expect( color.get( 'green' ) ).toBe( 23 );
      expect( color.get( 'blue' ) ).toBe( 42 );
      expect( color.get( 'alpha' ) ).toBe( 0.2 );
    });

    it( 'constructor array parameter can have fewer/more values than just rgba', function() {
      var color = new Color([ 0, 1, 2, 1, 4, 5, 5 ]);
      expect( color.keys().length ).toBe(4);
      expect( color.keys() ).toEqual([ 'red', 'green', 'blue', 'alpha' ]);

      color = new Color([ 20, 30 ]);
      expect( color.get( 'red' ) ).toBe( 20 );
      expect( color.get( 'green' ) ).toBe( 30 );
      expect( color.get( 'blue' ) ).toBe( 0 );
      expect( color.get( 'alpha' ) ).toBe( 0 );
      expect( color.keys().length ).toBe(4);
    });

    it( 'cosntructor can still take an attrs object', function() {
      var color = new Color({
        red: 86,
        green: 215,
        blue: 99,
        alpha: 0.3
      });

      expect( color.get( 'red' ) ).toBe( 86 );
      expect( color.get( 'green' ) ).toBe( 215 );
      expect( color.get( 'blue' ) ).toBe( 99 );
      expect( color.get( 'alpha' ) ).toBe( 0.3 );
    });
  });
});
