/*globals define*/
define([
  'backbone'
], function( Backbone ) {
  'use strict';

  var silent = {
    silent: true
  };

  var SkeletonView = Backbone.View.extend({
    initialize: function( options ) {
      [
        'head', 'chest', 'hips',
        // Limbs.
        'arm', 'leg',
        // Arms.
        'upperArmLeft', 'upperArmRight',
        'lowerArmLeft', 'lowerArmRight',
        'handLeft', 'handRight',
        // Legs.
        'upperLegLeft', 'upperLegRight',
        'lowerLegLeft', 'lowerLegRight',
        'footLeft', 'footRight'
      ].forEach(function( key ) {
        this[ key ] = options[ key ];
      });

      this.listenTo( this.head, 'change:height', function() {
        var headHeight = this.head.get( 'height' ),
            chestHeight = this.chest.get( 'height' );

        this.head.transformOrigin.set( 'y', -0.5 * ( headHeight + chestHeight ) - this.spacing );
      });

      this.listenTo( this.hips, 'change:height', function() {
        var hipsHeight = this.hips.get( 'height' ),
            chestHeight = this.chest.get( 'height' );

        this.hips.transformOrigin.set( 'y', 0.5 * ( hipsHeight + chestHeight ) + this.spacing );
      });

      this.listenTo( this.hips, 'change:width', function() {
      });

      this.listenTo( this.chest, 'change:height', function() {
        // Trigger children.
        this.head.trigger( 'change:height' );
        this.hips.trigger( 'change:height' );
      });

      this.listenTo( this.chest, 'change:width', function() {
        var offsetX = 0.5 * ( this.arm.width + this.chest.width ) + this.spacing;
        // Set translate3ds of each limb and direction combination.
      });



      // Entangle change events of each pair together.
      [
        [ 'upperArmLeft', 'upperArmRight' ],
        [ 'lowerArmLeft', 'lowerArmRight' ],
        [ 'handLeft', 'handRight' ],
        [ 'upperLegLeft', 'lowerLegRight' ],
        [ 'lowerLegLeft', 'lowerLegRight' ],
        [ 'footLeft', 'footRight' ]
      ].forEach(function( pair ) {
        pair.forEach(function( key, index, array ) {
          var otherIndex = ( index + 1 ) % array.length;
          this.listenTo( this[ key ], 'change', function() {
            this[ pair[ otherIndex ] ].set( this[ key ].attributes, silent );
          });
        }.bind( this ));
      }.bind( this ));
    }
  });


  return SkeletonView;
});
