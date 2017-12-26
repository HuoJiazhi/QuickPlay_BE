var express = require('express');
var router = express.Router();

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '123456',
    database : 'quickplay'
});
connection.connect();
router.post('/', function (req, res) {
    if(checkUser(req.body.user,req.body.password)==0){
        res.send("没有当前用户");
    }else{
        res.send("有当前用户");
    }

    //checkPassword(req.body.user,req.body.password);
});

function checkUser(user,password) {
    var userExit = 0;
    var that = this;
    connection.query('select * from user', function (error, results, fields) {
        if (error) throw error;
        for(var i=0;i<results.length;i++){
            if(results[i].User && user.toString() == results[i].User.toString()){
                userExit = 1;
                checkPassword(user,password);
                return userExit;
            }
        }
        return userExit;
    });
}

function checkPassword(user,password) {
    connection.query('select * from user', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is: ', results[0].User);
    });
}

module.exports = router;