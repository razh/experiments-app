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
        transformOrigin: [ 0, -0.5 * hips.height ]
      },

      'upper-arm': {
        dimensions: [ upperArm.width, upperArm.height, upperArm.depth ],
        transformOrigin: [ 0, -0.5 * upperArm.height ]
      },
      'lower-arm': {
        dimensions: [ lowerArm.width, lowerArm.height, lowerArm.depth ],
        translate3d: [ 0, lowerArmOffsetY, 0 ],
        transformOrigin: [ 0, -0.5 * lowerArm.height ]
      },
      hand: {
        dimensions: [ hand.width, hand.height, hand.depth ],
        translate3d: [ 0, handOffsetY, 0 ],
        transformOrigin: [ 0, -0.5 * hand.height ]
      },
      'arm-left': [ armOffsetX ],
      'arm-right': [ -armOffsetX ],

      'upper-leg': {
        dimensions: [ upperLeg.width, upperLeg.height, upperLeg.depth ],
        translate3d: [ 0, upperLegOffsetY, 0 ],
        transformOrigin: [ 0, -0.5 * upperLeg.height ]
      },
      'lower-leg': {
        dimensions: [ lowerLeg.width, lowerLeg.height, lowerLeg.depth ],
        translate3d: [ 0, lowerLegOffsetY, 0 ],
        transformOrigin: [ 0, -0.5 * lowerLeg.height ]
      },
      foot: {
        dimensions: [ foot.width, foot.height, foot.depth ],
        translate3d: [ 0, footOffsetY, 10 ],
        transformOrigin: [ 0, -0.5 * foot.height ]
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

  [
    'head', 'chest', 'hips',
    'upper-arm', 'lower-arm', 'hand',
    'upper-leg', 'lower-leg', 'foot'
  ].forEach(function( className ) {
    createBoxViews( className ).forEach(function( view, index, array ) {
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
      })

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
  });

  [ 'arm-left', 'arm-right', 'leg-left', 'leg-right' ].map(function( className ) {
    var transforms = new Transforms([
      new Transform.Translate3D( config[ className ] )
    ]);

    var transformsString = transforms.toString();

    $robot.find( '.' + className ).css({
      '-webkit-transform': transformsString,
      transform: transformsString,

      '-webkit-transform-style': 'preserve-3d',
      'transform-style': 'preserve-3d'
    });

    return transforms;
  });


  function onMouseMove( event ) {
    var rx =   ( 0.5 - ( event.clientY / window.innerHeight ) ) * 180,
        ry =  -( 0.5 - ( event.clientX / window.innerWidth  ) ) * 180;

    var transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)';
    $robot.css({
      '-webkit-transform': transform,
      transform: transform
    });
  }

  $( window ).on( 'mousemove', onMouseMove );
});
