const pg = require('pg');
const db = require('../db/queries');
const url = require('url');

module.exports = {
    get_all_books: function(req, res, next){
        let limit = req.params.limit || 25;
        let query = `SELECT k.id_ksiazka, k.tytul, k.l_stron, j.jezyk, (SELECT count(*) FROM komentarz WHERE id_ksiazka = k.id_ksiazka) AS kom FROM ksiazka k
        JOIN jezyk j ON j.id_jezyk=k.id_jezyk
        LIMIT ${limit}`;
        db.query_async(query, [], (err,re) => {
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
            console.log(re);
            res.send(re.rows);
        });
    },
    get_books_titles: function(req, res, next){
        let limit = req.params.limit || 50;
        let query = `SELECT id_ksiazka, tytul FROM ksiazka LIMIT ${limit}`;
        let book_titles = db.query_sync(query);
        if(req.call_from_server){
            res.rows= book_titles;
        }else{
            res.send(book_titles);
        }
    },
    get_languages: function(req, res, next){
        let limit = req.params.limit || 50;
        let query = `SELECT id_jezyk, jezyk FROM jezyk LIMIT ${limit}`;
        let languages = db.query_sync(query);
        if(req.call_from_server){
            res.rows= languages;
        }else{
            res.send(languages);
        }
    },
    get_binding: function(req, res, next){
        let limit = req.params.limit || 50;
        let query = `SELECT id_oprawa, oprawa FROM oprawa LIMIT ${limit}`;
        let binding = db.query_sync(query);
        if(req.call_from_server){
            res.rows= binding;
        }else{
            res.send(binding);
        }
    },
    get_genre: function(req, res, next){
        let limit = req.params.limit || 50;
        let query = `SELECT id_gatunek, gatunek FROM gatunek LIMIT ${limit}`;
        let genre = db.query_sync(query);
        if(req.call_from_server){
            res.rows = genre;
        }else{
            res.send(genre);
        }
    },
    create_book: function(req, res, next){
        let title = req.body.title;
        let numer_of_page = req.body.number;
        let bind_id = req.body.binding;
        let lang_id = req.body.language;
        let genre_id = req.body.genre;
        let query = `INSERT INTO ksiazka (id_ksiazka, tytul, l_stron, id_gatunek, id_oprawa, id_jezyk)
        values (DEFAULT, '${title}', '${numer_of_page}', '${genre_id}','${bind_id}', '${lang_id}')`;
        db.query_async(query, [], (err, re)=>{
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
            res.redirect('/main');
        });
    },
    get_book_title_with_id: function(req, res, next){
        let query = `SELECT id_ksiazka, tytul FROM ksiazka`;
        let books = db.query_sync(query);
        if(req.call_from_server){
            res.rows = books; 
        }else{
            res.send(books);
        }
    },
    bind_author: function(req, res, next){
        let author_id = req.body.author;
        let book_id = req.body.book;
        let query = `INSERT INTO autor_ksiazka values ('${author_id}', '${book_id}')`;
        db.query_async(query, [], (err, re)=>{
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
            res.redirect('/main')
        });
    },
    get_book_detail: function(req, res, next){
        let id_book = req.params.id;
        let com_query = `SELECT c.imie, c.nazwisko, k.komentarz, k.data_dod FROM komentarz k 
        JOIN czytelnik c ON k.id_czytelnik=c.id_czytelnik
        WHERE id_ksiazka = ${id_book}`;
        let comments = db.query_sync(com_query);
        let book_query = `SELECT k.id_ksiazka, k.tytul, k.l_stron, j.jezyk, g.gatunek, o.oprawa FROM ksiazka k
        JOIN jezyk j ON j.id_jezyk=k.id_jezyk
        JOIN gatunek g ON g.id_gatunek=k.id_gatunek
        JOIN oprawa o ON o.id_oprawa=k.id_oprawa
        WHERE id_ksiazka=${id_book} `;
        let book = db.query_sync(book_query);
        let copy_query = `SELECT (
            SELECT COUNT(*) FROM kopia WHERE id_ksiazka='${id_book}' and status=TRUE
        ) as available, (
            SELECT COUNT(*) FROM kopia WHERE id_ksiazka='${id_book}'
        ) as all`
        let number_of_copies = db.query_sync(copy_query);
        let response = {comments, book, number_of_copies};
        console.log(response);
        if(req.call_from_server){
            res.rows = response; 
        }else{
            res.send(response);
        }
        
    },
    add_com: function(req, res, next){
        let id_c = db.query_sync(`SELECT c.id_czytelnik FROM czytelnik c 
            JOIN uzytkownik u ON u.id_czytelnik=c.id_czytelnik WHERE u.login='${req.session.login}'`);
        let comm = req.body.comment;
        let date = new Date().toISOString().slice(0,10);
        let id_k = req.body.book_id;
        let query = `INSERT INTO komentarz values (DEFAULT, '${comm}', '${date}', '${id_c[0]['id_czytelnik']}', ${id_k})`;
        db.query_sync(query);
    },
    get_costs: function(req, res, next){
        let id_book = req.params.id;
        let g_query = `SELECT g.id_gatunek FROM gatunek g JOIN ksiazka k ON g.id_gatunek=k.id_gatunek`;
        let genre_id = db.query_sync(g_query);
        let payment_query = `SELECT mnoznik, c_bazowa FROM cennik WHERE id_gatunek=${genre_id[0]['id_gatunek']}`;
        let response = db.query_sync(payment_query);
        if(req.call_from_server){
            res.rows = response; 
        }else{
            res.send(response);
        }
    },
    lend_book: function(req, res, next){
        let id_book = req.session.id_book;
        let id_reader = req.session.id_reader;
        let days = parseInt(req.body.days);
        let return_date = new Date();
        return_date.setDate(return_date.getDate() + days);
        let today = new Date();
        return_date = return_date.toISOString().slice(0, 10);
        today = today.toISOString().slice(0, 10);
        let instance_query = `SELECT id_egzemplarz FROM kopia WHERE id_ksiazka=${id_book} and status=TRUE LIMIT 1`;
        let id_instance = db.query_sync(instance_query)[0]['id_egzemplarz'];
        let insert_update_query = `INSERT INTO czyt_kopia values 
        ('${id_reader}', '${id_instance}', '${today}', '${return_date}');
        UPDATE kopia SET status=FALSE WHERE id_egzemplarz=${id_instance}`;
        db.query_async(insert_update_query, [], (err, re)=>{
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
            res.redirect('/main')
        });
    },
    return_book: function(req, res, next){
        let id_instance = req.params.id;
        let update_delete_query = `UPDATE kopia SET status=TRUE WHERE id_egzemplarz=${id_instance};
        DELETE FROM czyt_kopia WHERE id_egzemplarz=${id_instance}`;
        db.query_async(update_delete_query, [], (err, re)=>{
            if (err) {
                console.log(err);
            }
        });
        res.redirect('/main/profile');
    },
    get_cost_and_multiplier: function(req, res, next){
        let id_book = req.params.id;
        let query = `SELECT mnoznik, c_bazowa FROM cennik WHERE id_gatunek=(
            SELECT id_gatunek FROM ksiazka WHERE id_ksiazka=${id_book}
        )`;
        let response = db.query_sync(query);
        if(req.call_from_server){
            res.rows = response; 
        }else{
            res.send(response);
        }
    },
    get_books_by_pattern: function(req, res, next){
        let pattern = req.body.pattern;
        let query = `SELECT k.id_ksiazka, k.tytul, k.l_stron, j.jezyk, (SELECT count(*) FROM komentarz WHERE id_ksiazka = k.id_ksiazka) AS kom FROM ksiazka k
        JOIN jezyk j ON j.id_jezyk=k.id_jezyk
        JOIN autor_ksiazka ak ON k.id_ksiazka=ak.id_ksiazka
        JOIN autor a ON ak.id_autor=a.id_autor
        WHERE a.imie ILIKE '%${pattern}%' OR k.tytul ILIKE '%${pattern}%' 
        LIMIT ${limit}`;`
    }
}