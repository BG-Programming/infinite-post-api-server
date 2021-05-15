const { Pool, Client } = require('pg');

const pool = new Pool({
  user: 'tony',
  host: 'localhost',
  database: 'bg_programming_infinite_posts',
//   password: 'h!re~city'
});