define(['marionette', 'controllers/Controller'], function(Marionette, Controller) {
   return Marionette.AppRouter.extend({
       //"index" must be a method in AppRouter's controller
       appRoutes: {
           "": "index",
           "about": "about",
           "contact": "contact",
           "login": "login",
           "register": "register",
           "home": "home",
           "wall": "home",
           "wall/:id": "wall",
           "permissions/:id": "wallPermission",
           "register/success": "successfulRegistration",
           "users": "userList"
       }
   });
});