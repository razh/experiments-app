/*globals define*/
define([
  'backbone'
], function( Backbone ) {
  'use strict';

  var Editor = Backbone.Model.extend({
    defaults: function() {
      return {
        width: 512,
        height: 512
      };
    }
  });

  return Editor;
});
