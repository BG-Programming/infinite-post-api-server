// const db     	  	= require("./db_user.js" );

module.exports.route = function(api, app) {
    api.guest.post  ( '/api/user/login',                        login );
}

async function login(userInfo, params, body) {
    "use strict";
    // utils.checkRequiredStringParameter(body.email, body.password);   

    // const strEmail = body.email.toLowerCase();
    // const jsonUserData = await auth.login( strEmail, body.password );

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