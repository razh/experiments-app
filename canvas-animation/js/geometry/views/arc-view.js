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
    },

    update: function() {
      var changedAttributes = this.model.changedAttributes();

      // Update checkboxes.
      [ 'anticlockwise', 'closed' ].forEach(function( attr ) {
        if ( !_.isUndefined( changedAttributes[ attr ] ) ) {
          this.$( '#' + attr ).prop( 'checked', this.model.get( attr ) );
        }
      }, this );

      CircleView.prototype.update.call( this );
    }
  });

  return ArcView;
});
