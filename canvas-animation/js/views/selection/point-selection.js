/*globals define*/
define(function() {
  'use strict';

  /**
   * Selection container object for a specific point in a Path object.
   */
  function PointSelection( path, index, x, y ) {
    this.path = path;
    this.index = index;

    this.offset = {
      x: this.x - x || 0,
      y: this.y - y || 0
    };
  }

  Object.defineProperty( PointSelection.prototype, 'x', {
    get: function() {
      var points = this.path.get( 'points' );
      return points[ 2 * this.index ];
    },

    set: function( x ) {
      var points = this.path.get( 'points' );
      points[ 2 * this.index ] = x + this.offset.x;
      this.path.trigger( 'change' );
    }
  });

  Object.defineProperty( PointSelection.prototype, 'y', {
    get: function() {
      var points = this.path.get( 'points' );
      return points[ 2 * this.index + 1 ];
    },

    set: function( y ) {
      var points = this.get( 'points' );
      points[ 2 * this.index + 1 ] = y + this.offset.y;
      this.path.trigger( 'change' );
    }
  });

  return PointSelection;
});
