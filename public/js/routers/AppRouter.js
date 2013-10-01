define(['marionette', 'controllers/Controller'], function(Marionette, Controller) {
   return Marionette.AppRouter.extend({
       //"index" must be a method in AppRouter's controller
       appRoutes: {
           "": "index",
           "about": "about",
           "contact": "contact",
           "download": "download",
           "login": "login",
           "register": "register"
       }
   });
});