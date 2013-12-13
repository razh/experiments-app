/*globals define*/
define(function() {
  'use strict';

  var PI2 = 2 * Math.PI;

  var DEG_TO_RAD = Math.PI / 180,
      RAD_TO_DEG = 180 / Math.PI;

  function clamp( value, min, max ) {
    return Math.min( Math.max( value, min ), max );
  }

  function distanceSquared( x0, y0, x1, y1 ) {
    var dx = x1 - x0,
        dy = y1 - y0;

    return dx * dx + dy * dy;
  }

  function distance( x0, y0, x1, y1 ) {
    return Math.sqrt( distanceSquared( x0, y0, x1 ,y1 ) );
  }

  function circleContains( x, y, cx, cy, radius ) {
    return distanceSquared( x, y, cx, cy ) < radius * radius;
  }

  return {
    PI2: PI2,

    DEG_TO_RAD: DEG_TO_RAD,
    RAD_TO_DEG: RAD_TO_DEG,

    clamp: clamp,

    distanceSquared: distanceSquared,
    distance: distance,

    circleContains: circleContains
  };
});
