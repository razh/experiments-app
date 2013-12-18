/*globals define, describe, it, expect*/
define(function() {
  'use strict';

  var Path = require( 'geometry/models/path' );

  describe( 'Path', function() {
    it( 'open linear drawing', function() {
      var path = new Path();
      expect( path instanceof Path ).toBe( true );
    });
  });
});
