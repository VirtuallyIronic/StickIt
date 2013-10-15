define(['jquery', 'backbone', 'marionette', 'backbone-relational', 'underscore', 'handlebars'],
    function ($, Backbone, Marionette, Relational, _, Handlebars) {
		// instantiate the application
        var App = new Backbone.Marionette.Application();

        // marionette regions in application
        // see https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.region.md for explaination on regions
        App.addRegions({
        	logoRegion:"#logoRegion",
        	widgetRegion: "#widgetRegion",
        	navRegion: "#navRegion",
        	mainRegion: "#mainRegion",
        	footerRegion: "#footerRegion"
        });

        // start the router and hash routes
        App.addInitializer(function (options) {
            Backbone.history.start({pushState: true});
        });

        return App;
    });