/*globals define*/
define([
  'underscore',
  'backbone',
  'utils'
], function( _, Backbone, Utils ) {
  'use strict';

  var Color = Backbone.Model.extend({
    defaults: function() {
      return {
        red:   0,
        green: 0,
        blue:  0,
        alpha: 0
      };
    },

    constructor: function() {
      var args = [].slice.call( arguments ),
          attributes = args.shift();

      if ( _.isArray( attributes ) ) {
        args.unshift({});
        Backbone.Model.apply( this, args );

        this.set( _.defaults({
          red:   attributes[0],
          green: attributes[1],
          blue:  attributes[2],
          alpha: attributes[3]
        }, this.attributes ));
      } else {
        Backbone.Model.apply( this, arguments );
      }
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
