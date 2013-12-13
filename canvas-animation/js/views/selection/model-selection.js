/*globals define*/
define(function() {
  'use strict';

  /**
   * Selection container object for a Backbone model with x and y attributes.
   */
  function ModelSelection( model, x, y ) {
    this.model = model;
    this.offset = {
      x: this.x - x || 0,
      y: this.y - y || 0
    };
  }

  Object.defineProperty( ModelSelection.prototype, 'x', {
    get: function() {
      return this.model.get( 'x' );
    },

    set: function( x ) {
      this.model.set( 'x', x + this.offset.x );
    }
  });

  Object.defineProperty( ModelSelection.prototype, 'y', {
    get: function() {
      return this.model.get( 'y' );
    },

    set: function( y ) {
      this.model.set( 'y', y + this.offset.y );
    }
  });

  return ModelSelection;
});
