var express = require('express');
var router = express.Router();
const db = require('../db/queries');
//const api_u = require('../api/user');
/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session);
    if(req.session.logged){
        res.redirect('/main');
    }else{
        res.render('start/index', { title: 'Express' });
    }
});

router.get('/createAccount', function(req, res, next) {
    let context = {};
    db.query_async('SELECT NOW()', [], (err, re) =>{
        if(err){
            return next(err);
        }
        console.log(re.rows[0]);
        context.time = re.rows[0].now;
        res.render('start/createAccount', context);
        
    });
    
    // res.render('start/createAccount', context);
});
router.get('/default', function(req, res, next) {
    let mess = req.query.message;
    let context= {
        title: "Główny widok",
        message: mess
    }
    res.render('default', context);
});
router.get('/log_out', function(req, res, next){
    req.session.destroy();
    res.redirect('/');
});
module.exports = router;
