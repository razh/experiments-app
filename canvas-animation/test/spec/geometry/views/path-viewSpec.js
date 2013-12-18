/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var $ = require( 'jquery' );

  var PathView = require( 'geometry/views/path-view' );
  var Path = require( 'geometry/models/path' );

  describe( 'PathView', function() {
    var path, pathView;
    var points = [
      -100, -100,
      100, -100,
      100, 100,
      -100, 100
    ];

    beforeEach(function() {
      path = new Path();
      pathView = new PathView({
        el: $( '<div>' ),
        model: path
      });

      pathView.render();
    });

    it( 'each coordinate gets its own input', function() {
      expect( pathView.$( '.coordinate' ).length ).toBe(0);
      expect( pathView.renderedPointCount ).toBe(0);

      path.set( 'points', points );

      expect( pathView.$( '.coordinate' ).length ).toBe( points.length );
      expect( pathView.renderedPointCount ).toBe( path.pointCount );
    });

    it( 'coordinate inputs update the model', function() {
      path.set( 'points', points );

      pathView.$( 'input[data-index=2][data-axis=0]' ).val(5).trigger( 'change' );
      expect( path.get( 'points' )[ 2 * 2 ] ).toBe(5);

      pathView.$( 'input[data-index=2][data-axis=1]' ).val(8).trigger( 'change' );
      expect( path.get( 'points' )[ 2 * 2 + 1  ] ).toBe(8);
    });

    it( 'points changes update view values (need to trigger change events)', function() {
      path.set( 'points', points );

      var $x0El = pathView.$( '.coordinate' ).eq(0);
      expect( parseFloat( $x0El.val() ) ).toBe( -100 );

      points[0] = 200;
      expect( parseFloat( $x0El.val() ) ).toBe( -100 );

      path.trigger( 'change' );
      expect( parseFloat( $x0El.val() ) ).toBe( 200 );
    });
  });
});
