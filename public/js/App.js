define(['jquery', 'backbone', 'marionette', 'underscore', 'handlebars'],
    function ($, Backbone, Marionette, _, Handlebars) {
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