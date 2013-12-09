/*globals define*/
define([
  'backbone',
  'geometry/models/object2d'
], function( Backbone, Object2D ) {
  'use strict';

  var Group = Backbone.Collection.extend({
    model: Object2D
  });

  return Group;
});
