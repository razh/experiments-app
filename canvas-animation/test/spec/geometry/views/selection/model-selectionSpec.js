/*globals define, describe, it, expect, beforeEach*/
define(function( require ) {
  'use strict';

  var Object2D = require( 'geometry/models/object2d' );
  var ModelSelection = require( 'views/selection/model-selection' );

  describe( 'ModelSelection', function() {
    var object, selection;

    beforeEach(function() {
      object = new Object2D();
      selection = new ModelSelection( object );
    });

    it( 'selection has the object coordinates as properties', function() {
      var x = 20;
      var y = 30;

      object.set({
        x: x,
        y: y
      });

      expect( selection.x ).toBe(x);
      expect( selection.y ).toBe(y);

      expect( selection.worldPosition ).toEqual({
        x: x,
        y: y
      });
    });
  });
});
