const { assert } = require("../libs/stdlib.js" );

module.exports.checkIfUserExistsWithEmail = async function ( client, strEmail ) {
    const result = await client.query(
        `select * from user_account where email = $1`,
        [ strEmail ]        
    );

    return 0 < result.rowCount;	
};

module.exports.checkIfUserExistsWithUsername = async function (client, strUsername) {
    const result = await client.query(
        `select * from user_account where user_name = $1`,
        [ strUsername ]        
    );

    return 0 < result.rowCount;	
};

module.exports.signup = async function ( client, strEmail, strEncryptedPassword, strUsername ) {
    const result = await client.query (
        "INSERT INTO user_account(email, pw, user_name, display_name)  " + 
                    'VALUES($1, $2, $3, $4) RETURNING id ',
        [strEmail, strEncryptedPassword, strUsername, strUsername]
    );

    assert( result.rowCount === 1);
};