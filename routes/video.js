var express = require('express');
var router = express.Router();
var async = require('async');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'quickplay'
});
connection.connect();

router.route('/:id')
    .get(function(req, res, next) {
        if(req.params.id=='all'){
            var sql = 'select * from video';
        }else{
            var sql = 'select * from video where Id ='+req.params.id;
        }
        connection.query(sql, function (error, results, fields) {
            console.log(results)
            res.send(results);
        })
    })
    .put(function(req, res, next) {
    })
    .post(function(req, res, next) {
    })
    .delete(function(req, res, next) {
        var sql = 'DELETE FROM vedio WHERE Id ='+req.params.id;
        connection.query(sql, function (error, results, fields) {
            res.send(results);
        });
    });


module.exports = router;