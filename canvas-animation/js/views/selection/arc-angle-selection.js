/*globals define*/
define(function() {
  'use strict';

  function ArcAngleSelection( model, angle, x, y ) {
    this.model = model;
    // Start or end.
    this.angle = angle;

    var point = this.worldPosition;
    this.offset = {
      x: point.x - x || 0,
      y: point.y - y || 0
    };
  }

  Object.defineProperty( ArcAngleSelection.prototype, 'x', {
    get: function() {
      return this.worldPosition.x;
    }
  });

  Object.defineProperty( ArcAngleSelection.prototype, 'y',  {
    get: function() {
      return this.worldPosition.y;
    }
  });

  Object.defineProperty( ArcAngleSelection.prototype, 'worldPosition', {
    get: function() {
      return this.model[ this.angle ];
    },

    set: function( position ) {
      this.model[ this.angle ] = {
        x: position.x + this.offset.x,
        y: position.y + this.offset.y
      };
    }
  });

  return ArcAngleSelection;
});
