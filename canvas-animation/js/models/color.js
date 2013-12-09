/*globals define*/
define([
  'backbone'
], function( Backbone ) {
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
        this.get( 'red'   ) + ', ' +
        this.get( 'green' ) + ', ' +
        this.get( 'blue'  ) + ', ' +
        this.get( 'alpha' ) +
      ')';
    }
  });

  return Color;
});
