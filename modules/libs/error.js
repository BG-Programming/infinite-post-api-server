const assert = require("assert");

// Reference : http://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
const ResponseCodes =
{
	RESPONSE_CODE_OK : 200,
	RESPONSE_CODE_NOT_MODIFIED : 304,
	RESPONSE_BAD_REQUEST : 400,
	RESPONSE_CODE_UNAUTHORIZED : 401,
	RESPONSE_CODE_FORBIDDEN : 403,
	RESPONSE_CODE_NOT_FOUND : 404,
	RESPONSE_CODE_INTERNAL_SERVER_ERROR : 500
};

const ErrorCodes =
{
	// 18xx 번대 : 자주 일어나는 특수 코드
	ERROR_CODE_INVALID_USER_ID_OR_PASSWORD : 1818,
	ERROR_CODE_INVALID_PARAMETERS : 1828,
	ERROR_CODE_INTERNAL_SERVER_ERROR : 1838,
	ERROR_CODE_DATA_NOT_FOUND : 1839,
	ERROR_CODE_VERSION_CHECK_FAILED : 1840,

	// 2000 번대 : 인증 및 권한 관련
	ERROR_CODE_INVALID_SECURITY_TOKEN : 2000,
	ERROR_CODE_DIFFERENCE_USER_ID_AND_SECURITY_TOKEN  : 2001,
	ERROR_CODE_FORBIDDEN : 2002,
	ERROR_CODE_FORBIDDEN_POLICY_NOT_AGREE : 2003,
	ERROR_CODE_EXPIRED : 2004,

	// 3000 번대 : 유저 관련
	ERROR_CODE_USER_NOT_FOUND : 3000,
	ERROR_CODE_USER_NOT_EXISTS : 3006,

	// 4000 번대 : 일반
	ERROR_DUPLICATE_NAME : 4000,
	ERROR_DUPLICATE_DATA : 4001,	
	ERROR_BAD_REQUEST : 4002,
};

function AppError( nResponseCode, nAppErrorCode, strDetailMessage )
{
    "use strict";
	if( strDetailMessage === undefined )
		strDetailMessage = "";

	this.httpResponseCode = nResponseCode;
	this.code = nAppErrorCode;
	this.message = getErrorString( nAppErrorCode );
	this.detailMessage = strDetailMessage;
}

function newInstanceInternalServerError(  strMessage ) {
    "use strict";
	return new AppError(ResponseCodes.RESPONSE_CODE_INTERNAL_SERVER_ERROR, ErrorCodes.ERROR_CODE_INTERNAL_SERVER_ERROR, strMessage);
}

function newInstanceForbiddenError() {
    "use strict";
	return new AppError(ResponseCodes.RESPONSE_CODE_FORBIDDEN, ErrorCodes.ERROR_CODE_FORBIDDEN );
}

function newInstanceNotMemberError() {
    "use strict";
	return new AppError(ResponseCodes.RESPONSE_CODE_UNAUTHORIZED, ErrorCodes.ERROR_CODE_INVALID_SECURITY_TOKEN );
}

// 약관등에 동의하지 않음으로써 접근을 허용하지 않는다.
function newInstanceForbiddenWithPolicyNotAgreeError()
{
    "use strict";
	return new AppError(ResponseCodes.RESPONSE_CODE_FORBIDDEN, ErrorCodes.ERROR_CODE_FORBIDDEN_POLICY_NOT_AGREE );
}

function newInstanceNotFoundData(strMessage)
{
	"use strict";
	return new AppError(ResponseCodes.RESPONSE_BAD_REQUEST, ErrorCodes.ERROR_CODE_DATA_NOT_FOUND, strMessage );
}

function newInstanceInvalidParameter()
{
	"use strict";
	return new AppError(ResponseCodes.RESPONSE_BAD_REQUEST, ErrorCodes.ERROR_CODE_INVALID_PARAMETERS );
}

function newInstanceDuplicateData()
{
	"use strict";
	return new AppError(ResponseCodes.RESPONSE_BAD_REQUEST, ErrorCodes.ERROR_DUPLICATE_DATA );
}

function newInstanceExpired()
{
	"use strict";
	return new AppError(ResponseCodes.RESPONSE_CODE_FORBIDDEN, ErrorCodes.ERROR_CODE_EXPIRED );
}

function newInstanceBadRequest( strMessage )
{
	"use strict";
	return new AppError(ResponseCodes.RESPONSE_BAD_REQUEST, ErrorCodes.ERROR_BAD_REQUEST, strMessage );
}


function getErrorString( nErrorCode )
{
    "use strict";
	switch( nErrorCode )
	{
		case ErrorCodes.ERROR_CODE_INVALID_USER_ID_OR_PASSWORD :
			return "Invalid user id or password.";		
		case ErrorCodes.ERROR_CODE_INVALID_PARAMETERS :
			return "Invalid request parameters";
		case ErrorCodes.ERROR_CODE_INTERNAL_SERVER_ERROR	:
			return "Internal server error";			
		case ErrorCodes.ERROR_CODE_INVALID_SECURITY_TOKEN :
			return "Session expired. Please log out, and try log in again.";							
		case ErrorCodes.ERROR_CODE_DIFFERENCE_USER_ID_AND_SECURITY_TOKEN :
			return "Difference user id and security token.";	
		case ErrorCodes.ERROR_CODE_FORBIDDEN :
			return "Forbidden";			
		case ErrorCodes.ERROR_CODE_FORBIDDEN_POLICY_NOT_AGREE : 
			return "Policy Not Agree";
		case ErrorCodes.ERROR_CODE_USER_NOT_FOUND :
			return "User not found";			
		case ErrorCodes.ERROR_CODE_DATA_NOT_FOUND :
			return "Data not found";	
		case ErrorCodes.ERROR_DUPLICATE_NAME : 
			return "Duplicate Name";
		case ErrorCodes.ERROR_DUPLICATE_DATA : 
			return "Duplicate Data";
		case ErrorCodes.ERROR_CODE_VERSION_CHECK_FAILED:
			return "Version check failed.";
		case ErrorCodes.ERROR_CODE_EXPIRED:
			return "The Date has expired.";
		case ErrorCodes.ERROR_BAD_REQUEST:
			return "Bad Request";
		case ErrorCodes.ERROR_CODE_USER_NOT_EXISTS : 
			return "User not founded!";
		default :
			assert(false);
	}
}


module.exports.AppError = AppError;
module.exports.newInstanceNotMemberError = newInstanceNotMemberError;
module.exports.newInstanceInternalServerError = newInstanceInternalServerError;
module.exports.newInstanceForbiddenError = newInstanceForbiddenError;
module.exports.newInstanceNotFoundData = newInstanceNotFoundData;
module.exports.newInstanceInvalidParameter = newInstanceInvalidParameter;
module.exports.newInstanceDuplicateData = newInstanceDuplicateData;
module.exports.newInstanceForbiddenWithPolicyNotAgreeError = newInstanceForbiddenWithPolicyNotAgreeError;
module.exports.newInstanceExpired = newInstanceExpired;
module.exports.newInstanceBadRequest = newInstanceBadRequest;
module.exports.Codes = ErrorCodes;
module.exports.responseCodes = ResponseCodes;
module.exports.getString = getErrorString;
