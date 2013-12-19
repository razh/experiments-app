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

    var edgePoint = this.worldPosition;
    this.offset = {
      x: edgePoint.x - x || 0,
      y: edgePoint.y - y || 0
    };
  }

  // No x and y setters since we need both components to set position.
  Object.defineProperty( RectEdgeSelection.prototype, 'x', {
    get: function() {
      return this.worldPosition.x;
    }
  });

  Object.defineProperty( RectEdgeSelection.prototype, 'y', {
    get: function() {
      return this.worldPosition.y;
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
