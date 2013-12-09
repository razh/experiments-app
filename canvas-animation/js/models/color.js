/*globals define*/
define([
  'backbone',
  'utils'
], function( Backbone, Utils ) {
  'use strict';

  var Color = Backbone.Model.extend({
    defaults: function() {
      return {
        red:   0,
        green: 0,
        blue:  0,
        alpha: 1
      };
    },

    rgba: function() {
      return 'rgba(' +
        Utils.clamp( Math.round( this.get( 'red'   ) ), 0, 255 ) + ', ' +
        Utils.clamp( Math.round( this.get( 'green' ) ), 0, 255 ) + ', ' +
        Utils.clamp( Math.round( this.get( 'blue'  ) ), 0, 255 ) + ', ' +
        Utils.clamp( this.get( 'alpha' ), 0, 1 ) +
      ')';
    }
  });

  return Color;
});
