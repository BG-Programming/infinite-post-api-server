const { utils, define, error }      = require("../libs/stdlib.js" );
const db     	  	= require("./db_user.js" );

module.exports.route = function(api, app) {
    api.guest.post('/api/user/login',       login);
    api.guest.post('/api/signup',      signup);
}

async function signup(params, body) {
    "use strict";

    const {email, password, nickname} = body;
    utils.checkRequiredStringParameter(email, password, nickname);
    await db.signup(email, nickname, password);
}

async function login(params, body) {
    "use strict";
    const {email, password} = body;
    utils.checkRequiredStringParameter(email, password);   

    const strEmail = email.toLowerCase();
    const jsonUserData = await auth.login( strEmail, body.password );

    // let strSecurityToken = auth.getSecurityToken( jsonUserData.email );

    // if( strSecurityToken === null )
    //     strSecurityToken = auth.insertSecurityToken( jsonUserData );

    return {
        hello: 'world'
    }
    // return {
    //     token           : strSecurityToken,
    //     userInfo        : jsonUserData,
    // };
}