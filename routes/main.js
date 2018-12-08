var express = require('express');
var router = express.Router();
const books = require('../api/books');
/* GET users listing. */
router.get('/', function(req, res, next) {
    //if(req.session.logged)
    if(true){
        context = {
            title: "Główny widok"
        }
        res.render('main', context);
    }else{
        res.redirect('/');
    }
});
router.get('/search', function(req, res, next){
    //if(!req.session.logged){
    if(false){
        res.redirect('/');
        return;
    }
    res.render('main/books');
});
router.get('/profile', function(req, res, next){
    //if(!req.session.logged){
    if(false){
        res.redirect('/');
        return;
    }
    let context = {
        id_user: req.session.login,
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
    res.render('main/detail', context);
});
router.post('/book/:id', function(req, res,next){
    books.add_com(req, res, next);
    res.redirect(`/main/book/${req.params.id}`);
});
router.get('/book/return/:id', books.return_book);

module.exports = router;
