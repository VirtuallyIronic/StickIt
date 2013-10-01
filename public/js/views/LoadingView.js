define( [ 'App', 'marionette', 'handlebars', 'models/Model', 'text!templates/loading.html'],
    function( App, Marionette, Handlebars, Model, template) {
        //ItemView provides some default rendering logic
        return Marionette.ItemView.extend( {
            //Template HTML string
            template: Handlebars.compile(template),
        });
    });