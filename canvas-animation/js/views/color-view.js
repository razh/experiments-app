/*globals define*/
define([
  'underscore',
  'backbone',
  'text!templates/color-view.html'
], function( _, Backbone, colorTemplate ) {
  'use strict';

  var ColorView = Backbone.View.extend({
    template: _.template( colorTemplate ),

    render: function() {
      this.$el.html( this.template() );
      return this;
    }
  });

  return ColorView;
});
