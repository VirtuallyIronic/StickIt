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
    'views/page/errorView',
    'views/page/wallPermissionView',
    'views/page/successfulRegistrationView',
    'views/page/userListView',
    'view/page/wallSettingsView',
    'models/CurrentUser',
    'models/WallPermission',
    'models/WallList',
    'models/UserList',
    'models/WallSetting'], 
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
		errorView,
		wallPermissionView,
		successfulRegistrationView,
		userListView,
		wallSettingView,
		modelCurrentUser,
		modelWallPermission,
		modelWallList,
		modelUserList,
		modelWallSetting
	){
	var CurrentUser = new modelCurrentUser();
	setInterval(function(){
		CurrentUser.fetch();
	}, 2000);
	
	return Backbone.Marionette.Controller.extend({
		initialize:function (options) {
			App.logoRegion.show(new logoSmallView());
			App.widgetRegion.show(new widgetView({model: CurrentUser}));
			App.navRegion.show(new navView({model: CurrentUser}));
			App.footerRegion.show(new footerView());
			CurrentUser.fetch();
		},
		index:function () {
			App.mainRegion.show(new indexView());
			CurrentUser.fetch();
        },
        about:function () {
        	App.mainRegion.show(new aboutView());
        	CurrentUser.fetch();
        },
        contact:function () {
        	App.mainRegion.show(new contactView());
        	CurrentUser.fetch();
        },
        login:function () {
        	App.mainRegion.show(new loginView());
        	CurrentUser.fetch();
        },
        register: function () {
        	App.mainRegion.show(new registerView());
        	CurrentUser.fetch();
        },
        home: function() {
        	var WallList = new modelWallList();
        	setInterval(function(){
        		WallList.fetch();
        	}, 2000);
        	App.mainRegion.show(new homeView({ model: WallList }));
        	WallList.fetch();
        },
        error: function () {
        	App.mainRegion.show(new errorView());
        },
        wall: function(id) {
        	window.location.replace('/wall.html?' + id);
        },
        wallPermission: function(id) {
        	var WallPermission = new modelWallPermission({ id: id });
        	setInterval(function(){
        		WallPermission.fetch();
        	}, 2000);
        	WallPermission.fetch();
        	App.mainRegion.show(new wallPermissionView({ model: WallPermission }));
        },
        successfulRegistration: function(){
        	App.mainRegion.show(new successfulRegistrationView());
        },
        userList: function(){
        	var UserList = new modelUserList();
        	setInterval(function(){
        		UserList.fetch();
        	}, 2000);
        	App.mainRegion.show(new userListView({ model: UserList }));
        	UserList.fetch();
        },
        wallSetting: function(id){
        	var WallSetting = new modelWallSetting({ id: id });
        	setInterval(function(){
        		WallSetting.fetch();
        	}, 2000);
        	WallSetting.fetch();
        	App.mainRegion.show(new wallSettingView({ model: WallSetting }));
        }
    });
});