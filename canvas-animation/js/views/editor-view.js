/*globals define*/
define(function( require ) {
  'use strict';

  var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var Circle = require( 'geometry/models/circle' );
  var Path = require( 'geometry/models/path' );
  var Rect = require( 'geometry/models/rect' );

  var defaults = {
    fill: [ 255, 255, 255, 1 ],
    stroke: [ 0, 0, 0, 1 ]
  };

  var ModelSelection = require( 'views/selection/model-selection' );
  var PointSelection = require( 'views/selection/point-selection' );

  var EditorView = Backbone.View.extend({
    events: {
      mousedown: 'onMouseDown',
      mousemove: 'onMouseMove',
      mouseup: 'onMouseUp'
    },

    initialize: function() {
      _.bindAll( this,
        'render',
        'onMouseDown',
        'onMouseMove',
        'onMouseUp',
        'onKeyDown',
        'onKeyUp'
      );

      this.mouse = {
        x: 0,
        y: 0,

        down: false
      };

      this.keys = [];

      this.selection = null;

      this.el.width = this.model.get( 'width' );
      this.el.height = this.model.get( 'height' );

      this.ctx = this.el.getContext( '2d' );

      this.listenTo( this.collection, 'change add remove reset', this.render );

      document.addEventListener( 'keydown', this.onKeyDown );
      document.addEventListener( 'keyup', this.onKeyUp );
    },

    drawObjects: function( ctx ) {
      this.collection.sortBy( 'zIndex' ).forEach(function( object ) {
        object.draw( ctx );
      });
    },

    drawGrid: function( ctx, spacing ) {
      var width  = ctx.canvas.width,
          height = ctx.canvas.height;

      var halfWidth  = 0.5 * width,
          halfHeight = 0.5 * height;

      var xCount = width  / spacing,
          yCount = height / spacing;

      ctx.beginPath();

      var i;
      // vertical lines.
      for ( i = 0; i <= xCount; i++ ) {
        ctx.moveTo( i * spacing, 0 );
        ctx.lineTo( i * spacing, height );
      }

      // Horizontal lines.
      for ( i = 0; i <= yCount; i++ ) {
        ctx.moveTo( 0, i * spacing );
        ctx.lineTo( width, i * spacing );
      }

      ctx.lineWidth = 0.5;
      ctx.strokeStyle = '#222';
      ctx.stroke();

      // Draw center lines.
      ctx.beginPath();

      // Vertical.
      ctx.moveTo( halfWidth, 0 );
      ctx.lineTo( halfWidth, height );

      // Horizontal.
      ctx.moveTo(     0, halfHeight );
      ctx.lineTo( width, halfHeight );

      ctx.lineWidth = 1;
      ctx.stroke();
    },

    render: function() {
      var ctx = this.ctx;

      var width  = ctx.canvas.width,
          height = ctx.canvas.height;

      ctx.clearRect( 0, 0, width, height );

      ctx.save();

      this.drawGrid( ctx, 16 );
      this.drawObjects( ctx );

      ctx.restore();
    },

    /**
     * Intercept canvas calls.
     */
    renderIntercept: function() {
      var calls = [];

      var ctx = {};
      // Intercept property setters.
      _.keys( this.ctx ).forEach(function( property ) {
        Object.defineProperty( ctx, property, {
          get: function() {
            return ctx[ '_' + property ];
          },

          set: function( value ) {
            calls.push( [ property, value ] );
            ctx[ '_' + property ] = value;
          }
        });
      });

      // Intercept functions.
      _.functions( this.ctx ).forEach(function( functionName ) {
        ctx[ functionName ] = function() {
          calls.push( [ functionName ].concat( _.toArray( arguments ) ) );
        };
      });

      this.drawObjects( ctx );

      return calls;
    },

    mousePosition: function( event ) {
      this.mouse.x = event.pageX - this.el.offsetLeft;
      this.mouse.y = event.pageY - this.el.offsetTop;
    },

    onMouseDown: function( event ) {
      this.mousePosition( event );
      this.mouse.down = true;

      var ctx = this.ctx;
      var x = this.mouse.x,
          y = this.mouse.y;

      // Add shape.
      var shape;
      if ( event.altKey ) {
        // Alt + C. Circle
        if ( this.keys[ 67 ] ) {
          shape = new Circle({
            radius: 30,
            fill: defaults.fill,
            stroke: defaults.stroke
          });
        }
        // Alt + R. Rect.
        else if ( this.keys[ 82 ] ) {
          shape = new Rect({
            width: 60,
            height: 60,
            fill: defaults.fill,
            stroke: defaults.stroke
          });
        }
        // Alt + A. Path.
        else if ( this.keys[ 65 ] ) {
          shape = new Path({
            points: [ -30, -30, 30, -30, 30, 30, -30, 30 ],
            stroke: defaults.stroke,
            lineWidth: 3
          });
        }

        if ( shape ) {
          shape.set({
            x: x,
            y: y
          });

          this.collection.add( shape );
          return;
        }
      }

      // Select.
      var selection = this.collection.find(function( model ) {
        return model.contains( ctx, x, y );
      });

      if ( selection ) {
        this.selection = new ModelSelection( selection, x, y );
      }
    },

    onMouseMove: function( event ) {
      this.mousePosition( event );

      if ( this.mouse.down && this.selection ) {
        this.selection.x = this.mouse.x;
        this.selection.y = this.mouse.y;
      }
    },

    onMouseUp: function() {
      this.mouse.down = false;

      this.selection = null;
    },

    onKeyDown: function( event ) {
      this.keys[ event.which ] = true;
    },

    onKeyUp: function( event ) {
      this.keys[ event.which ] = false;
    },

    remove: function() {
      Backbone.View.prototype.remove.call( this );
      document.removeEventListener( 'keydown', this.onKeyDown );
      document.removeEventListener( 'keyup', this.onKeyUp );
    }
  });

  return EditorView;
});
