/*globals requirejs, define*/
requirejs.config({
  shim: {
    'underscore': {
      exports: '_'
    },
    'backbone': {
      deps: [ 'jquery', 'underscore' ],
      exports: 'Backbone'
    }
  },

  paths: {
    'backbone': '../../app/components/backbone/backbone-min',
    'jquery': '../../app/components/jquery/jquery.min',
    'underscore': '../../app/components/underscore/underscore-min',
    'text': '../../app/components/requirejs-text/text'
  }
});

define(function( require ) {
  'use strict';

  var _ = require( 'underscore' ),
      $ = require( 'jquery' );

  var Transform     = require( 'models/transform' ),
      Transforms    = require( 'collections/transforms' ),
      TransformView = require( 'views/transform-view' );

  var Box     = require( 'models/box' ),
      BoxView = require( 'views/box-view' );

  var SkeletonView = require( 'views/skeleton-view' );

  var robotTemplate = require( 'text!templates/robot.html' );

  var $robot = $( '.robot' );
  $robot.html( _.template( robotTemplate ) );

  // Haphazard configuration object.
  var config = (function() {
    var head = {
      width: 40,
      height: 40,
      depth: 40
    };

    var chest = {
      width: 80,
      height: 100,
      depth: 35
    };

    var hips = {
      width: 50,
      height: 30,
      depth: 35
    };

    var arm = {
      width: 20,
      depth: 20
    };

    var upperArm = {
      width: arm.width,
      height: 60,
      depth: arm.depth
    };

    var lowerArm = {
      width: arm.width,
      height: 40,
      depth: arm.depth
    };

    var hand = {
      width: arm.width,
      height: 20,
      depth: arm.depth
    };

    var leg = {
      width: 25,
      depth: 25
    };

    // Note: the femur should be ~26% of body height.
    var upperLeg = {
      width: leg.width,
      height: 50,
      depth: leg.depth
    };

    // Femur:tibia ratio should be 56:44. This guy's proportions are out of wack.
    var lowerLeg = {
      width: leg.width,
      height: 70,
      depth: leg.depth
    };

    var foot = {
      width: 30,
      height: 15,
      depth: 50
    };

    var spacing = 10;

    var headOffsetY = 0.5 * ( head.height + chest.height ) + spacing;
    var hipsOffsetY = 0.5 * ( hips.height + chest.height ) + spacing;

    var armOffsetX = 0.5 * ( arm.width + chest.width ) + spacing;
    var lowerArmOffsetY = 0.5 * ( lowerArm.height + upperArm.height ) + spacing;
    var handOffsetY = 0.5 * ( hand.height + lowerArm.height ) + spacing;

    // Position legs such that they line up with the hips.
    var legOffsetX = 0.5 * hips.width;

    var upperLegOffsetY = 0.5 * ( upperLeg.height + hips.height ) + spacing;
    var lowerLegOffsetY = 0.5 * ( lowerLeg.height + upperLeg.height ) + spacing;
    var footOffsetY = 0.5 * ( foot.height + lowerLeg.height ) + spacing;

    return {
      head: {
        dimensions: [ head.width, head.height, head.depth ],
        translate3d: [ 0, -headOffsetY, 0 ],
      },
      chest: {
        dimensions: [ chest.width, chest.height, chest.depth ]
      },
      hips: {
        dimensions: [ hips.width, hips.height, hips.depth ],
        translate3d: [ 0, hipsOffsetY, 0 ],
        transformOrigin: [ 0, -0.5 * ( hips.height + spacing ) ]
      },

      'upper-arm': {
        dimensions: [ upperArm.width, upperArm.height, upperArm.depth ],
        transformOrigin: [ 0, -0.5 * ( upperArm.height + spacing ) ]
      },
      'lower-arm': {
        dimensions: [ lowerArm.width, lowerArm.height, lowerArm.depth ],
        translate3d: [ 0, lowerArmOffsetY, 0 ],
        transformOrigin: [ 0, -0.5 * ( lowerArm.height + spacing ) ]
      },
      hand: {
        dimensions: [ hand.width, hand.height, hand.depth ],
        translate3d: [ 0, handOffsetY, 0 ],
        transformOrigin: [ 0, -0.5 * ( hand.height + spacing ) ]
      },
      'arm-left': [ armOffsetX ],
      'arm-right': [ -armOffsetX ],

      'upper-leg': {
        dimensions: [ upperLeg.width, upperLeg.height, upperLeg.depth ],
        translate3d: [ 0, upperLegOffsetY, 0 ],
        transformOrigin: [ 0, -0.5 * ( upperLeg.height + spacing ) ]
      },
      'lower-leg': {
        dimensions: [ lowerLeg.width, lowerLeg.height, lowerLeg.depth ],
        translate3d: [ 0, lowerLegOffsetY, 0 ],
        transformOrigin: [ 0, -0.5 * ( lowerLeg.height + spacing ) ]
      },
      foot: {
        dimensions: [ foot.width, foot.height, foot.depth ],
        translate3d: [ 0, footOffsetY, 0.2 * foot.depth ],
        transformOrigin: [ 0, -0.5 * ( foot.height + spacing ) ]
      },
      'leg-left': [ legOffsetX ],
      'leg-right': [ -legOffsetX ]
    };
  }) ();

  function createBoxViews( name ) {
    var views = $robot.find( '.' + name ).toArray().map(function( element ) {
      return new BoxView({
        el: element,
        model: new Box( config[ name ].dimensions ),
        transforms: new Transforms([
          new Transform.Translate3D( config[ name ].translate3d ),
          new Transform.RotateX(),
          new Transform.RotateY(),
          new Transform.RotateZ()
        ]),
        transformOrigin: new Transform.Origin( config[ name ].transformOrigin || {} )
      });
    });

    return views;
  }

  var $transformViews = $( '.transform-views' );

  var boxViews = [
    'head', 'chest', 'hips',
    'upper-arm', 'lower-arm', 'hand',
    'upper-leg', 'lower-leg', 'foot'
  ].map(function( className ) {
    var boxViews = createBoxViews( className );

    boxViews.forEach(function( view, index, array ) {
      view.render();

      var $transformEl = $( '<div>', { class: 'edit' } );

      var $dimensionEl = $( '<div>', { class: 'dimension' } ),
          $translateEl = $( '<div>', { class: 'translate' } );

      var $rotationsEl = $( '<div>', { class: 'rotations' } );

      var $rotateXEl = $( '<div>', { class: 'rotate rotateX' } ),
          $rotateYEl = $( '<div>', { class: 'rotate rotateY' } ),
          $rotateZEl = $( '<div>', { class: 'rotate rotateZ' } );

      $rotationsEl.append([
        $rotateXEl,
        $rotateYEl,
        $rotateZEl
      ]);

      // Unique ids if more than one of the same class.
      var id = className;
      if ( array.length > 1 ) {
        id += '-' + index;
      }

      $transformEl.append([
        $( '<input>', {
          class: 'checkbox',
          type: 'checkbox',
          id: id
        }),
        $( '<label>', {
          class: 'name',
          text: className,
          for: id
        }),
        $dimensionEl,
        $translateEl,
        $rotationsEl
      ]);

      $transformViews.append( $transformEl );

      var dimensionEl = new TransformView({
        el: $dimensionEl,
        model: view.model
      });

      dimensionEl.render();

      var translateView = new TransformView({
        el: $translateEl,
        model: view.transforms.at(0)
      });

      translateView.render();

      var rotateXView = new TransformView({
        el: $rotateXEl,
        model: view.transforms.at(1)
      });

      rotateXView.render();

      var rotateYView = new TransformView({
        el: $rotateYEl,
        model: view.transforms.at(2)
      });

      rotateYView.render();

      var rotateZView = new TransformView({
        el: $rotateZEl,
        model: view.transforms.at(3)
      });

      rotateZView.render();
    });

    return boxViews;
  });

  boxViews = _.flatten( boxViews );

  var directionTransforms = [
    'arm-left', 'arm-right',
    'leg-left', 'leg-right'
  ].map(function( className ) {
    var $element = $robot.find( '.' + className );
    var transform = new Transform.Translate3D( config[ className ] );

    $element.css({
      '-webkit-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d'
    });

    function onChange() {
      var transformString = transform.toString();

      $element.css({
        '-webkit-transform': transformString,
        transform: transformString,
      });
    }

    onChange();
    transform.on( 'change', onChange );

    return transform;
  });


  /**
   * Hack which assumes that there's a given order to the various boxViews.
   */
  function createSkeletonView( boxViews ) {
    return new SkeletonView({
      headView: boxViews[0],
      chestView: boxViews[1],
      hipsView: boxViews[2],

      upperArmLeftView: boxViews[3],
      upperArmRightView: boxViews[4],
      lowerArmLeftView: boxViews[5],
      lowerArmRightView: boxViews[6],
      handLeftView: boxViews[7],
      handRightView: boxViews[8],

      upperLegLeftView: boxViews[9],
      upperLegRightView: boxViews[10],
      lowerLegLeftView: boxViews[11],
      lowerLegRightView: boxViews[12],
      footLeftView: boxViews[13],
      footRightView: boxViews[14],

      armLeft: directionTransforms[0],
      armRight: directionTransforms[1],
      legLeft: directionTransforms[2],
      legRight: directionTransforms[3],

      spacing: 10
    });
  }

  createSkeletonView( boxViews );

  function onMouseMove( event ) {
    var rx = -( event.clientY / window.innerHeight - 0.5 ) * 180,
        ry =  ( event.clientX / window.innerWidth  - 0.5 ) * 180;

    var transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    $robot.css({
      '-webkit-transform': transform,
      transform: transform
    });
  }

  $( window ).on( 'mousemove', onMouseMove );
});
