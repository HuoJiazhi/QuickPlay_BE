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

function checkUser(user, password) {
    var userExit = 0;
    connection.query('select * from user', function (error, results, fields) {
        if (error) throw error;
        for (var i = 0; i < results.length; i++) {
            if (results[i].User && user.toString() == results[i].User.toString()) {
                userExit = 1;
                return userExit;
            }
        }
        return userExit;
    });
}

function checkPassword(user, password) {
    var passCorrect = 0;
    var sql = 'select Password from user where User = "' + user + '"';
    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results[0].Password == password) {
            passCorrect = 1;
            console.log(passCorrect);
            return passCorrect;
        }
        return passCorrect;
    });
}

var task = [];
router.post('/', function (req, res) {
    var user = req.body.user;
    var pass = req.body.password;
    var message = '';
    var tasks = [
        function (callback) {
            var user = req.body.user;
            var pass = req.body.password;
            callback(null,user, pass);
        }, function (user, pass, callback) {
            var userExit = 0;
            connection.query('select * from user', function (error, results, fields) {
                for (var i = 0; i < results.length; i++) {
                    console.log(results[0].User);
                    console.log(user);
                    if (results[i].User && user.toString() == results[i].User.toString()) {
                        userExit = 1;
                    }
                }
                if(userExit == 0){
                    error = '用户不存在';
                    callback(error);
                }else{
                    callback(error, userExit, user, pass);
                }
            });
        }, function (userExit, user, pass, callback) {
            var passCorrect = 0;
            var sql = 'select Password from user where User = "' + user + '"';
            connection.query(sql, function (error, results, fields) {
                if (results[0].Password == pass) {
                    passCorrect = 1;
                }
                if(passCorrect == 0){
                    error = '密码错误';
                    callback(error);
                }else{
                    callback(error, userExit, passCorrect);
                }
            });
        }, function (userExit, passCorrect, callback) {
            if (userExit == 1 && passCorrect == 1) {
                message = '成功登录';
            } else {
                message = 'failed';
            }
            callback(null,message);
        }];

    async.waterfall(tasks, function (err, results) {
        if (err) {
            res.send(err);
        }else{
            res.send(results);
        }
    });
});


module.exports = router;