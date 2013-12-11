/*globals define*/
define(function( require ) {
  'use strict';

  var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var Circle = require( 'geometry/models/circle' );
  var Path = require( 'geometry/models/path' );
  var Rect = require( 'geometry/models/rect' );

  var groupTemplate = require( 'text!geometry/templates/group-view.html' );

  var GroupView = Backbone.View.extend({
    template: _.template( groupTemplate ),

    initialize: function() {
      _.bindAll( this, 'render' );
      this.listenTo( this.collection, 'change add remove reset', this.update );
    },

    render: function() {
      this.$el.html(this.template({
        Circle: Circle,
        Path: Path,
        Rect: Rect,
        collection: this.collection
      }));

      return this;
    }
  });

  return GroupView;
});
