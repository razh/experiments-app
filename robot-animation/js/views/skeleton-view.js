/*globals define*/
define([
  'backbone'
], function( Backbone ) {
  'use strict';

  var SkeletonView = Backbone.View.extend({
    initialize: function( options ) {
      // Atach subviews and models.
      [
        'head', 'chest', 'hips',
        // Arms.
        'upperArmLeft', 'upperArmRight',
        'lowerArmLeft', 'lowerArmRight',
        'handLeft', 'handRight',
        // Legs.
        'upperLegLeft', 'upperLegRight',
        'lowerLegLeft', 'lowerLegRight',
        'footLeft', 'footRight'
      ].forEach(function( key ) {
        var view = options[ key + 'View' ];
        this[ key + 'View' ] = view;
        this[ key ] = view.model;
      }.bind( this ));

      this.spacing = options.spacing;

      this.listenTo( this.head, 'change:height', function() {
        var headHeight = this.head.get( 'height' ),
            chestHeight = this.chest.get( 'height' );

        this.headView.transforms.at(0).set({
          ty: -0.5 * ( headHeight + chestHeight ) - this.spacing
        });
      });

      this.listenTo( this.hips, 'change:width', function() {
        // Legs line up with hips.
        var offset = 0.5 * this.hips.width;

        // Legs offset.
        this.legLeftView.transforms.at(0).set(  'x',  offset );
        this.legRightView.transforms.at(0).set( 'x', -offset );
      });

      this.listenTo( this.chest, 'change:height', function() {
        // Trigger children.
        this.head.trigger( 'change:height' );
        this.hips.trigger( 'change:height' );
      });

      this.listenTo( this.chest, 'change:width', function() {
        var offset = 0.5 * ( this.arm.width + this.chest.width ) + this.spacing;

        this.armLeftView.transforms.at(0).set(  'x',  offset );
        this.armRightView.transforms.at(0).set( 'x', -offset );
      });

      // Attach bones.
      var attachBone = function( parentName, childName, callback ) {
        this.listenTo( this[ childName ], 'change:height', function() {
          var parentHeight = this[ parentName ].get( 'height' ),
              childHeight = this[ childName ].get( 'height' );

          var childView = this[ childName + 'View' ];

          // Set translate3d.
          childView.transforms.at(0).set({
            ty: 0.5 * ( childHeight + parentHeight ) + this.spacing
          });

          // Set transform origin.
          childView.transformOrigin.set({
            y: -0.5 * childHeight
          });

          // This callback usually handles grandchildren.
          if ( callback && callback.call ) {
            callback.call( this );
          }
        });
      }.bind( this );

      attachBone( 'chest', 'hips' );

      [ 'Left', 'Right' ].forEach(function( direction ) {
        // Attach arm bones.
        var upperArm = 'upperArm' + direction,
            lowerArm = 'lowerArm' + direction,
            hand = 'hand' + direction;

        attachBone( upperArm, lowerArm, function() {
          this[ hand ].trigger( 'change:height' );
        });

        attachBone( lowerArm, hand );

        // Attach leg bones.
        var upperLeg = 'upperLeg' + direction,
            lowerLeg = 'lowerLeg' + direction,
            foot = 'foot' + direction;

        attachBone( 'hips', upperLeg, function() {
          this[ lowerLeg ].trigger( 'change:height' );
        });

        attachBone( upperLeg, lowerLeg, function() {
          this[ foot ].trigger( 'change:height' );
        });

        attachBone( lowerLeg, foot );
      }.bind( this ));

      // Entangle change events of each pair of parts together.
      [
        'upperArm', 'lowerArm', 'hand',
        'upperLeg', 'lowerLeg', 'foot'
      ].forEach(function( name ) {
        // Left and right part.
        var pair = [ name + 'Left', name + 'Right' ];

        pair.forEach(function( key, index ) {
          var model = this[ key + 'View' ].model,
              otherIndex = ( index + 1 ) % pair.length,
              otherModel = this[ pair[ otherIndex ] + 'View' ].model;

          this.listenTo( model, 'change', function() {
            otherModel.set( model.attributes );
          });
        }.bind( this ));
      }.bind( this ));
    }
  });


  return SkeletonView;
});
