/*globals define*/
define(function() {
  'use strict';

  /**
   * Too lazy to implement intended behavior.
   * RectEdgeSelection only translates along the local axis.
   */
  function RectEdgeSelection( model, edge, x, y ) {
    this.model = model;
    this.edge = edge;

    var point = this.model.toWorld( this.model[ this.edge ] );
    this.offset = {
      x: point.x - x || 0,
      y: point.y - y || 0
    };
  }

  // No x and y setters since we need both components to set position.
  Object.defineProperty( RectEdgeSelection.prototype, 'x', {
    get: function() {
      var position = this.worldPosition;
      return this.model.toWorld( position.x, position.y ).x;
    }
  });

  Object.defineProperty( RectEdgeSelection.prototype, 'y', {
    get: function() {
      var position = this.worldPosition;
      return this.model.toWorld( position.x, position.y ).y;
    }
  });

  Object.defineProperty( RectEdgeSelection.prototype, 'worldPosition', {
    get: function() {
      return this.model[ this.edge ];
    },

    set: function( position ) {
      this.model[ this.edge ] = {
        x: position.x + this.offset.x,
        y: position.y + this.offset.y
      };

      this.model.trigger( 'change' );
    }
  });

  return RectEdgeSelection;
});
