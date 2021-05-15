const { error, assert, define, config, db_utils, db_query }   = require("../libs/stdlib.js" );
const { v4: uuidv4 } = require('uuid');

module.exports.userExistsWithEmail = async function ( client, strEmail ) {
    const result = await client.query(
        `select * from public.user where email = $1`,
        [ strEmail ]        
    );
    return 0 < result.rowCount;	
};

module.exports.signup = async function ( client, strEmail, strEncryptedPassword, strNickname ) {
    const result = await client.query (
        "INSERT INTO public.user(email, pw, nickname)  " + 
                    'VALUES($1, $2, $3) RETURNING id ',
        [strEmail, strEncryptedPassword, strNickname]
    );

    assert( result.rowCount === 1) ;
};