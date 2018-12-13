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

let book_after_date_view = `CREATE OR REPLACE VIEW reader_after_limit AS
SELECT c.imie, c.nazwisko, COUNT(*), c.id_czytelnik FROM projekt.czytelnik c
JOIN projekt.czyt_kopia ck ON ck.id_czytelnik=c.id_czytelnik
WHERE ck.data_zwrotu < now()
GROUP BY c.id_czytelnik, c.imie, c.nazwisko
ORDER BY 2`;
let reader_with_book = `CREATE OR REPLACE VIEW readers_with_books AS
SELECT c.imie, c.nazwisko, k.tytul, ck.data_zwrotu FROM projekt.czytelnik c
JOIN projekt.czyt_kopia ck ON ck.id_czytelnik=c.id_czytelnik
JOIN projekt.kopia kk ON ck.id_egzemplarz=kk.id_egzemplarz
JOIN projekt.ksiazka k ON kk.id_ksiazka=k.id_ksiazka`;

let lend_book_trigger = `
DROP TRIGGER IF EXISTS lend_book_trigger on "projekt"."czyt_kopia";
CREATE OR REPLACE FUNCTION lend_book_trigger() RETURNS TRIGGER AS
$$
BEGIN 
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO projekt.historia_wypozyczen values
        (DEFAULT, NEW.id_egzemplarz, NOW(), NEW.id_czytelnik, 2);
        RETURN NEW;
    ELSEIF (TG_OP = 'DELETE') THEN  
        INSERT INTO projekt.historia_wypozyczen values
        (DEFAULT, OLD.id_egzemplarz, NOW(), OLD.id_czytelnik, 1);
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE 'plpgsql';  
CREATE TRIGGER lend_book_trigger
AFTER INSERT OR DELETE ON projekt.czyt_kopia
FOR EACH ROW EXECUTE PROCEDURE lend_book_trigger();
`

let queries = [
    book_after_date_view,
    reader_with_book,
    lend_book_trigger
]

for(const query of queries){
    pool.query(query, [], (err, re)=>{
        if(err){
            console.log(err);
        }
    });
}