/*globals define*/
define([
  'utils'
], function( Utils ) {
  'use strict';

  function CircleRadiusSelection( model, x, y ) {
    this.model = model;

    var radialPoint = this.worldPosition;
    this.offset = {
      x: radialPoint.x - x || 0,
      y: radialPoint.y - y || 0
    };
  }

  Object.defineProperty( CircleRadiusSelection.prototype, 'worldPosition', {
    get: function() {
      return this.model.toWorld( this.model.get( 'radius' ), 0 );
    },

    set: function( position ) {
      var point = this.model.toLocal( position.x, position.y );
      this.model.set( 'radius', Utils.distance( 0, 0, point.x, point.y ) );
    }
  });

  return CircleRadiusSelection;
});
