/*globals define*/
define([
  'jquery',
  'backbone'
], function( $, Backbone ) {
  'use strict';

  var FormView = Backbone.View.extend({
    update: function() {
      var changedAttributes = this.model.changedAttributes();
      for ( var attr in changedAttributes ) {
        this.$( '#' + attr ).val( changedAttributes[ attr ] );
      }
    },

    change: function( event ) {
      // Prevent sibling/parent change handlers from firing.
      event.stopImmediatePropagation();

      var target = event.currentTarget,
          value = parseFloat( this.$( target ).val() );

      this.model.set( target.id, value );
    }
  });

  return FormView;
});
