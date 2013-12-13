/*globals define*/
define(function() {
  'use strict';

  /**
   * Selection container object for a specific point in a model object.
   */
  function PointSelection( model, index, x, y ) {
    this.model = model;
    this.index = index;

    var point = this.model.toWorld( this.x, this.y );
    this.offset = {
      x: point.x - x || 0,
      y: point.y - y || 0
    };
  }

  // x and y are in local coordinates.
  Object.defineProperty( PointSelection.prototype, 'x', {
    get: function() {
      var points = this.model.get( 'points' );
      return points[ 2 * this.index ];
    },

    set: function( x ) {
      var points = this.model.get( 'points' );
      points[ 2 * this.index ] = x + this.offset.x;
    }
  });

  Object.defineProperty( PointSelection.prototype, 'y', {
    get: function() {
      var points = this.model.get( 'points' );
      return points[ 2 * this.index + 1 ];
    },

    set: function( y ) {
      var points = this.model.get( 'points' );
      points[ 2 * this.index + 1 ] = y + this.offset.y;
    }
  });


  Object.defineProperty( PointSelection.prototype, 'worldPosition', {
    get: function() {
      return this.model.toWorld( this.x, this.y );
    },

    set: function( position ) {
      var x = position.x + this.offset.x;
      var y = position.y + this.offset.y;

      var point = this.model.toLocal( x, y );
      this.x = point.x;
      this.y = point.y;

      this.model.trigger( 'change' );
    }
  });

  return PointSelection;
});
