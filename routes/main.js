var express = require('express');
var router = express.Router();
const books = require('../api/books');
/* GET users listing. */
router.get('/', function(req, res, next) {
    if(req.session.logged){
        let context = {
            title: "Główny widok",
            super_user: req.session.super_user
        }
        res.render('main', context);
    }else{
        res.redirect('/');
    }
});
router.get('/search', function(req, res, next){
    if(!req.session.logged){
        res.redirect('/');
        return;
    }
    let context = {
        title: "Wyszukaj książke",
        super_user: req.session.super_user
    }
    res.render('main/books', context);
});
router.get('/profile', function(req, res, next){
    if(!req.session.logged){
        res.redirect('/');
        return;
    }
    let context = {
        id_user: req.session.login,
        title: "Profil",
        super_user: req.session.super_user
    }
    res.render('main/profile', context);
});
router.get('/test', function(req, res, next){
    req.call_from_server = 1;
    books.get_books_titles(req, res, next);
});

router.get('/book/:id', function(req, res, next){
    req.call_from_server = 1;
    books.get_book_detail(req, res, next);
    let context = res.rows;
    context.id_reader = req.session.id_reader;
    context.title = "Profil";
    context.super_user = req.session.super_user;
    res.render('main/detail', context);
});
router.post('/book/:id', function(req, res,next){
    books.add_com(req, res, next);
    res.redirect(`/main/book/${req.params.id}`);
});
router.get('/book/return/:id', books.return_book);

router.get('/raport', function(req, res, next){
    req.call_from_server = 1;
    books.raport(req, res, next);
    let context = {
        records: res.rows,
        title: "Raport",
        super_user: req.session.super_user
    }
    // context.records.data_wpisu = 
    res.render('main/raport', context);
});

router.get('/user_with_books', function(req, res, next){
    let context = {
        title: "Użytkownicy z książkami",
        super_user: req.session.super_user
    }
    res.render('main/readers_with_books', context);
});

router.get('/user_outdated', function(req, res, next){
    let context = {
        title: "Użytkownicy z książkami",
        super_user: req.session.super_user
    }
    res.render('main/readers_outdated', context);
});

router.get('/list_of_available_books',function(req, res, next){
    let context = {
        title: "Użytkownicy z książkami",
        super_user: req.session.super_user
    }
    res.render('main/list', context);
});

module.exports = router;
