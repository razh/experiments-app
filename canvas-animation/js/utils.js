/*globals define*/
define(function() {
  'use strict';

  var PI2 = 2 * Math.PI;

  var DEG_TO_RAD = Math.PI / 180,
      RAD_TO_DEG = 180 / Math.PI;

  function clamp( value, min, max ) {
    return Math.min( Math.max( value, min ), max );
  }

  /**
   * Lerp functions.
   */
  function lerp( a, b, t ) {
    return a + t * ( b - a );
  }

  function inverseLerp( value, a, b ) {
    return ( value - a ) / ( b - a );
  }

  function lerp2d( x0, y0, x1, y1, parameter ) {
    if ( parameter === null ) {
      return null;
    }

    return {
      x: lerp( x0, x1, parameter ),
      y: lerp( y0, y1, parameter )
    };
  }

  /**
   * Distance functions.
   */
  function distanceSquared( x0, y0, x1, y1 ) {
    var dx = x1 - x0,
        dy = y1 - y0;

    return dx * dx + dy * dy;
  }

  function distance( x0, y0, x1, y1 ) {
    return Math.sqrt( distanceSquared( x0, y0, x1 ,y1 ) );
  }

  function distanceToGrid( value, spacing ) {
    return Math.round( value / spacing ) * spacing - value;
  }

  function circleContains( x, y, cx, cy, radius ) {
    return distanceSquared( x, y, cx, cy ) <= radius * radius;
  }

  return {
    PI2: PI2,

    DEG_TO_RAD: DEG_TO_RAD,
    RAD_TO_DEG: RAD_TO_DEG,

    clamp: clamp,

    lerp: lerp,
    inverseLerp: inverseLerp,
    lerp2d: lerp2d,

    distanceSquared: distanceSquared,
    distance: distance,
    distanceToGrid: distanceToGrid,

    circleContains: circleContains
  };
});
