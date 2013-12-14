/*globals define*/
define(function( require ) {
  'use strict';

  var _ = require( 'underscore' );
  var Backbone = require( 'backbone' );

  var Circle = require( 'geometry/models/circle' );
  var Path = require( 'geometry/models/path' );
  var Rect = require( 'geometry/models/rect' );

  var CircleView = require( 'geometry/views/circle-view' );
  var PathView = require( 'geometry/views/path-view' );
  var RectView = require( 'geometry/views/rect-view' );

  var groupTemplate = require( 'text!geometry/templates/group-view.html' );

  function viewClassForModel( model ) {
    if ( model instanceof Circle ) {
      return CircleView;
    } else if ( model instanceof Path ) {
      return PathView;
    } else if ( model instanceof Rect ) {
      return RectView;
    }

    return null;
  }

  var GroupView = Backbone.View.extend({
    template: _.template( groupTemplate ),

    initialize: function( options ) {
      _.bindAll( this, 'render' );
      this.listenTo( this.collection, 'add remove reset', this.render );

      this.objectView = null;

      // Create element container for objectView.
      var element = options.objectEl;
      this.$objectEl = element instanceof Backbone.$ ? element : Backbone.$( element );
      this.objectEl = this.$objectEl[0];

      this.selectedIndex = -1;
      if ( !_.isUndefined( options.selectedIndex ) ) {
        this.renderIndex( options.selectedIndex );
      }
    },

    events: {
      'change select': 'onSelect'
    },

    render: function() {
      this.$el.html(this.template({
        Circle: Circle,
        Path: Path,
        Rect: Rect,
        collection: this.collection,
        selectedIndex: this.selectedIndex
      }));

      return this;
    },

    onSelect: function( event ) {
      this.renderIndex( event.currentTarget.selectedIndex );
    },

    renderIndex: function( index ) {
      // Don't render if index is out of bounds.
      if ( 0 > index || index >= this.collection.length ) {
        return;
      }

      // Don't render if there's already an objectView of the object at index.
      if ( this.objectView && this.objectView.model === this.collection.at( index ) ) {
        return;
      }

      // Remove old objectView.
      if ( this.objectView ) {
        this.objectView.remove();
        this.objectView = null;
      }

      // Create new Object2DView for corresponding type.
      this.selectedIndex = index;
      var model = this.collection.at( this.selectedIndex );

      var View = viewClassForModel( model );
      if ( !View ) {
        return;
      }

      this.objectView = new View({
        model: model
      });

      this.objectView.render();
      this.$objectEl.append( this.objectView.el );

      this.listenTo( model, 'destroy', function() {
        this.objectView = null;
        // Render the view for the next selected model.
        this.renderIndex( this.selectedIndex );
      }.bind( this ));
    },

    remove: function() {
      Backbone.View.prototype.remove.call( this );
      if ( this.objectView ) {
        this.objectView.remove();
      }
    }
  });

  return GroupView;
});
