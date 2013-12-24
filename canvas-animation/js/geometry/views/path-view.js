/*globals define*/
define([
  'underscore',
  'geometry/views/object2d-view',
  'text!geometry/templates/path-view.html'
], function( _, Object2DView, pathTemplate ) {
  'use strict';

  var interpolations = [ 'linear', 'quadratic' ];

  var PathView = Object2DView.extend({
    pathTemplate: _.template( pathTemplate ),

    events: {
      'change input.coordinate': 'changeCoordinate',
      'change select': 'changeString',
      'change input[type=checkbox]': 'changeCheckbox',
      'change input': 'change'
    },

    initialize: function() {
      Object2DView.prototype.initialize.apply( this, arguments );
      this.renderedPointCount = 0;
    },

    render: function() {
      Object2DView.prototype.render.call( this );

      this.renderedPointCount = this.model.pointCount;

      this.$el.prepend(this.pathTemplate({
        model: this.model,
        pointCount: this.renderedPointCount,
        points: this.model.get( 'points' ),
        interpolations: interpolations
      }));

      return this;
    },

    update: function() {
      // Update closed checkbox.
      if ( !_.isUndefined( this.model.changedAttributes().closed ) ) {
        this.$( '#closed' ).prop( 'checked', this.model.get( 'closed' ) );
      }

      Object2DView.prototype.update.call( this );

      var pointCount = this.model.pointCount;
      var points = this.model.get( 'points' );

      if ( pointCount !== this.renderedPointCount ) {
        this.render();
      }

      // Update coordinate values.
      var xEl, yEl;
      var x, y;
      for ( var i = 0; i < pointCount; i++ ) {
        xEl = this.$( '#x' + i );
        yEl = this.$( '#y' + i );

        x = points[ 2 * i ];
        y = points[ 2 * i + 1 ];

        // Dirty checking appears to be faster than just setting all values.
        if ( xEl.val() !== x.toString() ) { xEl.val( x ); }
        if ( yEl.val() !== y.toString() ) { yEl.val( y ); }
      }
    },

    changeCoordinate: function( event ) {
      event.stopImmediatePropagation();

      var $target = this.$( event.currentTarget ),
          value = parseFloat( $target.val() ),
          axis  = parseInt( $target.attr( 'data-axis' ), 10 ),
          index = parseInt( $target.attr( 'data-index' ), 10 );

      // Index must be correspond to an existing point.
      // Axis must be 0 (x) or 1 (y).
      if ( 0 > index || index > this.model.pointCount ||
           ( axis !== 0 && axis !== 1 ) ) {
        return;
      }

      // If value is not finite, set to previous coordinate value.
      if ( !isFinite( value ) ) {
        $target.val( this.model.get( 'points' )[ 2 * index + axis ] );
        return;
      }

      this.model.get( 'points' )[ 2 * index + axis ] = value;
      this.model.trigger( 'change' );
    }
  });

  return PathView;
});
