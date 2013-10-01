require.config({
    baseUrl:"js",
    paths:{
        "jquery":"vendor/jquery",
        "underscore":"vendor/underscore",
        "backbone":"vendor/backbone",
        "marionette":"vendor/backbone.marionette",
        "handlebars":"vendor/handlebars",
        "text":"vendor/plugins/text",
        "templates":"../templates"
    },
    shim:{
        "bootstrap":["jquery"],
        "backbone":{
            "deps":["underscore"],
            "exports":"Backbone"
        },
        "marionette":{
            "deps":["underscore", "backbone", "jquery"],
            "exports":"Marionette"
        },
        "handlebars":{
            "exports":"Handlebars"
        }
    }
});

// Includes Desktop Specific JavaScript files here (or inside of your Desktop router)
require(["App", "routers/AppRouter", "controllers/Controller",  "jquery"],
    function (App, AppRouter, Controller) {
        App.appRouter = new AppRouter({
            controller:new Controller()
        });
        App.start();
    });