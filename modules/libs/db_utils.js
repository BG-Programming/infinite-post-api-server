/**************************************************************************************************
    File Name   : db_utils.js

    Description :
      

    Update History         
      2016.05.03            BGKim       Create  
**************************************************************************************************/

///////////////////////////////////////////////////////////////////////////////////////////////////
//									require modlues 											 //
///////////////////////////////////////////////////////////////////////////////////////////////////
const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'tony',
  host: 'localhost',
  port: 5432,
  database: 'bg_programming_infinite_posts',
//   password: 'h!re~city'
});

const assert      = require("assert");

function DB_Utils()
{	

}


DB_Utils.prototype.assertNumbers = function ( /* ... */ )
{
    "use strict";
    for( var i = 0;     i < arguments.length;   ++i )         
        assert( arguments[i].constructor === Number );     
};

DB_Utils.prototype.assertBooleans = function ( /* ... */ )
{
    "use strict";
    for( var i = 0;     i < arguments.length;   ++i )
        assert( arguments[i].constructor === Boolean );
};


DB_Utils.prototype.assertArrays = function ( /* ... */ )
{
    "use strict";
    for( var i = 0;     i < arguments.length;   ++i )
        assert( arguments[i].constructor === Array );
};



DB_Utils.prototype.assertStrings = function ( /* ... */ )
{
    "use strict";
    for( var i = 0;     i < arguments.length;   ++i )
        assert( arguments[i].constructor === String );
};



DB_Utils.prototype.assertFunctions = function ( /* ... */ )
{
    "use strict";
    for( var i = 0;     i < arguments.length;   ++i )
        assert( arguments[i].constructor === Function );
};



class QueryBuildData {
    constructor(client) {
        this._client = client;
        this._query = "";
        this._params = [];
    }

    idx() {
        return "$" + (this._params.length + 1).toString();
    }

    add(query) {
        this._query += query;
    }

    withParam(query, param) {
        if( param === undefined )
            return ;        
        this.add(query);
        this._params.push(param);
    }

    async execute() {
        assert(this._client);
        return await this._client.query(this._query, this._params);
    }
}

DB_Utils.prototype.makeQuery =  function (client)  {
    return new QueryBuildData(client);
};

DB_Utils.prototype.defaultQuery =  async function (callback)  {
    const client = await pool.connect()
    try {
        return await callback(client);
    } finally {
        client.release();
    }
};

DB_Utils.prototype.defaultQueryWithTransaction =  async function (callback)  {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT')
        return result;
    } catch(e) {
        await client.query('ROLLBACK');        
        throw e;
    }finally {
        client.release();
    }
};

DB_Utils.prototype.connectDatabase = function( fnCallback  )
{	
	"use strict";
	pool.connect
	(
		function(err, client, done) 
		{
		  	fnCallback(err, client, done);
		}
	);
};

DB_Utils.prototype.connectDatabaseWithTransaction = function( fnCallback  )
{	
	"use strict";
	pool.connect
	(
		function(errCon, client, done) 
		{
			if( errCon )
				return fnCallback(errCon);

			client.query('BEGIN', function(err){
                fnCallback(err,client,done);
            });
		}
	);
};


DB_Utils.prototype.endTransaction = function( err, client, done, callback  )
{	
	"use strict";
	if( err )
    {
        client.query('ROLLBACK', function(e){
	        done();
	        return callback(err);                    
        });
    }
    else 
    {
        client.query('COMMIT', function(e){
            done();
            return callback(e);                    
        });
    }

};



var _db_utilsInstance = new DB_Utils();
module.exports = _db_utilsInstance;

