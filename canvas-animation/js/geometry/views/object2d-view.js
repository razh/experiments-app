/*globals define*/
define([
  'underscore',
  'backbone',
  'text!geometry/templates/object2d-view.html'
], function( _, Backbone, object2dTemplate ) {
  'use strict';

  var Object2DView = Backbone.View.extend({
    template: _.template( object2dTemplate ),

    render: function() {
      this.$el.html( this.template() );
      return this;
    }
  });

  return Object2DView;
});
