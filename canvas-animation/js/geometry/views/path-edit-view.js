/* globals define*/
define([
  'jquery',
  'underscore',
  'backbone',
  'utils'
], function( $, _, Backbone, Utils ) {
  'use strict';

  /**
   * PathEditView adds DOM elements used as handlers to modify the
   * control points of the path.
   */
  var PathEditView = Backbone.View.extend({
    events: {
      'mousedown .handler': 'onMouseDown'
    },

    initialize: function( options ) {
      _.bindAll( this,
        'onMouseDown',
        'onMouseMove',
        'onMouseUp'
      );

      this.canvas = options.canvas;
      this.$handlers = [];

      this.selected = null;
      this.offset = {
        x: 0,
        y: 0
      };

      var pointCount = this.model.pointCount;
      var fragment = document.createDocumentFragment();

      var $handler;
      for ( var i = 0; i < pointCount; i++ ) {
        $handler = $( '<div>', {
          'class': 'handler',
          id: 'handler-' + i
        }).attr({
          'data-index': i
        });

        fragment.appendChild( $handler[0] );
        this.$handlers.push( $handler );
      }

      this.update();
      this.$el.append( fragment );

      document.body.addEventListener( 'mousemove', this.onMouseMove );
      document.body.addEventListener( 'mouseup', this.onMouseUp );

      this.listenTo( this.model, 'change', this.update );
    },

    update: function() {
      var points = this.model.getWorldPoints();

      var transform;
      var x, y;
      this.$handlers.forEach(function( $handler, index ) {
        x = points[ 2 * index ];
        y = points[ 2 * index + 1 ];

        transform = 'translate3d(' + x + 'px, ' + y + 'px, 0)';

        $handler.css({
          '-webkit-transform': transform,
          transform: transform
        }).attr({
          'data-x': x,
          'data-y': y
        });
      });
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

        this.model.trigger( 'change' );
      }
    },

    onMouseUp: function() {
      this.selected = null;
      this.offset = {
        x: 0,
        y: 0
      };
    },

    remove: function() {
      Backbone.View.prototype.remove.call( this );
      document.body.removeEventListener( 'mousemove', this.onMouseMove );
      document.body.removeEventListener( 'mouseup', this.onMouseUp );
    }
  });

  return PathEditView;
});
