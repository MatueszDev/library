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
`;

let check_reader_insert_tr = `
DROP TRIGGER IF EXISTS check_new_reader_tr on "projekt"."czytelnik";
CREATE OR REPLACE FUNCTION check_new_reader_tr() RETURNS TRIGGER AS
$$
BEGIN
    IF LENGTH(NEW.imie) < 2 THEN
        RAISE EXCEPTION 'Długość imienia musi być wieksza niż 2';
    ELSEIF LENGTH(NEW.nazwisko) < 2 THEN
        RAISE EXCEPTION 'Długość nazwiska musi być wieksza niż 2';
    ELSEIF LENGTH(NEW.nr_telefonu) != 9 THEN
        RAISE EXCEPTION 'Numer telefonu musi miec 9 cyfr';  
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
CREATE TRIGGER check_new_reader_tr
BEFORE INSERT ON projekt.czytelnik
FOR EACH ROW EXECUTE PROCEDURE check_new_reader_tr();
`

let user_insert_trigger = `
DROP TRIGGER IF EXISTS user_insert_trigger on projekt.uzytkownik;
CREATE OR REPLACE FUNCTION user_insert_trigger() RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.email NOT LIKE '%@%.%' THEN
        RAISE EXCEPTION 'Email musi być w formacie [nazwa]@[domena].[sufix]';
    ELSEIF LENGTH(NEW.login) < 3 THEN
        RAISE EXCEPTION 'Login musi być conajmniej 3 znakowy';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
CREATE TRIGGER user_insert_trigger
BEFORE INSERT ON projekt.uzytkownik
FOR EACH ROW EXECUTE PROCEDURE user_insert_trigger();`

let list_of_available_books = `CREATE OR REPLACE VIEW list_of_available_books AS
SELECT k.tytul, COUNT(*) FROM projekt.kopia ko
JOIN projekt.ksiazka k ON k.id_ksiazka=ko.id_ksiazka
WHERE ko.status=TRUE
GROUP BY k.tytul
HAVING COUNT(*) > 0 `;

let queries = [
    book_after_date_view,
    reader_with_book,
    lend_book_trigger,
    list_of_available_books,
    check_reader_insert_tr,
    user_insert_trigger
]

for(const query of queries){
    pool.query(query, [], (err, re)=>{
        if(err){
            console.log(err);
        }
    });
}