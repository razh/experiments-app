/*globals define*/
define([
  'utils'
], function( Utils ) {
  'use strict';

  function closestPointOnLineParameter( x, y, x0, y0, x1, y1 ) {
    var dx = x1 - x0,
        dy = y1 - y0;

    // Check for line degeneracy.
    if ( !dx && !dy ) {
      return 0;
    }

    var lengthSquared = dx * dx + dy * dy;

    return ( ( x - x0 ) * ( x1 - x0 ) + ( y - y0 ) * ( y1 - y0 ) ) / lengthSquared;
  }

  function closestPointOnLine( x, y, x0, y0, x1, y1 ) {
    var t = closestPointOnLineParameter( x, y, x0, y0, x1, y1 );
    return Utils.lerp2d( x0, y0, x1, y1, t );
  }

  function closestPointOnSegment( x, y, x0, y0, x1, y1 ) {
    var t = closestPointOnLineParameter( x, y, x0, y0, x1, y1 );

    if ( 0 > t ) {
      return {
        x: x0,
        y: y0
      };
    }

    if ( t > 1 ) {
      return {
        x: x1,
        y: y1
      };
    }

    return Utils.lerp2d( x0, y0, x1, y1, t );
  }


  return {
    closestPointOnLineParameter: closestPointOnLineParameter,
    closestPointOnLine: closestPointOnLine,
    closestPointOnSegment: closestPointOnSegment
  };
});
