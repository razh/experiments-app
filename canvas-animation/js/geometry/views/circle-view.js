/*globals define*/
define([
  'underscore',
  'geometry/views/object2d-view',
  'text!geometry/templates/circle-view.html'
], function( _, Object2DView, circleTemplate ) {
  'use strict';

  var CircleView = Object2DView.extend({
    circleTemplate: _.template( circleTemplate ),

    render: function() {
      Object2DView.prototype.render.call( this );

      this.$el.prepend(this.circleTemplate({
        model: this.model
      }));

      return this;
    }
  });

  return CircleView;
});
