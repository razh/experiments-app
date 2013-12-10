/*globals define*/
define([
  'underscore',
  'views/form-view',
  'views/color-view',
  'text!geometry/templates/object2d-view.html'
], function( _, FormView, ColorView, object2dTemplate ) {
  'use strict';

  var Object2DView = FormView.extend({
    template: _.template( object2dTemplate ),

    initialize: function() {
      _.bindAll( this, 'render' );
      this.listenTo( this.model, 'change', this.update );
    },

    render: function() {
      this.$el.html( this.template() );
      return this;
    }
  });

  return Object2DView;
});
