/* globals define*/
define([
  'jquery',
  'backbone'
], function( $, Backbone ) {
  'use strict';

  /**
   * PathEditView adds DOM elements used as handlers to modify the
   * control points of the path.
   */
  var PathEditView = Backbone.View.extend({
    events: {
      'mousedown .handler': 'onMouseDown',
      'mousemove': 'onMouseMove',
      'mouseup': 'onMouseUp'
    },

    initialize: function( options ) {
      this.canvas = options.canvas;
      this.handlers = [];

      this.$el.css({
        width: this.canvas.width,
        height: this.canvas.height
      });

      this.selected = null;
      this.offset = {
        x: 0,
        y: 0
      };

      var pointCount = this.model.pointCount();
      var points = this.model.get( 'points' );

      var fragment = document.createDocumentFragment();

      var handlerEl;
      var transform;
      var point;
      var x, y;
      for ( var i = 0; i < pointCount; i++ ) {
        x = points[ 2 * i ];
        y = points[ 2 * i + 1 ];

        point = this.model.toWorld( x, y );
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

        fragment.appendChild( handlerEl[0] );
        this.handlers.push( handlerEl );
      }

      this.$el.append( fragment );
    },

    onMouseDown: function( event ) {
      var target = event.currentTarget;

      this.selected = target;
      var transform = this.selected.webkitTransform || this.selected.transform;

      this.offset.x = event.pageX - this.canvas.offsetLeft;
      this.offset.y = event.pageY - this.canvas.offsetTop;
    },

    onMouseMove: function( event ) {
      var transform;
      var x, y;
      if ( this.selected ) {
        x = event.pageX - this.offset.x;
        y = event.pageY - this.offset.y;

        transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
        console.log(transform)
        $( this.selected ).css({
          '-webkit-transform': transform,
          transform: transform
        });
      }
    },

    onMouseUp: function() {
      this.selected = null;
      this.offset = {
        x: 0,
        y: 0
      };
    }
  });

  return PathEditView;
});
