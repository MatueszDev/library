'use strict';
const express = require('express');
const router = express.Router();
const author = require('../api/author');
const books = require('../api/books');


router.get('/author/create', function(req, res, next){
    res.render('forms/author');
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
        cost: res.rows
    }
    res.render('forms/lend', context);
});
router.post('/book/lend/:id', books.lend_book);

module.exports = router;
