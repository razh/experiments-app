/*globals define*/
define([
  'jquery',
  'underscore',
  'views/form-view',
  'views/color-view',
  'text!geometry/templates/object2d-view.html'
], function( $, _, FormView, ColorView, object2dTemplate ) {
  'use strict';

  var lineCaps = [ 'butt', 'round', 'square' ];
  var lineJoins = [ 'bevel', 'round', 'miter' ];

  var Object2DView = FormView.extend({
    template: _.template( object2dTemplate ),

    events: {
      'change select': 'changeSelected',
      'change input': 'change'
    },

    initialize: function() {
      _.bindAll( this, 'render' );

      [ 'fill', 'stroke' ].forEach(function( property ) {
        if ( this.model.get( property ) ) {
          this[ property + 'View' ] = new ColorView({
            className: property,
            model: this.model.get( property )
          });
        }
      }.bind( this ));

      this.listenTo( this.model, 'change', this.update );
    },

    render: function() {
      this.$el.html(this.template({
        model: this.model,
        lineCaps: lineCaps,
        lineJoins: lineJoins
      }));

      [ 'fill', 'stroke' ].forEach(function( property ) {
        var view = this[ property + 'View' ];
        if ( view ) {
          view.render();
          this.$el.append( view.el );
        }
      }.bind( this ));

      return this;
    },

    remove: function() {
      [ 'fill', 'stroke' ].forEach(function( property ) {
        var view = this[ property + 'View' ];
        if ( view ) {
          view.remove();
        }
      }.bind( this ));

      FormView.prototype.remove.call( this );
    },

    changeSelected: function( event ) {
      event.stopImmediatePropagation();

      var target = event.currentTarget;
      this.model.set( target.id, this.$( target ).val() );
    }
  });

  return Object2DView;
});
