/*globals define, describe, beforeEach, it, expect*/
define(function( require ) {
  'use strict';

  var $ = require( 'jquery' );

  describe( 'ColorView', function() {
    var ColorView = require( 'views/color-view' );
    var Color = require( 'models/color' );

    var model, view;

    beforeEach(function() {
      model = new Color();
      view = new ColorView({
        el: $( '<div>' ),
        model: model
      });
    });

    it( 'view values are equal to the model', function() {
      view.render();

      [ 'red', 'green', 'blue', 'alpha' ].forEach(function( component ) {
        expect( model.get( component ) ).toBe( parseFloat( view.$( '#' + component ).val() ) );
      });
    });
  });
});
