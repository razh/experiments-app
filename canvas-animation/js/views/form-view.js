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
          $target = this.$( target ),
          id = target.id,
          value = parseFloat( $target.val() );

      // If value is not finite, set to previous model value.
      if ( !isFinite( value ) ) {
        $target.val( this.model.get( id ) );
        return;
      }

      if ( this.model.has( id ) ) {
        this.model.set( id, value );
      }
    }
  });

  return FormView;
});
