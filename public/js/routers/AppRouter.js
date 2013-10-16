
/**
 * StickIt by Virtually Ironic
 * Filename:		public/js/routers/appRouter.js
 * Purpose:			Marionette App Router Function Page.
 * Author:			Evan Scown
 * Contributors:	Evan Scown 
 */

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
           "permission": "home",
           "permissions/:id": "wallPermission",
           "register/success": "successfulRegistration",
           "users": "userList",
           "wallsetting": "home",
           "wallsettings/:id": "wallUpdateSettings",
           "newwall": "newWall",
           "index": "index",
           "error": "error"
       }
   });
});