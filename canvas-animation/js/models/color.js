/*jshint bitwise:false*/
/*globals define*/
define([
  'underscore',
  'backbone',
  'utils'
], function( _, Backbone, Utils ) {
  'use strict';

  var hexRegex = /([a-f\d])/gi;

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

    /**
     * hexString can be any string that has 3 or 6 hexadecimal characters.
     */
    setHexString: function( hexString ) {
      if ( !_.isString( hexString ) ) {
        return;
      }

      var hex = hexString.match( hexRegex );
      if ( !hex || ( hex.length !== 3 && hex.length !== 6 ) ) {
        return;
      }

      // Handle shorthand: #f43 -> $ff4433.
      if ( hex.length === 3 ) {
        hex[0] += hex[0];
        hex[1] += hex[1];
        hex[2] += hex[2];
      }

      if ( hex.length === 6 ) {
        hex[0] = hex[0] + hex[1];
        hex[1] = hex[2] + hex[3];
        hex[2] = hex[4] + hex[5];
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
