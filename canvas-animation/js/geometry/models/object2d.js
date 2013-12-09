/*globals define*/
define([
  'backbone'
], function( Backbone ) {
  'use strict';

  var Object2D = Backbone.Model.extend({
    defaults: function() {
      return {
        x: 0,
        y: 0,
        angle: 0
      };
    }
  });

  return Object2D;
});
