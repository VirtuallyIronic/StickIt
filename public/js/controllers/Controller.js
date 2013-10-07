define([
    'App',
    'backbone',
    'marionette',
    'views/logo/logoSmallView',
    'views/widget/widgetView',
    'views/nav/navView',
    'views/page/aboutView',
    'views/page/contactView',
    'views/page/indexView',
    'views/page/loginView',
    'views/page/registerView',
    'views/footer/footerView',
    'views/page/homeView',
    'models/CurrentUser'], 
	function(
		App,
		Backbone,
		Marionette,
		logoSmallView,
		widgetView,
		navView,
		aboutView,
		contactView,
		indexView,
		loginView,
		registerView,
		footerView,
		homeView,
		modelCurrentUser
	){
	var CurrentUser = new modelCurrentUser();
	//var WallsList = new modelWallsList();
	setInterval(function(){
		CurrentUser.fetch();
		//WallsList.fetch();
	}, 5000);
	
	return Backbone.Marionette.Controller.extend({
		initialize:function (options) {
			App.logoRegion.show(new logoSmallView());
			App.widgetRegion.show(new widgetView({model: CurrentUser}));
			App.navRegion.show(new navView({model: CurrentUser}));
			App.footerRegion.show(new footerView());
		},
		index:function () {
			App.mainRegion.show(new indexView());
        },
        about:function () {
        	App.mainRegion.show(new aboutView());
        },
        contact:function () {
        	App.mainRegion.show(new contactView());
        },
        login:function () {
        	App.mainRegion.show(new loginView());
        },
        register: function () {
        	App.mainRegion.show(new registerView());
        },
        home: function() {
        	App.mainRegion.show(new homeView());
        },
        error: function () {
        	
        }
    });
});