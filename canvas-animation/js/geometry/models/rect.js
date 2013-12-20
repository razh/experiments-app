/*globals define*/
define([
  'geometry/models/object2d'
], function( Object2D ) {
  'use strict';

  var Rect = Object2D.extend({
    defaults: function() {
      var defaults = Object2D.prototype.defaults();
      defaults.width  = 0;
      defaults.height = 0;
      return defaults;
    },

    drawPath: function( ctx ) {
      var width  = this.get( 'width' ),
          height = this.get( 'height' );

      ctx.beginPath();
      ctx.rect( -0.5 * width, -0.5 * height, width, height );
      ctx.closePath();
    }
  });

  Rect.edgeNames = [ 'top', 'right', 'bottom', 'left' ];

  // left, right, top, and bottom properties are in world space.
  Object.defineProperty( Rect.prototype, 'left', {
    get: function() {
      var halfWidth = 0.5 * this.get( 'width' );
      return this.toWorld( -halfWidth, 0 );
    },

    set: function( position ) {
      var point = this.toLocal( position.x, position.y );
      var width = -point.x + 0.5 * this.get( 'width' );
      point = this.toWorld( point.x + 0.5 * width, 0 );

      this.set({
        x: point.x,
        y: point.y,
        width: width
      });
    }
  });

  Object.defineProperty( Rect.prototype, 'right', {
    get: function() {
      var halfWidth = 0.5 * this.get( 'width' );
      return this.toWorld( halfWidth, 0 );
    },

    set: function( position ) {
      var point = this.toLocal( position.x, position.y );
      var width = point.x + 0.5 * this.get( 'width' );
      point = this.toWorld( point.x - 0.5 * width, 0 );

      this.set({
        x: point.x,
        y: point.y,
        width: width
      });
    }
  });

  Object.defineProperty( Rect.prototype, 'top', {
    get: function() {
      var halfHeight = 0.5 * this.get( 'height' );
      return this.toWorld( 0, -halfHeight );
    },

    set: function( position ) {
      var point = this.toLocal( position.x, position.y );
      var height = -point.y + 0.5 * this.get( 'height' );
      point = this.toWorld( 0, point.y + 0.5 * height );

      this.set({
        x: point.x,
        y: point.y,
        height: height
      });
    }
  });

  Object.defineProperty( Rect.prototype, 'bottom', {
    get: function() {
      var halfHeight = 0.5 * this.get( 'height' );
      return this.toWorld( 0, halfHeight );
    },

    set: function( position ) {
      var point = this.toLocal( position.x, position.y );
      var height = point.y + 0.5 * this.get( 'height' );
      point = this.toWorld( 0, point.y - 0.5 * height );

      this.set({
        x: point.x,
        y: point.y,
        height: height
      });
    }
  });

  return Rect;
});
