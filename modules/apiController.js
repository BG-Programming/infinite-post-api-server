module.exports.route = function(app)
{
	const api = require("./libs/api.js");

	api.init(app);

	require("./user/userController.js" ).route(api, app);
	require("./post/postController.js").route(api, app);
};