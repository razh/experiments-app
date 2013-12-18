/*globals define*/
define(function( require ) {
  'use strict';

  var Backbone = require( 'backbone' );

  var Object2D = require( 'geometry/models/object2d' );
  var Arc = require( 'geometry/models/arc' );
  var Circle = require( 'geometry/models/circle' );
  var Path = require( 'geometry/models/path' );
  var Rect = require( 'geometry/models/rect' );

  var Group = Backbone.Collection.extend({
    model: function( attrs, options ) {
      if ( attrs.startAngle ) {
        return new Arc( attrs, options );
      } else if ( attrs.radius ) {
        return new Circle( attrs, options );
      } else if ( attrs.points ) {
        return new Path( attrs, options );
      } else if ( attrs.width ) {
        return new Rect( attrs, options );
      }

      return new Object2D( attrs, options );
    },
  });

  return Group;
});
