/*globals define*/
define([
  'backbone'
], function( Backbone ) {
  'use strict';

  var parts = [
    'head', 'chest', 'hips',
    // Arms.
    'upperArmLeft', 'upperArmRight',
    'lowerArmLeft', 'lowerArmRight',
    'handLeft', 'handRight',
    // Legs.
    'upperLegLeft', 'upperLegRight',
    'lowerLegLeft', 'lowerLegRight',
    'footLeft', 'footRight'
  ];

  var leftRightOffsets = [
    'armLeft', 'armRight',
    'legLeft', 'legRight'
  ];

  var SkeletonView = Backbone.View.extend({
    initialize: function( options ) {
      // Atach subviews and models.
      parts.forEach(function( part ) {
        var view = options[ part + 'View' ];
        this[ part + 'View' ] = view;
        this[ part ] = view.model;
      }.bind( this ));

      // Attach left-right limb transforms/offsets.
      leftRightOffsets.forEach(function( key ) {
        this[ key ] = options[ key ];
      }.bind( this ));

      this.spacingView = options.spacing;

      this.listenTo( this.spacingView.model, 'change', function() {
        this.chest.trigger( 'change:width change:height' );
        this.upperArmLeft.trigger( 'change:height' );
        this.upperArmRight.trigger( 'change:height' );
        this.hips.trigger( 'change:height' );
      });

      // Head height affects the head's distance from the chest.
      this.listenTo( this.head, 'change:height', function() {
        var headHeight = this.head.get( 'height' ),
            chestHeight = this.chest.get( 'height' );

        this.headView.transforms.at(0).set({
          ty: -0.5 * ( headHeight + chestHeight ) - this.spacing
        });
      });

      // Hips width affects the distance between left/right legs.
      this.listenTo( this.hips, 'change:width', function() {
        // Legs line up with hips.
        var offset = 0.5 * this.hips.get( 'width' );

        // Legs offset.
        this.legLeft.set(  'tx',  offset );
        this.legRight.set( 'tx', -offset );
      });

      // Hips height affects upper leg position.
      this.listenTo( this.hips, 'change:height', function() {
        this.upperLegLeft.trigger( 'change:height' );
        this.upperLegRight.trigger( 'change:height' );
      });

      // Chest height affects head and hips.
      this.listenTo( this.chest, 'change:height', function() {
        this.head.trigger( 'change:height' );
        this.hips.trigger( 'change:height' );
      });

      this.listenTo( this.chest, 'change:width', function() {
        var upperArmWidth = this.upperArmLeft.get( 'width' ),
            chestWidth = this.chest.get( 'width' );

        var offset = 0.5 * ( upperArmWidth + chestWidth ) + this.spacing;

        this.armLeft.set(  'tx',  offset );
        this.armRight.set( 'tx', -offset );
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
            y: -0.5 * ( childHeight + this.spacing )
          });

          // This callback usually handles grandchildren.
          if ( callback && callback.call ) {
            callback.call( this );
          }
        });
      }.bind( this );

      attachBone( 'chest', 'hips' );

      // Attach limb bones.
      [ 'Left', 'Right' ].forEach(function( direction ) {
        // Attach arm bones.
        var upperArm = 'upperArm' + direction,
            lowerArm = 'lowerArm' + direction,
            hand = 'hand' + direction;

        this[ upperArm ].on( 'change:height', function() {
          this[ lowerArm ].trigger( 'change:height' );
        }, this );

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
    },

    toJSON: function() {
      var jsonObject = {};

      // Attach parts.
      var view, model;
      parts.forEach(function( part ) {
        view = this[ part + 'View' ];
        model = this[ part ];

        // Use .toJSON() to avoid changing the original models.
        var partJSON = model.toJSON();
        partJSON.transforms = view.transforms.toJSON();
        partJSON.transformOrigin = view.transformOrigin.toJSON();

        jsonObject[ part ] = partJSON;
      }.bind( this ));

      // Attach left-right limb offsets.
      leftRightOffsets.forEach(function( key ) {
        jsonObject[ key ] = this[ key ].toJSON();
      }.bind( this ));

      jsonObject.spacing = this.spacing;

      return jsonObject;
    }
  });

  Object.defineProperty( SkeletonView.prototype, 'spacing', {
    get: function() {
      return this.spacingView.model.get( 't' );
    }
  });

  return SkeletonView;
});
