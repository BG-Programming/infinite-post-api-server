
const argon2        = require('argon2');
const { v4: uuidv4 } = require('uuid');
const assert 		= require("assert");
const error     	= require("./error.js");
const db_utils     	= require("./db_utils.js");

async function checkPassword(strPlainText, strEncryptedPassword ) {
    return await argon2.verify(strEncryptedPassword, strPlainText);
}

async function getUserLoginData ( client, strEmail ) {
      const result = await client.query(           
        'SELECT     id, ' +
                    'nickname, ' +
                    'email, ' +
                    'trim(pw) as password ' +
        'FROM      	public.user tu ' + 
        'WHERE      lower(email)=$1  '
        ,[  strEmail ]
    );

    // No search user
    if( result.rowCount === 0 )
        throw error.newInstanceNotFoundData(strEmail + " is not member");

    assert(result.rowCount === 1);
    return result.rows[0];    
};


async function login ( strEmailOrNickname, strPassword ) {
    "use strict";    
    return await db_utils.defaultQueryWithTransaction(async (client)=>{
        let userData = await getUserLoginData(client, strEmailOrNickname );
		const isVerify = await checkPassword(strPassword, userData.password);  
		
        if( isVerify === false )
        	throw error.newInstanceForbiddenError();
			
        delete userData.password;
        return userData;
    });
};




function Auth()
{
    "use strict";

	/*
	// Security token 으로 접속한 사용자 인증을 유지하여 사용자 확인의 부하를 줄인다. 
	// Key : security token
	// value : 
		{
			lastAccessTime 	: date ( ms ),
			userId			: number,
			email			: string			
		}		
	*/
	this.tableSecurityToken = [];
	
	
	// 사용자 인증 만료 알고리즘
	// 사용자 만료의 작업은 주기적으로 작업을 한다.
	// 즉, 호출 시 마다 작업하는 것이 아니라 사용자 인증 만료 작업을 한 마지막 시간을 기준으로 만료 기간을 체크한다.
	
	// 마지막에 인증 만료를 검색한 시간
	this.miliSecondLastExpireCheckTime = 0;


	// 인증 만료 체크 주기 
	this.miliSecondExpireCheckPeriod =  60 * 60 * 1000;  


	// Security key 인증 만료 시간
	this.miliSecondExpireTime = 3 * 24 * 60 * 60 * 1000;	
}


Auth.prototype.getExpireTime = function( strSecurityToken )
{
    "use strict";
	var nLastAccessTime = this.tableSecurityToken[strSecurityToken];
	return nLastAccessTime + this.miliSecondLastExpireCheckTime;
};

Auth.prototype._checkExpireTime = function( )
{
    "use strict";
	var nNow = Date.now();
	if(  nNow - this.miliSecondLastExpireCheckTime < this.miliSecondExpireCheckPeriod )
		return ;
		
	this.miliSecondLastExpireCheckTime = nNow;		
	for ( var strSecurityToken in this.tableSecurityToken  ) 
	{
		var nLastAccessTime = this.tableSecurityToken[strSecurityToken].lastAccessTime;
		if( this.miliSecondExpireTime < nNow - nLastAccessTime  )
			this._deleteSecurityToken( strSecurityToken  );
	}	
};



Auth.prototype._deleteSecurityToken = function( strSecurityToken  )
{
    "use strict";		
	delete this.tableSecurityToken[strSecurityToken];
};


Auth.prototype._containToken = function( strSecurityToken )
{
    "use strict";
	return strSecurityToken in this.tableSecurityToken;
};


Auth.prototype._insertSecurityTokenTable = function( strSecurityToken, nUserId, strEmail, strType, info )
{
    "use strict";
	this.tableSecurityToken[ strSecurityToken ] = 
		{			
			lastAccessTime 	: Date.now(),
			userId			: nUserId,
			userType 		: strType,
			email			: strEmail,
			nickname 		: info.nickname
		};
};



Auth.prototype.login = async function( strEmail, strPassword ) {
    "use strict";
	return await login( strEmail, strPassword );
};

Auth.prototype.getSecurityToken = function( strEmail )
{
    "use strict";
	this._checkExpireTime();
	for(var token in this.tableSecurityToken)
	{		
		var info = this.tableSecurityToken[token];		
		if( 	info.email === strEmail ) 
		{
			// Security token을 사용하면 마지막 접근 시간을 갱신한다
			info.lastAccessTime = Date.now();
			return token;
		}
	}

	return null;
};

// 로그인 시 token이 등록되어 있지 않다면 사용자 토큰 등록
Auth.prototype.insertSecurityToken = function( jsonUserData )
{
    "use strict";
	let strSecurityToken;
	let isContain;
	do 
	{
		strSecurityToken = uuidv4();
		isContain = this._containToken(strSecurityToken);
	} while( isContain === true );
	
	this._insertSecurityTokenTable( strSecurityToken, jsonUserData.id, jsonUserData.email, jsonUserData.userType, jsonUserData);
	return strSecurityToken;
};


// _utils 함수에서 헤더에서 전송받은 security token 이 유효한지 확인하는데 사용
Auth.prototype.isValidSecurityToken = function( strSecurityToken )
{
    "use strict";
	this._checkExpireTime();	
	return strSecurityToken in this.tableSecurityToken;
};



Auth.prototype.getUserInfo = function( strSecurityToken )
{
	 "use strict";
	// Security token을 사용하면 마지막 접근 시간을 갱신한다
	var info = this.tableSecurityToken[ strSecurityToken ];	
	if( info )
		info.lastAccessTime = Date.now();
	return info;
};



Auth.prototype.getUserInfoWithSecurityToken = function( strSecurityToken )
{
	"use strict";
	return this.getUserInfo(strSecurityToken);	
};



var _auth = new Auth();
module.exports = _auth;


