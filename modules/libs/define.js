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

	postLikeType: {
		like: 'like',
		dislike: 'dislike',
		isValid: (str) => {
			console.log('?>>>>', this.like, str)
			return str === 'like' || str === 'dislike';
		}
	},

	db : {
		
	},	
	
};


module.exports = Define;
