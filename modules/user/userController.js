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


/**
 * @swagger
 * /api/login:
 *  post:
 *      tags:
 *          - USER
 * 
 *      description: 로그인
 * 
 *      parameters:
 *          - in: body
 *            name: emailOrUsername
 *            description: 이메일 또는 유저이름
 *            required: true
 *            schema:
 *              type: string
 *          - in: body
 *            name: password
 *            description: 패스워드
 *            required: true
 *            schema:
 *              type: string
 * 
 *      responses:
 *          '200':
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              token:
 *                                  type: string
 *                              userInfo:
 *                                  type: object
 *                                  properties:
 *                                      id:
 *                                          type: integer
 *                                      userName:
 *                                          type: string
 *                                      email:
 *                                          type: string
 */
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