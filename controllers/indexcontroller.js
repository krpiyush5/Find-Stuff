

module.exports=function (app, con) {

  var session=require('express-session');


  // relevant-middlewares
  app.use(session({secret:'piyush'}));


    app.get('/',function (req,res) {
        req.session.destroy();
        res.render('index');
    });

    app.get('/login',function (req,res) {

        res.render('login');
    });

    app.post('/dashboard',function (req,res) {
        var email=req.body.email;
        var password=req.body.password;
        con.connect(function(err) {
            if (err) console.log('1');
            con.query("SELECT * FROM auth where email = ? ",[email], function (err, result, fields) {
                if (err){
                    console.log('error occured');
                }
                else
                {
                 if(result.length>0)
                 {
                     req.session.email=email;
                     req.session.ps=password;
                     req.session.name=result[0].name;
                     req.session.address=result[0].address;
                     req.session.contact=result[0].no;

                     // console.log(req.session.un);

                     //console.log(result);
                     if(result[0].password==password){
                         con.query("SELECT * FROM products WHERE seller_name=?",[req.session.name],function (error,result1) {
                            console.log(result1.length);
                            req.session.val=result1;
                             console.log('matched');
                             res.render('dashboard',{data:result[0],data1:result1});
                         });

                         //console.log(data1);
                     }
                     else{
                         res.render('error');
                     }
                 }
                 else{
                     res.send({
                         "code":404,
                         "success":"Email does not exits"
                     });
                 }
                }

            });
        });


    });



    app.get('/register',function (req,res) {

        res.render('register');
    });


    app.post('/xxx',function (req,res) {

        var name=req.body.fullname;

        var email=req.body.email;
        var password=req.body.password;
        var address=req.body.address;
        var contact=req.body.contact;
        var conpassword=req.body.conpassword;
        if(password==conpassword) {
            var sql = "INSERT INTO auth (name, email,no,address,password) VALUES "+"('"+name+"', '"+email+"', '"+contact+"', '"+address+"','"+password+"')";
            //console.log(sql);
            con.query(sql,function (err,result) {
               if(err){
                   console.log('error');
               }
               else
               {
                   console.log('1 item inserted');
                   res.render('login');
               }
            });
        }
        else{
            res.send('password does not match')
        }
    }
    );

    app.post('/dick',function (req,res) {
   var name=req.session.name;
   console.log(name);
    var prod_type=req.body.product_type;
    var prod_name=req.body.product_name;
    var description=req.body.description;
    var price=req.body.price;
        var sql = "INSERT INTO products (product_type, seller_name,product_name,description,price) VALUES "+"('"+prod_type+"', '"+name+"', '"+prod_name+"', '"+description+"','"+price+"')";
        con.query(sql,function (err,result) {

            if(err)
            {
                console.log('errwa');
            }
            else{
                console.log('ghus gya');
                var decoder = {
                    'name': req.session.name,
                    'email': req.session.email,
                    'address': req.session.address,
                    'no': req.session.contact
                };
                con.query("SELECT * FROM products WHERE seller_name=?",[req.session.name],function (error,result1){
                    res.render('dashboard',{ data:decoder,data1:result1});
                });

            }
        });
    });

    app.post('/deleteByID',function (req,res) {

        var id = req.body.prodID;
        con.query("DELETE FROM products WHERE id=?",[id],function (req,res) {

            console.log('deleted');
        });
        var decoder = {
            'name': req.session.name,
            'email': req.session.email,
            'address': req.session.address,
            'no': req.session.contact
        };
        con.query("SELECT * FROM products WHERE seller_name=?",[req.session.name],function (error,result1){
            res.render('dashboard',{ data:decoder,data1:result1});
        });
    });
};
