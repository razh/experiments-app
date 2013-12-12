/*globals define*/
define([
  'jquery',
  'underscore',
  'views/form-view',
  'views/color-view',
  'text!geometry/templates/object2d-view.html'
], function( $, _, FormView, ColorView, object2dTemplate ) {
  'use strict';

  var Object2DView = FormView.extend({
    template: _.template( object2dTemplate ),

    events: {
      'change input': 'change'
    },

    initialize: function() {
      _.bindAll( this, 'render' );

      [ 'fill', 'stroke' ].forEach(function( property ) {
        if ( this.model.get( property ) ) {
          this[ property + 'View' ] = new ColorView({
            model: this.model.get( property )
          });
        }
      }.bind( this ));

      this.listenTo( this.model, 'change', this.update );
    },

    render: function() {
      this.$el.html(this.template({
        model: this.model
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
    }
  });

  return Object2DView;
});
