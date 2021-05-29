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
		const userInfo = utils.getUserInfoIfExist(request);
		const result = await fnExecute(userInfo, request.params, request.body);
		return utils.responseMessage( response, result );
	}
	catch(err) {
		return utils.defaultErrorProcess( response, err );
	}
}

function API() {
	let _app = null;

	function _get(strUrl, fnExecute) {
		_app.get(strUrl, async (request, response)=>{
			await defaultProc(request, response, fnExecute );
		});
	}

	function _post(strUrl, fnExecute) {
		_app.post(strUrl, async (request, response)=>{
			await defaultProc(request, response, fnExecute );
		});
	}

	function _put(strUrl, fnExecute) {
		_app.put(strUrl, async (request, response)=>{
			await defaultProc(request, response, fnExecute );
		});
	}

	function _delete(strUrl, fnExecute) {
		_app.delete(strUrl, async (request, response)=>{
			await defaultProc(request, response, fnExecute );
		});
	}

	const guest = {
		get : async function(strUrl, fnExecute)  {				
			_app.get(strUrl, async (request, response)=>{
				await defaultProcWithGuest(request, response, fnExecute );
			});
		},
		post : async function(strUrl, fnExecute) {
			_app.post(strUrl, async (request, response)=>{
				await defaultProcWithGuest(request, response, fnExecute );
			});
		},
		put : async function(strUrl, fnExecute)  {				
			_app.put(strUrl, async (request, response)=>{
				await defaultProcWithGuest(request, response, fnExecute );
			});
		},
		delete : async function(strUrl, fnExecute)  {				
			_app.delete(strUrl, async (request, response)=>{
				await defaultProcWithGuest(request, response, fnExecute );
			});
		}
	};;

	return {
		init: function (app) {
			_app = app;
		},
		guest,
		get: _get,
		post: _post,
		put: _put,
		delete: _delete
	}
}

var api = API();
module.exports = api;
