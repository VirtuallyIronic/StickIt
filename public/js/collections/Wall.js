define(["jquery","backbone","models/Wall"],
  function($, Backbone, modelWall) {
    // Creates a new Backbone Collection class object
    var WallCollection = Backbone.Collection.extend({
      url: '/api/wall',
      model: modelWall
    });

    return WallCollection;
  });