/* globals define*/
define([
  'jquery',
  'underscore',
  'backbone'
], function( $, _, Backbone ) {
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
      var points = this.model.getWorldPoints();

      var fragment = document.createDocumentFragment();

      var handlerEl;
      var transform;
      var x, y;
      for ( var i = 0; i < pointCount; i++ ) {
        x = points[ 2 * i ];
        y = points[ 2 * i + 1 ];

        transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';

        handlerEl = $( '<div>', {
          'class': 'handler',
          id: 'handler-' + i
        }).css({
          '-webkit-transform': transform,
          transform: transform
        }).attr({
          'data-x': x,
          'data-y': y,
          'data-index': i
        });

        fragment.appendChild( handlerEl[0] );
        this.handlers.push( handlerEl );
      }

      this.$el.append( fragment );
    },

    onMouseDown: function( event ) {
      var target = event.currentTarget,
          $target = $( target );

      var x = $target.attr( 'data-x' ),
          y = $target.attr( 'data-y' );

      this.selected = target;
      this.offset.x = x - ( event.pageX - this.canvas.offsetLeft );
      this.offset.y = y - ( event.pageY - this.canvas.offsetTop );
    },

    onMouseMove: function( event ) {
      var $selected;
      var transform;
      var points, point;
      var index;
      var x, y;

      if ( this.selected ) {
        x = event.pageX + this.offset.x;
        y = event.pageY + this.offset.y;

        transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';

        $selected = $( this.selected ).css({
          '-webkit-transform': transform,
          transform: transform
        }).attr({
          'data-x': x,
          'data-y': y
        });

        index = parseInt( $selected.attr( 'data-index' ), 10 );

        points = this.model.get( 'points' );
        point = this.model.toLocal( x, y );
        points[ 2 * index ] = point.x;
        points[ 2 * index + 1 ] = point.y;
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
