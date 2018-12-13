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
client_s.connectSync(connectionString, (err)=>{
    if(err){
        console.log(err);
        return;
    }
});

let book_after_date_view = `CREATE OR REPLACE VIEW reader_after_limit AS
SELECT c.imie, c.nazwisko, COUNT(*), c.id_czytelnik FROM projekt.czytelnik c
JOIN projekt.czyt_kopia ck ON ck.id_czytelnik=c.id_czytelnik
WHERE ck.data_zwrotu < now()
GROUP BY c.id_czytelnik, c.imie, c.nazwisko
ORDER BY 2
`;
pool.query(book_after_date_view, [], (err, re)=>{
    if(err){
        console.log(err);
    }
});

module.exports ={
    query_async: (text, params, callback) => {
        // const pool = new Pool({
        //   connectionString: connectionString,
        // });
        
        return pool.query(text, params, callback);
    },
    query_sync: (text, params) =>{
        return client_s.querySync(text, params);
    }
}