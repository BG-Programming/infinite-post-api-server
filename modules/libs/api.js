const utils = require("./utils.js");
const error = require("./error.js");

async function defaultProc(request, response, fnExecute) {
	"use strict";    
    try {
        const userInfo = utils.getUserInfoAndRejectNotMember( request );
        if( !userInfo )
    		throw error.newInstanceForbiddenError();
    	
        const result = await fnExecute(userInfo, request.params, request.body);
        return utils.responseMessage( response, result );
    }
    catch(err) {
        return utils.defaultErrorProcess( response, err );
    }

}

async function defaultProcWithGuest(request, response, fnExecute) {
	"use strict";    
    try {
		console.log('?????????')
    	const userInfo = utils.getUserInfoIfExist(request);
		console.log('?????????')
        const result = await fnExecute(userInfo, request.params, request.body);
        return utils.responseMessage( response, result );
    }
    catch(err) {
        return utils.defaultErrorProcess( response, err );
    }
}

class API 
{	
	constructor() {
		this.app = null;
		this.guest = {
			get : async function(strUrl, fnExecute)  {				
				api.app.get(strUrl, async (request, response)=>{
					await defaultProcWithGuest(request, response, fnExecute );
				});
			},
			post : async function(strUrl, fnExecute)  {		
				console.log('웅캬캬');
				api.app.post(strUrl, async (request, response)=>{
					console.log('웅캬캬12321312312')
					await defaultProcWithGuest(request, response, fnExecute );
				});
			},
			put : async function(strUrl, fnExecute)  {				
				api.app.put(strUrl, async (request, response)=>{
					await defaultProcWithGuest(request, response, fnExecute );
				});
			},
			delete : async function(strUrl, fnExecute)  {				
				api.app.delete(strUrl, async (request, response)=>{
					await defaultProcWithGuest(request, response, fnExecute );
				});
			}
		};
	}

	init(app) {
		this.app = app;		
	}

	get(strUrl, fnExecute) {
		this.app.get(strUrl, async (request, response)=>{
			await defaultProc(request, response, fnExecute );
		});
	}

	post(strUrl, fnExecute) {
		this.app.post(strUrl, async (request, response)=>{
			await defaultProc(request, response, fnExecute );
		});
	}

	put(strUrl, fnExecute) {
		this.app.put(strUrl, async (request, response)=>{
			await defaultProc(request, response, fnExecute );
		});
	}

	delete(strUrl, fnExecute) {
		this.app.delete(strUrl, async (request, response)=>{
			await defaultProc(request, response, fnExecute );
		});
	}


}


var api = new API();
module.exports = api;
