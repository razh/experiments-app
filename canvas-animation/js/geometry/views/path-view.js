/*globals define*/
define([
  'jquery',
  'geometry/views/object2d-view'
], function( $, Object2DView ) {
  'use strict';

  var PathView = Object2DView.extend({
    events: {
      'mousedown .handler': 'onMouseDown',
      'mousemove  .handler': 'onMousemMove',
      'mouseup .handler': 'onMouseUp'
    },

    initialize: function() {
      this.handlers = [];

      var pointCount = this.model.pointCount();
      var points = this.model.get( 'points' );

      var handlerEl;
      var transform;
      var point;
      var x, y;
      for ( var i = 0; i < pointCount; i++ ) {
        x = points[ 2 * i ];
        y = points[ 2 * i + 1 ];

        point = this.toWorld( x, y );
        x = point.x;
        y = point.y;

        transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';

        handlerEl = $( '<div>', {
          'class': 'handler',
          id: 'handler-' + i
        }).css({
          '-webkit-transform': transform,
          transform: transform
        });

        this.handlers.push( handlerEl );
      }
    },

    onMouseDown: function() {},
    onMouseMove: function() {},
    onMouseUp: function() {}
  });

  return PathView;
});
