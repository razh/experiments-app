/*globals define*/
define([
  'underscore',
  'geometry/views/circle-view',
  'text!geometry/templates/arc-view.html'
], function( _, CircleView, arcTemplate ) {
  'use strict';

  var ArcView = CircleView.extend({
    arcTemplate: _.template( arcTemplate ),

    render: function() {
      CircleView.prototype.render.call( this );

      this.$el.prepend(this.arcTemplate({
        model: this.model
      }));

      return this;
    }
  });

  return ArcView;
});
