/*globals define*/
define(function( require ) {
  'use strict';

  var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var Arc = require( 'geometry/models/arc' );
  var Circle = require( 'geometry/models/circle' );
  var Path = require( 'geometry/models/path' );
  var Rect = require( 'geometry/models/rect' );

  var ModelSelection = require( 'views/selection/model-selection' );
  var PointSelection = require( 'views/selection/point-selection' );
  var RectEdgeSelection = require( 'views/selection/rect-edge-selection' );
  var CircleRadiusSelection = require( 'views/selection/circle-radius-selection' );
  var ArcAngleSelection = require( 'views/selection/arc-angle-selection' );

  var Utils = require( 'utils' );

  var PI2 = Utils.PI2;

  var defaults = {
    fill: [ 255, 255, 255, 1 ],
    stroke: [ 0, 0, 0, 1 ]
  };

  var handlerRadius = 8;

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

      this.gridSpacing = 16;
      this.snapping = false;
      this.snappingRadius = 12;
      this.pathSnapping = false;

      this.drawing = false;
      this.drawnPath = [];

      this.ctx = this.el.getContext( '2d' );
      this.storage = window.localStorage;

      this.listenTo( this.collection, 'change add remove reset select', this.render );

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

    drawHandler: function( ctx, x, y ) {
      // Draw inner circle.
      ctx.beginPath();
      ctx.arc( x, y, handlerRadius, 0, PI2 );

      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fill();

      // Draw outer circle.
      ctx.beginPath();
      ctx.arc( x, y, handlerRadius - 1, 0, PI2 );

      ctx.shadowColor = '#000';
      ctx.shadowBlur = 3;

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.shadowBlur = 0;
    },

    drawCircleHandlers: function( ctx, circle ) {
      var radialPoint = circle.toWorld( circle.get( 'radius' ), 0 );
      this.drawHandler( ctx, radialPoint.x, radialPoint.y );
    },

    drawArcHandlers: function( ctx, arc ) {
      this.drawCircleHandlers( ctx, arc );

      Arc.angleNames.forEach(function( angleName ) {
        var point = arc[ angleName ];
        this.drawHandler( ctx, point.x, point.y );
      }.bind( this ));
    },

    drawPathHandlers: function( ctx, path ) {
      var pointCount = path.pointCount;
      var points = path.getWorldPoints();

      var x, y;
      for ( var i = 0; i < pointCount; i++ ) {
        x = points[ 2 * i ];
        y = points[ 2 * i + 1 ];

        this.drawHandler( ctx, x, y );
      }
    },

    drawRectHandlers: function( ctx, rect ) {
      Rect.edgeNames.forEach(function( edgeName ) {
        var point = rect[ edgeName ];
        this.drawHandler( ctx, point.x, point.y );
      }.bind( this ));
    },

    drawSelection: function( ctx ) {
      if ( !this.selection ) {
        return;
      }

      var model;
      if ( this.selection && this.selection.model ) {
        model = this.selection.model;
        if ( model instanceof Arc ) {
          this.drawArcHandlers( ctx, model );
        } else if ( model instanceof Circle ) {
          this.drawCircleHandlers( ctx, model );
        } else if ( model instanceof Path ) {
          this.drawPathHandlers( ctx, model );
        } else if ( model instanceof Rect ) {
          this.drawRectHandlers( ctx, model );
        }
      }
    },

    drawPath: function( ctx, path ) {
      if ( !this.drawing ) {
        return;
      }

      // Lines or better.
      if ( path.length < 4 ) {
        return;
      }

      ctx.beginPath();
      ctx.moveTo( path[0], path[1] );

      var x, y;
      for ( var i = 0, il = 0.5 * path.length; i < il; i++ ) {
        x = path[ 2 * i ];
        y = path[ 2 * i + 1 ];

        ctx.lineTo( x, y );
      }

      ctx.lineWidth = 3;
      ctx.strokeStyle = '#000';
      ctx.stroke();
    },

    render: function() {
      var ctx = this.ctx;

      var width  = ctx.canvas.width,
          height = ctx.canvas.height;

      ctx.clearRect( 0, 0, width, height );

      ctx.save();

      this.drawGrid( ctx, this.gridSpacing );
      this.drawObjects( ctx );

      this.drawSelection( ctx );
      this.drawPath( ctx, this.drawnPath );

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

    getCanvasCalls: function( contextName ) {
      if ( _.isUndefined( contextName ) ) {
        contextName = 'ctx';
      }

      var canvasKeys = _.keys( this.ctx );
      var canvasFunctions = _.functions( this.ctx );
      return this.renderIntercept().map(function( call ) {
        var key = call.shift();
        if ( canvasKeys.indexOf( key ) !== -1 ) {
          return 'ctx.' + key + ' = ' + call + ';';
        } else if ( canvasFunctions.indexOf( key ) !== -1 ) {
          if ( call.length ) {
            return 'ctx.' + key + '( ' + call.join( ', ' ) + ' );';
          } else {
            return 'ctx.' + key + '();';
          }
        }
      });
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

      var model;

      var pointCount;
      var points;
      var point;

      if ( this.drawing ) {
        if ( !this.drawnPath.length ) {
          this.drawnPath = [ x, y, x, y ];
        } else {
          this.drawnPath.push( x, y );
        }

        this.render();
        return;
      }

      // V. Add vertex to path.
      if ( this.keys[ 86 ] &&
           this.selection && this.selection.model instanceof Path ) {
        model = this.selection.model;
        var index = model.closestEdgeIndex( x, y );

        pointCount = model.pointCount;
        points = model.get( 'points' );

        var xi = points[ 2 * index ];
        var yi = points[ 2 * index + 1 ];
        var xj = points[ 2 * ( ( index + 1 ) % pointCount ) ];
        var yj = points[ 2 * ( ( index + 1 ) % pointCount ) + 1 ];

        var mx = 0.5 * ( xi + xj );
        var my = 0.5 * ( yi + yj );

        points.splice( 2 * ( ( index + 1 ) % pointCount ), 0, mx, my );
        model.trigger( 'change' );

        return;
      }

      // Select point/handler on model.
      // If Alt+Shift, remove point instead.
      var i;
      if ( this.selection && this.selection.model instanceof Path ) {
        model = this.selection.model;
        pointCount = model.pointCount;
        points = model.getWorldPoints();

        var cx, cy;
        for ( i = 0; i < pointCount; i++ ) {
          cx = points[ 2 * i ];
          cy = points[ 2 * i + 1 ];

          if ( Utils.circleContains( x, y, cx, cy, handlerRadius ) ) {
            if ( event.altKey && event.shiftKey ) {
              model.get( 'points' ).splice( 2 * i, 2 );
              model.trigger( 'change' );
            } else {
              this.selection = new PointSelection( model, i, x, y );
            }

            return;
          }
        }
      }

      // Handle Rect selections.
      if ( this.selection && this.selection.model instanceof Rect ) {
        model = this.selection.model;

        var edgeNames = Rect.edgeNames;
        var edgeName;
        for ( i = 0; i < edgeNames.length; i++ ) {
          edgeName = edgeNames[i];
          point = model[ edgeName ];
          if ( Utils.circleContains( x, y, point.x, point.y, handlerRadius ) ) {
            this.selection = new RectEdgeSelection( model, edgeName, x, y );
            return;
          }
        }
      }

      if ( this.selection && this.selection.model instanceof Arc ) {
        model = this.selection.model;

        var angleNames = Arc.angleNames;
        var angleName;
        for ( i = 0; i < angleNames.length; i++ ) {
          angleName = angleNames[i];
          point = model[ angleName ];
          if ( Utils.circleContains( x, y, point.x, point.y, handlerRadius ) ) {
            this.selection = new ArcAngleSelection( model, angleName, x, y );
            return;
          }
        }
      }

      // Handle Circle selections.
      if ( this.selection && this.selection.model instanceof Circle ) {
        model = this.selection.model;

        point = model.toWorld( model.get( 'radius' ), 0 );
        if ( Utils.circleContains( x, y, point.x, point.y, handlerRadius ) ) {
          this.selection = new CircleRadiusSelection( model, x, y );
          return;
        }
      }

      // Add shape.
      var shape;
      if ( event.altKey ) {
        // Alt + A. Arc.
        if ( this.keys[ 65 ] ) {
          shape = new Arc({
            radius: 30,
            startAngle: 0.25 * Math.PI,
            endAngle: Math.PI,
            fill: defaults.fill,
            stroke: defaults.stroke
          });
        }
        // Alt + C. Circle.
        else if ( this.keys[ 67 ] ) {
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
        // Alt + E(dge). Path.
        else if ( this.keys[ 69 ] ) {
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

      // Select object.
      var selection = this.collection.chain()
        // Prioritize by higher zIndex.
        .sortBy(function( model ) {
          return -model.get( 'zIndex' );
        })
        .find(function( model ) {
          return model.contains( ctx, x, y );
        })
        .value();

      if ( selection ) {
        this.selection = new ModelSelection( selection, x, y );
        this.collection.trigger( 'select', this.collection.indexOf( selection ) );
        return;
      } else if ( this.selection ) {
        // If we clicked on empty space, clear the selection.
        this.selection = null;
        // Rerender to get rid of selection handlers.
        this.render();
      }
    },

    onMouseMove: function( event ) {
      this.mousePosition( event );

      var x = this.mouse.x,
          y = this.mouse.y;

      // Move point of last drawn path to current mouse position.
      if ( this.drawing ) {
        this.drawnPath[ this.drawnPath.length - 2 ] = x;
        this.drawnPath[ this.drawnPath.length - 1 ] = y;
        this.render();
      }

      if ( this.mouse.down && this.selection ) {
        if ( this.snapping ) {
          var point;
          if ( this.pathSnapping ) {
            // Find point in paths closest to selected point.
            var selectionModel = this.selection.model;
            var paths = this.collection.filter(function( model ) {
              return selectionModel !== model && model instanceof Path;
            });

            point = this.closestPointInPaths( paths, x, y );
          }

          if ( !point ) {
            // Snap center of selection to grid.
            point = this.snapToGrid( x, y );
          }

          this.mouse.x = point.x - this.selection.offset.x;
          this.mouse.y = point.y - this.selection.offset.y;
        }

        // The worldPosition property shallow clones the mouse position.
        this.selection.worldPosition = this.mouse;
      }
    },

    onMouseUp: function() {
      this.mouse.down = false;
    },

    onKeyDown: function( event ) {
      this.keys[ event.which ] = true;

      // Stop backspace from triggering history back.
      // The body is not the active element if we're in an input.
      if ( event.which === 8 && document.body === document.activeElement ) {
        event.preventDefault();
        this.deleteSelection();
      }

      // Delete. Delete current selection.
      if ( event.which === 46 && document.body === document.activeElement ) {
        this.deleteSelection();
      }

      // Alt + Space.
      if ( event.altKey && event.which === 32 ) {
        if ( event.shiftKey ) {
          console.log( JSON.stringify( this.collection ) );
        } else {
          console.log( JSON.stringify( this.renderIntercept() ) );
          console.log( this.getCanvasCalls() );
        }

        this.saveToStorage();
      }

      // Shift key.
      if ( event.which === 16 ) {
        this.snapping = true;
      }

      // Alt + S. Toggle snap to path points.
      if ( event.altKey && event.which === 83 ) {
        this.pathSnapping = !this.pathSnapping;
      }

      // Alt + D. Duplicate current selection.
      if ( event.altKey && event.which === 68 ) {
        this.cloneSelection( 20, 20 );
      }

      // Alt + Shift + C. Center a Path selection.
      if ( event.altKey && event.shiftKey && event.which === 67 &&
           this.selection && this.selection.model instanceof Path ) {
        this.centerPath( this.selection.model );
      }

      // Alt + P. Toggle drawing.
      if ( event.altKey && event.which === 80 ) {
        this.drawing = !this.drawing;
        if ( !this.drawing ) {
          this.stopDrawing();
        }
      }
    },

    onKeyUp: function( event ) {
      this.keys[ event.which ] = false;

      // Shift key.
      if ( event.which === 16 ) {
        this.snapping = false;
      }
    },

    snapToGrid: function( x, y ) {
      var dx = Utils.distanceToGrid( x, this.gridSpacing ),
          dy = Utils.distanceToGrid( y, this.gridSpacing );

      if ( Math.abs( dx ) < this.snappingRadius ) {
        x += dx;
      }

      if ( Math.abs( dy ) < this.snappingRadius ) {
        y += dy;
      }

      return {
        x: x,
        y: y
      };
    },

    /**
     * Find the closest point in paths to the point (x, y).
     */
    closestPointInPaths: function( paths, x, y ) {
      var minDistanceSquared = Number.POSITIVE_INFINITY,
          distanceSquared,
          minPath, minIndex;

      var path, points, point, index;
      for ( var i = 0, il = paths.length; i < il; i++ ) {
        path = paths[i];

        // Get world coordinates of closest point in path.
        points = path.get( 'points' );
        index = path.closestPointIndex( x, y );
        point = path.toWorld(
          points[ 2 * index ],
          points[ 2 * index + 1 ]
        );

        distanceSquared = Utils.distanceSquared( x, y, point.x, point.y );
        if ( distanceSquared < minDistanceSquared ) {
          minDistanceSquared = distanceSquared;
          minPath = path;
          minIndex = index;
        }
      }

      if ( minPath && minIndex >= 0 ) {
        points = minPath.get( 'points' );
        point = minPath.toWorld(
          points[ 2 * minIndex ],
          points[ 2 * minIndex + 1 ]
        );
      }

      return point;
    },

    centerPath: function( path ) {
      var pointCount = path.pointCount;
      var points = path.get( 'points' );

      var centroid = path.computeCentroid();
      var dx = centroid.x,
          dy = centroid.y;

      // Shift all points about centroid.
      for ( var i = 0; i < pointCount; i++ ) {
        points[ 2 * i ] -= dx;
        points[ 2 * i + 1 ] -= dy;
      }

      // Shift path to the world-space centroid.
      centroid = path.toWorld( centroid.x, centroid.y );

      path.set({
        x: centroid.x,
        y: centroid.y
      });
    },

    deleteSelection: function() {
      if ( !this.selection || !this.selection.model ) {
        return;
      }

      var model = this.selection.model;
      // Set selection to null so handlers don't get drawn.
      this.selection = null;
      model.destroy();
    },

    cloneSelection: function( offsetX, offsetY ) {
      if ( !this.selection || !this.selection.model ) {
        return;
      }

      var cloneModel = this.selection.model.clone();

      cloneModel.set({
        x: cloneModel.get( 'x' ) + offsetX || 0,
        y: cloneModel.get( 'y' ) + offsetY || 0
      });

      this.collection.add( cloneModel );
    },

    stopDrawing: function() {
      var points = this.drawnPath;
      if ( !points || !points.length ) {
        return;
      }

      var path = new Path({
        x: 0,
        y: 0,
        lineWidth: 3,
        stroke: defaults.stroke,
        points: points
      });

      this.drawnPath = [];
      this.collection.add( path );
    },

    getStoredGroups: function() {
      var groups = this.storage.getItem( 'groups' );
      return groups ? JSON.parse( groups ) : [];
    },

    saveToStorage: function() {
      var groups = this.getStoredGroups();
      groups.push( this.collection );
      this.storage.setItem( 'groups', JSON.stringify( groups ) );
    },

    loadFromStorage: function( index ) {
      var groups = this.getStoredGroups();
      if ( 0 > index || index >= groups.length ) {
        return;
      }

      this.collection.reset( groups[ index ] );
    },

    remove: function() {
      Backbone.View.prototype.remove.call( this );
      document.removeEventListener( 'keydown', this.onKeyDown );
      document.removeEventListener( 'keyup', this.onKeyUp );
    }
  });

  return EditorView;
});
