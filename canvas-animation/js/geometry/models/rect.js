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

  // left, right, top, and bottom properties are in world space.
  Object.defineProperty( Rect.prototype, 'left', {
    get: function() {
      var halfWidth = 0.5 * this.get( 'width' );
      return this.toWorld( -halfWidth, 0 );
    },

    set: function( position ) {
      var halfWidth = 0.5 * this.get( 'width' );
      var point = this.toLocal( position.x, position.y );
      point = this.toWorld( point.x + halfWidth, 0 );
      this.set( point );
    }
  });

  Object.defineProperty( Rect.prototype, 'right', {
    get: function() {
      var halfWidth = 0.5 * this.get( 'width' );
      return this.toWorld( halfWidth, 0 );
    },

    set: function( position ) {
      var halfWidth = 0.5 * this.get( 'width' );
      var point = this.toLocal( position.x, position.y );
      point = this.toWorld( point.x - halfWidth, 0 );
      this.set( point );
    }
  });

  Object.defineProperty( Rect.prototype, 'top', {
    get: function() {
      var halfHeight = 0.5 * this.get( 'height' );
      return this.toWorld( 0, -halfHeight );
    },

    set: function( position ) {
      var halfHeight = 0.5 * this.get( 'height' );
      var point = this.toLocal( position.x, position.y );
      point = this.toWorld( 0, point.y + halfHeight );
      this.set( point );
    }
  });

  Object.defineProperty( Rect.prototype, 'bottom', {
    get: function() {
      var halfHeight = 0.5 * this.get( 'height' );
      return this.toWorld( 0, halfHeight );
    },

    set: function( position ) {
      var halfHeight = 0.5 * this.get( 'height' );
      var point = this.toLocal( position.x, position.y );
      point = this.toWorld( 0, point.y - halfHeight );
      this.set( point );
    }
  });

  return Rect;
});
