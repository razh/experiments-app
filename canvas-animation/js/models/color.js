/*globals define*/
define([
  'underscore',
  'backbone',
  'utils'
], function( _, Backbone, Utils ) {
  'use strict';

  var hexRegex = /([a-f\d]{2})/gi;

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
      var args = _.toArray( arguments ),
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
    },

    hexString: function() {
      return '#' + ( ( 1 << 24 ) + this.hex() ).toString( 16 ).slice(1);
    },

    hex: function() {
      return ( Math.round( this.get( 'red'   ) ) << 16 ) +
             ( Math.round( this.get( 'green' ) ) <<  8 ) +
               Math.round( this.get( 'blue'  ) );
    },

    setHexString: function( hexString ) {
      var hex = hexString.match( hexRegex );
      if ( hex.length !== 3 ) {
        return;
      }

      this.set({
        red:   parseInt( hex[0], 16 ),
        green: parseInt( hex[1], 16 ),
        blue:  parseInt( hex[2], 16 )
      });
    }
  });

  return Color;
});
