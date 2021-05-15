var path = require('path');

var Define = 
{	
	// MODE : [ Debug, Release ]
	MODE : "Debug",

	DIR : "/",
	
	path : 
	{
		root : path.resolve(__dirname, "../../"),
		web : path.resolve(__dirname, "../../public"),
		upload : path.resolve(__dirname, "../../public/upload"),
	},

	userType : {
		SUPER_ADMIN : 'admin',
		USER : 'user'
	},

	db : {
		
	},	
	
};


module.exports = Define;
