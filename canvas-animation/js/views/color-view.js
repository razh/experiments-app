/*globals define*/
define([
  'underscore',
  'views/form-view',
  'text!templates/color-view.html'
], function( _, FormView, colorTemplate ) {
  'use strict';

  var ColorView = FormView.extend({
    template: _.template( colorTemplate ),

    render: function() {
      this.$el.html( this.template() );
      return this;
    }
  });

  return ColorView;
});
