
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/init/Init.js
 * Purpose:			RequireJS Initialization of UI Application
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

require.config({
    baseUrl:"js",
    paths:{
        "jquery":"vendor/jquery",
        "underscore":"vendor/underscore",
        "backbone":"vendor/backbone",
        "marionette":"vendor/backbone.marionette",
        "backbone-relational":"vendor/backbone-relational",
        "handlebars":"vendor/handlebars",
        "text":"vendor/plugins/text",
        "transit":"vendor/jquery.transit.min",
        "settingsmenu":"utils/SettingsMenu",
        "bootstrap": "vendor/bootstrap.min",
        "json2" : "vendor/json2",
        "templates":"../templates"
    },
    shim:{
        "bootstrap":{
        	"deps":["jquery"],
        	"exports":"Bootstrap"
        },
        "backbone":{
            "deps":["underscore"],
            "exports":"Backbone"
        },
        "marionette":{
            "deps":["underscore", "backbone", "jquery"],
            "exports":"Marionette"
        },
        "backbone-relational":{
        	"deps":["underscore", "backbone", "jquery"],
        	"exports":"Relational"
        },
        "transit":{
        	"deps":["jquery"],
        	"exports":"Transit"
        },
        "settingsmenu": {
        	"deps":["jquery"],
        	"exports":"SettingsMenu"
        },
        "handlebars":{
            "exports":"Handlebars"
        }
    }
});

// Includes Specific JavaScript files here
require(["App", "routers/AppRouter", "controllers/Controller",  "jquery"],
    function (App, AppRouter, Controller) {
        App.appRouter = new AppRouter({
            controller:new Controller()
        });
        App.start();
    });