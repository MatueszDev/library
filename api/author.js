const pg = require('pg');
const db = require('../db/queries');
const url = require('url');

module.exports = {
    create_author: function(req, res, next){
        let name = req.body.name;
        let surname = req.body.surname;
        let country = req.body.country;
        let query = `INSERT INTO projekt.autor values (DEFAULT, '${name}', '${country}', '${surname}')`;
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
    get_all_authors: function(req, res, next){
        let query = `SELECT * FROM projekt.autor`
        let result = db.query_sync(query);
        if(req.call_from_server){
            res.rows = result;
        }else{
            res.send(result);
        }
    }
}