/*globals define*/
define(function() {
  'use strict';

  var PI2 = 2 * Math.PI;

  var DEG_TO_RAD = Math.PI / 180,
      RAD_TO_DEG = 180 / Math.PI;

  function clamp( value, min, max ) {
    return Math.min( Math.max( value, min ), max );
  }

  return {
    PI2: PI2,

    DEG_TO_RAD: DEG_TO_RAD,
    RAD_TO_DEG: RAD_TO_DEG,

    clamp: clamp
  };
});
