var express = require('express');
var router = express.Router();
const api_u = require('../api/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
router.get('/create_reader', function(req, res, next){
    res.render('forms/reader');
});
router.post('/create_reader', api_u.create_reader);

module.exports = router;
