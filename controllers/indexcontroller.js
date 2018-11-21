

module.exports=function (app, con) {

  var session=require('express-session');


  // relevant-middlewares
  app.use(session({secret:'piyush'}));

    function on9(req,res) {
        if(req.session.online){
            return true;
        }
        else{
            res.render('login');
            return false;
        }
    }

    app.get('/',function (req,res) {
       if (req.session.online)
       {
           var data={
               on90: 1,
               name: req.session.name
           };
       }
       else var data={on90: 0};
        res.render('index',{data:data});

    });

    app.get('/login',function (req,res) {
        res.render('login');
    });

    app.get('/electronics',function (req,res) {
        if (!on9(req,res)){
            console.log('login required');
        }
        else{
            con.query('SELECT * FROM products WHERE product_type=?',['Electronics & Appliances'],function (err,result) {

                //console.log(res);
                res.render('electronics',{data:result,data1:req.session.name});
            });
        }

    });
    app.get('/mobiles',function (req,res) {
        if (!on9(req,res)){
            console.log('login required');
        }
        else {
            con.query('SELECT * FROM products WHERE product_type=?', ['Mobiles'], function (err, result) {

                //console.log(res);
                res.render('mobiles', {data: result,data1:req.session.name});
            });
        }
    });
    app.get('/books',function (req,res) {
        if (!on9(req,res)){
            console.log('login required');
        }
        else {
            con.query('SELECT * FROM products WHERE product_type=?', ['Books'], function (err, result) {

                //console.log(res);
                res.render('books', {data: result,data1:req.session.name});
            });
        }
    });
    app.get('/cooler',function (req,res) {
        if (!on9(req,res)){
            console.log('login required');
        }
        else {
            con.query('SELECT * FROM products WHERE product_type=?', ['Coolers'], function (err, result) {

                //console.log(res);
                res.render('cooler', {data: result,data1:req.session.name});
            });
        }
    });
    app.get('/others',function (req,res) {
        if (!on9(req,res)){
            console.log('login required');
        }
        else {
            con.query('SELECT * FROM products WHERE product_type=?', ['Others'], function (err, result) {

                //console.log(res);
                res.render('others', {data: result,data1:req.session.name});
            });
        }
    });

    app.post('/dashboard',function (req,res) {
        if(!true){
            console.log('chicago');
        }
        else {
            var email = req.body.email;
            var password = req.body.password;
            con.connect(function (err) {
                if (err) console.log('1');
                con.query("SELECT * FROM auth where email = ? ", [email], function (err, result, fields) {
                    if (err) {
                        console.log('error occured');
                    }
                    else {
                        if (result.length > 0) {
                            req.session.email = email;
                            req.session.ps = password;
                            req.session.name = result[0].name;
                            req.session.address = result[0].address;
                            req.session.contact = result[0].no;
                            req.session.online = true;

                            if (result[0].password == password) {
                                con.query("SELECT * FROM products WHERE seller_name=?", [req.session.name], function (error, result1) {
                                    console.log(result1.length);
                                    req.session.val = result1;
                                    console.log('matched');
                                    res.render('dashboard', {data: result[0], data1: result1});
                                });

                                //console.log(data1);
                            }
                            else {
                                res.render('error');
                            }
                        }
                        else {
                            res.render('erro1');
                        }
                    }

                });
            });

        }
    });



    app.get('/register',function (req,res) {
        res.render('register');
    });


    app.post('/xxx',function (req,res) {
        if (!true){
            console.log('reg required');
        }
        else {
            var name = req.body.fullname;

            var email = req.body.email;
            var password = req.body.password;
            var address = req.body.address;
            var contact = req.body.contact;
            var conpassword = req.body.conpassword;
            con.query('SELECT * FROM auth WHERE email=?',[email],function (errro,resul) {

                if(resul.length>0)
                {
                    res.render('error');
                }
                else{

                    if (password == conpassword) {
                        var sql = "INSERT INTO auth (name, email,no,address,password) VALUES " + "('" + name + "', '" + email + "', '" + contact + "', '" + address + "','" + password + "')";
                        //console.log(sql);
                        con.query(sql, function (err, result) {
                            if (err) {
                                console.log('error');
                            }
                            else {
                                console.log('1 item inserted');
                                res.render('login');
                            }
                        });
                    }
                    else {
                        res.send('password does not match','showAlert');
                    }

                }
            });

        }
    });

    app.post('/dick',function (req,res) {
        if (!on9(req,res)){
            console.log('login required');
        }
        else {
            var name = req.session.name;
            console.log(name);
            var prod_type = req.body.product_type;
            var prod_name = req.body.product_name;
            var description = req.body.description;
            var price = req.body.price;
            var sql = "INSERT INTO products (product_type, seller_name,product_name,description,price,contact,Address) VALUES " + "('" + prod_type + "', '" + name + "', '" + prod_name + "', '" + description + "','" + price + "', '" + req.session.contact + "', '" + req.session.address + "')";
            con.query(sql, function (err, result) {
                if (err) {
                    console.log('errwa');
                }
                else {
                    console.log('ghus gya');
                    var decoder = {
                        'name': req.session.name,
                        'email': req.session.email,
                        'address': req.session.address,
                        'no': req.session.contact
                    };
                    con.query("SELECT * FROM products WHERE seller_name=?", [req.session.name], function (error, result1) {
                        res.render('dashboard', {data: decoder, data1: result1});
                    });

                }
            });
        }
        });

    app.post('/deleteByID',function (req,res) {
        if (!on9(req,res)){
            console.log('login required');
        }
        else {
            var id = req.body.prodID;
            con.query("DELETE FROM products WHERE id=?", [id], function (req, res) {

                console.log('deleted');
            });
            var decoder = {
                'name': req.session.name,
                'email': req.session.email,
                'address': req.session.address,
                'no': req.session.contact
            };
            con.query("SELECT * FROM products WHERE seller_name=?", [req.session.name], function (error, result1) {
                res.render('dashboard', {data: decoder, data1: result1});
            });
        }
    });


    app.post('/logout',function (req,res) {

        req.session.online=false;
        res.render('index',{data:1});
    });
};
