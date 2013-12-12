/* globals define*/
define([
  'underscore',
  'geometry/views/object2d-view',
  'text!geometry/templates/rect-view.html'
], function( _, Object2DView, rectTemplate ) {
  'use strict';

  var RectView = Object2DView.extend({
    rectTemplate: _.template( rectTemplate ),

    render: function() {
      Object2DView.prototype.render.call( this );

      this.$el.prepend(this.rectTemplate({
        model: this.model
      }));

      return this;
    }
  });

  return RectView;
});
