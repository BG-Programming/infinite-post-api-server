
const {  assert, utils, define, config, error,  db_query, db_utils } = require("../libs/stdlib.js" );
const util          = require("util");
const query         = require("./query_user.js");
const argon2        = require('argon2');



module.exports.signup = async function( strEmail, strNickname, strPassword ) {
    "use strict";        

    db_utils.assertStrings(strEmail, strNickname, strPassword);    

    await db_utils.defaultQueryWithTransaction(async (client) =>  {         
        const userExists = await query.userExistsWithEmail(client, strEmail);       

        if( userExists === true ) {
            throw new error.AppError(error.responseCodes.RESPONSE_BAD_REQUEST, error.Codes.ERROR_CODE_EMAIL_ALREADY_EXISTS );
        }

        const strEncryptedPassword = await encryptPassword(strPassword);
        await query.signup(client, strEmail, strEncryptedPassword, strNickname);
    });
};

async function encryptPassword(strPassword) {
    return await argon2.hash(strPassword);    
}