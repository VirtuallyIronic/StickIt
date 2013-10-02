define([
    'App',
    'backbone',
    'marionette',
    'views/logo/logoLargeView',
    'views/logo/logoSmallView',
    'views/widget/widgetView',
    'views/nav/navView',
    'views/page/aboutView',
    'views/page/contactView',
    'views/page/downloadView',
    'views/page/indexView',
    'views/page/loginView',
    'views/page/registerView',
    'views/footer/footerView',
    'models/CurrentUser'], 
	function(
		App,
		Backbone,
		Marionette,
		logoLargeView,
		logoSmallView,
		widgetView,
		navView,
		aboutView,
		contactView,
		downloadView,
		indexView,
		loginView,
		registerView,
		footerView,
		modelCurrentUser
	){
	var CurrentUser = new modelCurrentUser();
	setInterval(function(){
		CurrentUser.fetch();
	}, 5000);
	
	return Backbone.Marionette.Controller.extend({
		initialize:function (options) {
			this.index();
		},
		index:function () {
			App.logoRegion.show(new logoSmallView());
			App.widgetRegion.show(new widgetView({model: CurrentUser}));
			App.navRegion.show(new navView());
			App.mainRegion.show(new indexView());
			App.footerRegion.show(new footerView());
        },
        about:function () {
        	App.mainRegion.show(new aboutView());
        },
        contact:function () {
        	App.mainRegion.show(new contactView());
        },
        download:function () {
        	App.mainRegion.show(new downloadView());
        },
        login:function () {
        	App.mainRegion.show(new loginView());
        },
        register: function () {
        	App.mainRegion.show(new registerView());
        },
        error: function () {
        	
        }
    });
});