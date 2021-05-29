const { utils }         = require("../libs/stdlib.js" );
const auth              = require("../libs/auth");
const db     	  	    = require("./dbUser.js" );

module.exports.route = function(api, app) {
    api.guest.post('/api/login',            login);
    api.guest.post('/api/signup',           signup);
}

async function signup(userInfo, params, body) {
    "use strict";

    const {email, password, username} = body;
    utils.checkRequiredStringParameter(email, password, username);
    await db.signup(email, username, password);
}

async function login(userInfo, params, body) {
    "use strict";
    
    const {emailOrUsername, password} = body;
    
    utils.checkRequiredStringParameter(emailOrUsername, password);   

    const strEmailOrUsername = emailOrUsername.toLowerCase();
    const jsonUserData = await auth.login( strEmailOrUsername, body.password );

    let strSecurityToken = auth.getSecurityToken( jsonUserData.email );

    if( strSecurityToken === null )
        strSecurityToken = auth.insertSecurityToken( jsonUserData );

    return {
        token           : strSecurityToken,
        userInfo        : jsonUserData,
    };
}