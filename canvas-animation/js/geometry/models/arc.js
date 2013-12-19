/*globals define*/
define([
  'geometry/models/circle',
  'utils'
], function( Circle, Utils ) {
  'use strict';

  var PI2 = Utils.PI2;

  var Arc = Circle.extend({
    defaults: function() {
      var defaults = Circle.prototype.defaults();
      defaults.startAngle = 0;
      defaults.endAngle = PI2;
      defaults.anticlockwise = false;
      defaults.closed = false;
      return defaults;
    },

    drawPath: function( ctx ) {
      ctx.beginPath();

      ctx.arc(
        0, 0,
        this.get( 'radius' ),
        this.get( 'startAngle' ),
        this.get( 'endAngle' ),
        this.get( 'anticlockwise' )
      );

      if ( this.get( 'closed' ) ) {
        ctx.closePath();
      }
    }
  });

  Arc.angleNames = [ 'start', 'end' ];

  // start and end are in world space.
  Arc.angleNames.forEach(function( prefix ) {
    var property = prefix + 'Angle';

    Object.defineProperty( Arc.prototype, prefix, {
      get: function() {
        var angle = this.get( property );
        var radius = this.get( 'radius' );

        var cos = 1,
            sin = 0;

        if ( angle ) {
          cos = Math.cos( angle );
          sin = Math.sin( angle );
        }

        return this.toWorld( cos * radius, sin * radius );
      },

      set: function( position ) {
        var point = this.toLocal( position.x, position.y );
        var angle = Utils.angleFrom( 0, 0, point.x, point.y );

        this.set( property, angle );
      }
    });
  });

  return Arc;
});
