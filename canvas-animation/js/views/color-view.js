/*globals define*/
define([
  'underscore',
  'views/form-view',
  'text!templates/color-view.html'
], function( _, FormView, colorTemplate ) {
  'use strict';

  var ColorView = FormView.extend({
    template: _.template( colorTemplate ),

    events: {
      'change input': 'change'
    },

    initialize: function() {
      _.bindAll( this, 'render' );
      this.listenTo( this.model, 'change', this.update );
    },

    render: function() {
      this.$el.html(this.template({
        color: this.model
      }));

      return this;
    }
  });

  return ColorView;
});
