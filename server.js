var express=require('express');
var app=express();


var upload = require('express-fileupload');

var bcrypt=require('bcrypt');

var bodyParser=require('body-parser');

var mysql=require('mysql');


var indexcontoller=require('./controllers/indexcontroller');



app.use(bodyParser.urlencoded({extended:true}));

var connection=mysql.createConnection({

   host:'localhost',
   user:'root',
   password:'qwerty123',
   database:'findstuff'
});

connection.connect(function (err) {
   if(!!err){
      console.log('error');
   }
   else{
      console.log('connected');
   }
});

app.set('view engine','ejs');

app.use(express.static('./web'));


indexcontoller(app, connection);

app.listen(8000,function () {
   console.log("server is running");
});