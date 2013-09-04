require.config({
	paths: {
		jquery: "libs/jquery/jquery",
		underscore: "libs/underscore-amd/underscore",
		backbone: "libs/backbone-amd/backbone",
		templates: "../templates"
	}
});

require(['app'], function(App){
	App.initialize();
});