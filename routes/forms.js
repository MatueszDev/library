'use strict';
const express = require('express');
const router = express.Router();
const author = require('../api/author');
const books = require('../api/books');


router.get('/author/create', function(req, res, next){
    let context = {
        title: "Autor",
        super_user: req.session.super_use
    }
    res.render('forms/author', context);
});
router.post('/author/create', author.create_author);

router.get('/book/create', function(req, res, next){
    req.call_from_server = 1;
    let context = {}
    
    books.get_binding(req, res);
    context.bindings = res.rows;
    books.get_languages(req, res);
    context.languages = res.rows;
    books.get_genre(req, res);
    context.genres = res.rows;
    context.title = "Książka";
    context.super_user = req.session.super_user;
    
    res.render('forms/book', context);
});
router.post('/book/create', books.create_book);

router.get('/bind_book_aut', function(req, res, next){
    req.call_from_server = 1;
    let context = {}
    books.get_book_title_with_id(req, res, next);
    context.books = res.rows;
    author.get_all_authors(req, res, next);
    context.authors = res.rows;
    context.title = "Powiązanie";
    context.super_user = req.session.super_user;
    res.render('forms/book_aut', context);
});
router.post('/bind_book_aut', books.bind_author);

router.get('/book/lend/:id', function(req, res, next){
    req.session.id_book = req.params.id;
    req.call_from_server = 1;
    let date = new Date();
    books.get_costs(req, res, next);
    date.setDate(date.getDate() + 7);
    console.log(res.rows);
    let context = {
        date: date.toISOString().slice(0,10),
        cost: res.rows,
        title: "Wypożycznie",
        super_user: req.session.super_user
    }
    res.render('forms/lend', context);
});
router.post('/book/lend/:id', books.lend_book);

router.get('/magazine', function(req, res, next){
    req.call_from_server = 1;
    books.get_books_titles(req, res, next);
    let context = {
        books: res.rows,
        title: "Magazyn",
        super_user: req.session.super_user
    }
    books.all_magazine(req, res, next);
    context.locations = res.rows;
    res.render('forms/magazine.jade', context);
});
router.post('/magazine', books.add_instance);

module.exports = router;
