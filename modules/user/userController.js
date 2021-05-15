const { utils }         = require("../libs/stdlib.js" );
const auth              = require("../libs/auth");
const db     	  	    = require("./db_user.js" );

module.exports.route = function(api, app) {
    api.guest.post('/api/login',       login);
    api.guest.post('/api/signup',           signup);
}

async function signup(_, body) {
    "use strict";

    const {email, password, nickname} = body;
    utils.checkRequiredStringParameter(email, password, nickname);
    await db.signup(email, nickname, password);
}

async function login(_, body) {
    "use strict";
    const {email, password} = body;
    utils.checkRequiredStringParameter(email, password);   

    const strEmail = email.toLowerCase();
    const jsonUserData = await auth.login( strEmail, body.password );

    let strSecurityToken = auth.getSecurityToken( jsonUserData.email );

    if( strSecurityToken === null )
        strSecurityToken = auth.insertSecurityToken( jsonUserData );

    return {
        token           : strSecurityToken,
        userInfo        : jsonUserData,
    };
}