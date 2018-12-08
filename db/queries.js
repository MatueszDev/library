const { Pool, Client } = require('pg');
const connectionString = 'postgresql://postgres:1234@127.0.0.1:5432/postgres';
const Client_sync = require('pg-native');

const pool = new Pool({
  connectionString: connectionString,
});
// pool.query('set search_path to projekt', (err, res) => {
//   // console.log(err, res);
// });
const client_s = new Client_sync();
client_s.connectSync(connectionString);

module.exports ={
    query_async: (text, params, callback) => {
        // const pool = new Pool({
        //   connectionString: connectionString,
        // });
        let q = 'set search_path to projekt;' + text;
        return pool.query(q, params, callback);
    },
    query_sync: (text, params) =>{
        let q = 'set search_path to projekt;' + text;
        return client_s.querySync(q, params);
    }
}