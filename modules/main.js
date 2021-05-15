module.exports.main = function( app )
{
	require('./apiController.js').route(app);
}