const assert 			= require("assert");
const { v4: uuidv4 } 	= require('uuid');
const error 			= require("./error.js");
const auth 				= require("./auth.js" );

function Utils()
{	

}

Utils.prototype.checkEmailFormat = function (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if( !re.test(String(email).toLowerCase()) )
    	throw error.newInstanceBadRequest("Invalid email format.");
}

Utils.prototype.createUuid = function()
{
	var strUuid = uuidv4();
	return strUuid.substr(0,8) + strUuid.substr(9,4) + strUuid.substr(14,4) + strUuid.substr(19,4) + strUuid.substr(24,12);
};



Utils.prototype.responseMessage = function( response,  jsonMessage )
{
	"use strict";
	response.writeHead( error.responseCodes.RESPONSE_CODE_OK, {"Content-Type" : "application/json"} );

	if( jsonMessage === undefined || jsonMessage === null )
		jsonMessage = {};
	response.end( JSON.stringify(jsonMessage) );
};


// 오류 처리 부분 설계시 처음에는 어떤 파리미터가 빠져 있는지, 혹은 undefined 되었는지 명시해서 알려주는 것도 고려하였다.
// 하지만 그렇게 할 경우 악의적인 사용자에게 내부 파라미터 정보가 노출될 위험이 있으므로 개략적인 오류만을 알려준다.
Utils.prototype.sendErrorMessage = function ( response, nResponseCode, nErrorCode, strMessage )
{
    "use strict";    
	var strMessageBuffer = (strMessage) ?  strMessage : error.getString(nErrorCode) ;
	console.log("strMessageBuffer : " + strMessageBuffer);

	response.writeHead( nResponseCode, {"Content-Type" : "application/json"} );
	var jsonResult = 
	{
		code : nErrorCode,
		msg : strMessageBuffer
	};
	response.end( JSON.stringify( jsonResult ) );
};


Utils.prototype.sendErrorMessageInternalServerError = function( response )
{
    "use strict";
    console.log("error.getString( error.Codes.ERROR_CODE_INTERNAL_SERVER_ERROR ) : " + error.getString( error.Codes.ERROR_CODE_INTERNAL_SERVER_ERROR )) ;
	this.sendErrorMessage( 
		response,  
		error.responseCodes.RESPONSE_CODE_INTERNAL_SERVER_ERROR,
		error.Codes.ERROR_CODE_INTERNAL_SERVER_ERROR,
		error.getString( error.Codes.ERROR_CODE_INTERNAL_SERVER_ERROR )
	);	
};

Utils.prototype.defaultErrorProcess = function( response, e )
{
    "use strict";        
	assert( e !== undefined );
	if( e instanceof error.AppError )
	{
		if( e.httpResponseCode !== error.responseCodes.RESPONSE_CODE_INTERNAL_SERVER_ERROR  )
		{		
			console.log("default error process : " + e.detailMessage);
			this.sendErrorMessage( response, e.httpResponseCode,  e.code, e.detailMessage );	
			return ;
		}

	}
		
	// 내부 오류 메세지는 클라이언트에 자세한 사항을 알려주지 않는다.	
	console.log( e );
	this.sendErrorMessageInternalServerError( response );
};

Utils.prototype.checkSecurityTokenAndRequiredParameter = function( strSecurityToken /* ... */ )
{
    "use strict";

	if( strSecurityToken === null || auth.isValidSecurityToken( strSecurityToken ) === false )
		throw new error.AppError( error.responseCodes.RESPONSE_CODE_UNAUTHORIZED, error.Codes.ERROR_CODE_INVALID_SECURITY_TOKEN );
	
	for( var i = 1;		i < arguments.length;	++i )
	{
		if( arguments[i] === null || arguments[i] === undefined )
			throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
	}

	return strSecurityToken;
};



Utils.prototype.getUserInfoIfExist = function( request )
{
	var strSecurityToken = request.header("Authorization");
	var userInfo = null;
	if( strSecurityToken ) 
		userInfo = auth.getUserInfoWithSecurityToken( strSecurityToken );
	return userInfo;
}


Utils.prototype.getUserInfoAndRejectNotMember = function( request ) {
	const strSecurityToken = request.header("Authorization");
	if( !strSecurityToken )
		throw error.newInstanceNotMemberError();	
	const userInfo = auth.getUserInfoWithSecurityToken( strSecurityToken );
	if( !userInfo )
		throw error.newInstanceNotMemberError();
	return userInfo;

}

Utils.prototype.getPropertyOrNull = function(obj, propName) {
	if (obj === null || obj === undefined) {
		return null;
	} else {
		return obj[propName];
	}
}

Utils.prototype.getUserIdFromUserInfo = function(userInfo) {
	return _utilsInstance.getPropertyOrNull(userInfo, 'userId');
}


Utils.prototype.checkAuthorityAndRequiredParameter = function( request /* ... */ ) {
    "use strict";	    
	return _utilsInstance.checkSecurityTokenAndRequiredParameter( request.header("Authorization") );
};



Utils.prototype.checkRequiredParameter = function ( /* ... */ )
{
    "use strict";
	for( var i = 0;		i < arguments.length;	++i )
	{
		if( arguments[i] === null || arguments[i] === undefined )
			throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
	}
};


Utils.prototype.checkRequiredBooleanParameter = function ( /* ... */ )
{
    "use strict";
	for( var i = 0;		i < arguments.length;	++i )
	{
		if( arguments[i] === undefined || arguments[i] === null || arguments[i].constructor !== Boolean    )
		{
			console.log("Fail - checkRequiredBooleanParameter : " + i);
			throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
		}
	}
};


Utils.prototype.checkRequiredStringParameter = function ( /* ... */ )
{
    "use strict";
	for( var i = 0;		i < arguments.length;	++i )
	{
		if( arguments[i] === undefined || arguments[i] === null || arguments[i].constructor !== String  )
		{
			console.log("Fail - checkRequiredStringParameter : " + i);
			throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
		}
	}
};


Utils.prototype.checkRequiredNumberParameter = function ( /* ... */ )
{
    "use strict";
	for( var i = 0;		i < arguments.length;	++i )
	{
		if( arguments[i] === undefined || arguments[i] === null || arguments[i].constructor !== Number || isNaN(arguments[i]) === true )
		{
			console.log("Fail - checkRequiredNumberParameter : " + i);
			throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
		}
	}
};

Utils.prototype.checkRequiredArrayParameter = function ( /* ... */ )
{
	"use strict";
    for( var i = 0;     i < arguments.length;   ++i )
    {
        if( arguments[i] === undefined || arguments[i] === null || arguments[i].constructor !== Array )
        {
        	console.log("Fail - checkRequiredArrayParameter : " + i);
            throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
        }
    }
};





// Check Optional
Utils.prototype.checkOptionalNumberParameter = function( /* ... */ ) {
    "use strict";
	for( var i = 0;		i < arguments.length;	++i ) {
		if( arguments[i] && arguments[i].constructor !== Number  ) {
			console.log("Fail - checkOptionalNumberParameter : " + i);
			throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
		}
	}
};


Utils.prototype.checkOptionalBooleanParameter = function( /* ... */ ) {
    "use strict";
	for( var i = 0;		i < arguments.length;	++i ) {
		if( arguments[i] && arguments[i].constructor !== Boolean  ) {
			console.log("Fail - checkOptionalBooleanParameter : " + i);
			throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
		}
	}
};




Utils.prototype.checkOptionalStringParameter = function( /* ... */ ) {
    "use strict";
	for( var i = 0;		i < arguments.length;	++i ) {
		if( arguments[i] && arguments[i].constructor !== String  ) {
			console.log("Fail - checkOptionalStringParameter : " + i);
			throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
		}
	}
};



Utils.prototype.checkOptionalNumberArrayParameter = function( /* ... */ ) {
    "use strict";
	for( let i = 0;		i < arguments.length;	++i )  {
		if( arguments[i] ) {
			if( arguments[i].constructor === Array  )  {
				let array = arguments[i];
				for( let idx = 0;		idx < array.length;		++idx  ) {
					if( array[idx] === undefined || array[idx] === null || array[idx].constructor !== Number   )  {
						console.log("Fail - checkOptionalNumberArrayParameter - intenal param : " + idx);
						throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
					}
				}				
			} else  {
				console.log("Fail - checkOptionalNumberArrayParameter : " + i);
				throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
			}
		}
	}
};


Utils.prototype.checkOptionalStringArrayParameter = function( /* ... */ ) {
    "use strict";
	for( let i = 0;		i < arguments.length;	++i )  {
		if( arguments[i] ) {
			if( arguments[i].constructor === Array  )  {
				let array = arguments[i];
				for( let idx = 0;		idx < array.length;		++idx  ) {
					if( array[idx] === undefined || array[idx] === null || array[idx].constructor !== String   )  {
						console.log("Fail - checkOptionalNumberArrayParameter - intenal param : " + idx);
						throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
					}
				}				
			} else  {
				console.log("Fail - checkOptionalNumberArrayParameter : " + i);
				throw new error.AppError( error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_INVALID_PARAMETERS );
			}
		}
	}
};



const _utilsInstance = new Utils();
module.exports = _utilsInstance;