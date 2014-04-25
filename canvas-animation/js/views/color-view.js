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
      'change input[type=color]': 'changeHex',
      'change input[type=text]': 'changeHex',
      'input input': 'change'
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
    },

    update: function() {
      FormView.prototype.update.call( this );

      var hexString = this.model.hexString();
      this.$( 'input[type=color]' ).val( hexString );
      this.$( 'input[type=text]'  ).val( hexString );
    },

    changeHex: function( event ) {
      event.stopImmediatePropagation();

      var $target = this.$( event.currentTarget );
      this.model.setHexString( $target.val() );
    }
  });

  return ColorView;
});
