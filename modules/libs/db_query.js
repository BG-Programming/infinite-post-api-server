const stdlib      = require("./stdlib.js" );

module.exports.getPostWriterId = function ( client, nPostId, fnCallback ) 
{
    _getPostWriterId(client, nPostId, fnCallback)
};
