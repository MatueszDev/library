const pg = require('pg');
const db = require('../db/queries');
const url = require('url');

// const connectionString = 'postgresql://postgres:1234@127.0.0.1:5432/postgres'
// const pool = new pg.Pool(connectionString);

module.exports = {
    check_if_user_exists: function(req, res, next){
        let value = req.params.value;
        let field = req.params.field;
        let query = `SELECT EXISTS( SELECT ${field} FROM projekt.uzytkownik WHERE ${field}='${value}')`;
        db.query_async(query, [], (err, re) =>{
            if (err) {
                console.log(err);
                res.redirect('/');
                return;
            }
            console.log(re);
            res.send(re.rows[0]);
        });
    },
    get_user_data: function(req, res, next){
        let email_or_login = req.params.id;
        let query = `SELECT * FROM projekt.uzytkownik WHERE email='${email_or_login}' OR login='${email_or_login}'`;
        db.query_async(query, [], (err, re) =>{
            if (err) {
                console.log(err);
                res.redirect('/');
                return;
            }
            res.send(re.rows[0]);
        });
    },
    create_user: function(req, res, next){
        let email = req.body.email;
        let login = req.body.login;
        let pass = req.body.pass;
        console.log(req.body);
        let query = `INSERT INTO projekt.uzytkownik values
        ('${email}', '${login}', '${pass}', 1)`;
        db.query_async(query, [], (err, re) =>{
            if (err) {
                console.log(err);
                res.redirect(url.format({
                    pathname: '/default', 
                    query: {
                        message: "Coś poszło nie tak. Sprobój jeszcze raz :( "
                    }
                }));
              return;
            }
            res.redirect(url.format({
                pathname: '/default', 
                query: {
                    message: "Pomyślnie założno konto! Możesz się teraz zalgować!"
                }
            }));
        });
    },
    sign_in:function(req, res, next){
        let user = req.body.login;
        let pass = req.body.haslo;
        let query = ` SELECT email, login, id_czytelnik FROM projekt.uzytkownik WHERE (email='${user}' OR login='${user}') AND haslo='${pass}' `;
        db.query_async(query, [], (err, re)=>{
            if(err){
                console.log(err);
                res.redirect(url.format({
                    pathname: '/default', 
                    query: {
                        message: "Coś poszło nie tak. Sprobój jeszcze raz :( "
                    }
                }));
                return;
            }
            let permission = re.rows[0] ? true : false;
            req.session.logged = permission;
            console.log(req.session.logged);
            if(!permission){
                res.redirect('/');
                return;
            }
            req.session.login = re.rows[0]['login'];
            req.session.id_reader = re.rows[0]['id_czytelnik'];
            //req.session.logged = permission;
            res.redirect('/main');
        });
        
    },
    get_reader_data: function(req, res, next){
        let id_reader = req.params.id;
        let query = `SELECT * FROM projekt.czytelnik WHERE id_czytelnik='${id_reader}';
        SELECT (
            SELECT tytul FROM projekt.ksiazka ks JOIN projekt.kopia ko ON ko.id_ksiazka=ks.id_ksiazka
            WHERE ko.id_egzemplarz = ck.id_egzemplarz
        ), id_egzemplarz, data_wypozyczenia, data_zwrotu
        FROM projekt.czyt_kopia ck WHERE ck.id_czytelnik='${id_reader}'`;
        db.query_async(query, [], (err, re)=>{
            if(err){
                console.log(err);
                res.redirect(url.format({
                    pathname: '/default', 
                    query: {
                        message: "Coś poszło nie tak. Sprobój jeszcze raz :( "
                    }
                }));
                return;
            }
            res.send(re.rows);
        });
    },
    get_profile: function(req, res, next){
        let login = req.session.login;
        let query = `SELECT login, email, id_czytelnik FROM projekt.uzytkownik WHERE login='${login}' `;
        db.query_async(query, [], (err, re)=>{
            if(err){
                console.log(err);
                res.redirect(url.format({
                    pathname: '/default', 
                    query: {
                        message: "Coś poszło nie tak. Sprobój jeszcze raz :( "
                    }
                }));
                return;
            }
            res.send(re.rows);
        });
    },
    create_reader: function(req, res, next){
        let name = req.body.name;
        let surname = req.body.surname;
        let phone = req.body.phone;
        let date = new Date().toISOString().slice(0,10);
        console.log(req.body);
        let login = req.session.login;
        let query = `INSERT INTO projekt.czytelnik (id_czytelnik, imie, nazwisko, nr_telefonu, data_o, id_karta)
            values (DEFAULT, '${name}', '${surname}', '${phone}', '${date}', 1);
            UPDATE projekt.uzytkownik SET id_czytelnik=(
                SELECT MAX(id_czytelnik) FROM czytelnik
            ) WHERE login='${login}'`;
        console.log(query);
        db.query_async(query, [], (err, re)=>{
            if(err){
                console.log(err);
                res.redirect(url.format({
                    pathname: '/default', 
                    query: {
                        message: "Coś poszło nie tak. Sprobój jeszcze raz :( "
                    }
                }));
                return;
            }
            console.log(re);
            req.session.id_reader = db.query_sync('SELECT MAX(id_czytelnik) as id FROM czytelnik')[0]['id'];
            res.redirect('/main');
        });
    },
    charge_account: function(req, res, next){
        let reader_id = req.params.id;
        let money_to_add = parseFloat(req.query.money);
        console.log(req.query.money, money_to_add);
        let q = `SELECT saldo FROM projekt.czytelnik WHERE id_czytelnik=${reader_id}`;
        let current_bilnas = db.query_sync(q);
        current_bilnas = parseFloat(current_bilnas[0]['saldo']);
        let update_q = `UPDATE projekt.czytelnik SET saldo=${current_bilnas+money_to_add} WHERE id_czytelnik=${reader_id}`;
        db.query_async(update_q, [], (err, re)=>{
            if(err){
                console.log(err);
                res.redirect(url.format({
                    pathname: '/default', 
                    query: {
                        message: "Coś poszło nie tak. Sprobój jeszcze raz :( "
                    }
                }));
                return;
            }
            res.redirect('/main/profile');
        });
    },
    get_saldo: function(req, res, next){
        let id_reader = req.session.id_reader;
        let q = `SELECT c.saldo FROM projekt.czytelnik c WHERE c.id_czytelnik='${id_reader}'`;
        db.query_async(q, [], (err,re)=>{
            if(err){
                console.log(err);
                res.redirect(url.format({
                    pathname: '/default', 
                    query: {
                        message: "Coś poszło nie tak. Sprobój jeszcze raz :( "
                    }
                }));
                return;
            }
            res.send(re.rows);
        });
    }
}

