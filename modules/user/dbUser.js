
const {  error,  db_utils } = require("../libs/stdlib.js" );
const query         = require("./queryUser.js");
const argon2        = require('argon2');

module.exports.signup = async function( strEmail, strUsername, strPassword ) {
    "use strict";        

    db_utils.assertStrings(strEmail, strUsername, strPassword);    

    await db_utils.defaultQueryWithTransaction(async (client) =>  {         
        const userExistsWithEmail = await query.checkIfUserExistsWithEmail(client, strEmail);
        
        if( userExistsWithEmail === true ) {
            throw new error.AppError(error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_EMAIL_ALREADY_EXISTS );
        }

        const userExistsWithUsername = await query.checkIfUserExistsWithUsername(client, strUsername);

        if (userExistsWithUsername === true) {
            throw new error.AppError(error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_DUPLICATE_NAME );
        }

        const strEncryptedPassword = await encryptPassword(strPassword);
        await query.signup(client, strEmail, strEncryptedPassword, strUsername);
    });
};

async function encryptPassword(strPassword) {
    return await argon2.hash(strPassword);    
}