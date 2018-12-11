var express = require('express');
var router = express.Router();
const pg = require('pg');
const db = require('../db/queries');
const user = require('../api/user');
const books = require('../api/books');
const author = require('../api/author');

const connectionString = 'postgresql://postgres:1234@127.0.0.1:5432/postgres'
const client = new pg.Client(connectionString);


router.get('/', function(req, res, next) {
    client.connect();
    const query = client.query(
        'SELECT NOW()', (err, re) => {
            res.send(re.rows);
            
            client.end();
    });
});

router.get('/user/:field/:value', user.check_if_user_exists);
router.get('/user/:id', user.get_user_data);
router.post('/user/create', user.create_user);

router.post('/login', user.sign_in);

router.get('/books/all', books.get_all_books);
router.get('/books/titles', books.get_books_titles);
router.get('/books/binding', books.get_binding);
router.get('/books/languages', books.get_languages);
router.get('/books/genre', books.get_genre);
router.get('/books/cost_constatnt/:id', books.get_cost_and_multiplier);
router.get('/books/by_pattern', books.get_books_by_pattern);

router.get('/profile', user.get_profile);
router.get('/reader/:id', user.get_reader_data);
router.get('/reader/charge/:id', user.charge_account);

router.get('/author/authors_all/', author.get_all_authors);


module.exports = router;
