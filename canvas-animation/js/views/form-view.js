/*globals define*/
define([
  'jqeury',
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
      var target = event.currentTarget,
          value = parseInt( $( target ).val(), 10 );

      this.model.set( target.id, value );
    }
  });

  return FormView;
});
