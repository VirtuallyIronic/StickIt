define(['jquery', 'backbone', 'marionette', 'backbone-relational', 'underscore', 'handlebars'],
    function ($, Backbone, Marionette, Relational, _, Handlebars) {
        var App = new Backbone.Marionette.Application();

        App.addRegions({
        	logoRegion:"#logoRegion",
        	widgetRegion: "#widgetRegion",
        	navRegion: "#navRegion",
        	mainRegion: "#mainRegion",
        	footerRegion: "#footerRegion"
        });

        App.addInitializer(function (options) {
            Backbone.history.start({pushState: true});
        });

        return App;
    });