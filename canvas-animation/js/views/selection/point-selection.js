/*globals define*/
define(function() {
  'use strict';

  /**
   * Selection container object for a specific point in a model object.
   */
  function PointSelection( model, index, x, y ) {
    this.model = model;
    this.index = index;

    var point = this.worldPosition;
    this.offset = {
      x: point.x - x || 0,
      y: point.y - y || 0
    };
  }

  // WARNING: Unlike other selection objects,
  // x and y are get/set in local coordinates.
  Object.defineProperty( PointSelection.prototype, 'x', {
    get: function() {
      var points = this.model.get( 'points' );
      return points[ 2 * this.index ];
    },

    set: function( x ) {
      var points = this.model.get( 'points' );
      points[ 2 * this.index ] = x;
      this.model.trigger( 'change' );
    }
  });

  Object.defineProperty( PointSelection.prototype, 'y', {
    get: function() {
      var points = this.model.get( 'points' );
      return points[ 2 * this.index + 1 ];
    },

    set: function( y ) {
      var points = this.model.get( 'points' );
      points[ 2 * this.index + 1 ] = y;
      this.model.trigger( 'change' );
    }
  });


  Object.defineProperty( PointSelection.prototype, 'worldPosition', {
    get: function() {
      var points = this.model.get( 'points' );
      var x = points[ 2 * this.index ],
          y = points[ 2 * this.index + 1 ];

      return this.model.toWorld( x, y );
    },

    set: function( position ) {
      var x = position.x + this.offset.x;
      var y = position.y + this.offset.y;

      var points = this.model.get( 'points' );
      var point = this.model.toLocal( x, y );

      points[ 2 * this.index ] = point.x;
      points[ 2 * this.index + 1 ] = point.y;

      this.model.trigger( 'change' );
    }
  });

  return PointSelection;
});
