var express = require('express');
var nodemailer = require('nodemailer');
var router = express.Router();
var mysql = require("./db");
var User = require("./user");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'VrouwenWillenSchoenen' });
});

router.get('/register', function(req, res, next) {
  res.render('registreren', { title: 'VrouwenWillenSchoenen' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'VrouwenWillenSchoenen' });
});

router.get('/download', function(req, res, next) {
  res.render('game', { title: 'VrouwenWillenSchoenen Game' });
});

router.get('/userHome', function(req, res, next) {
  res.render('userIndex', { title: 'VrouwenWillenSchoenen' });
});

router.get('/downloadGame', function(req, res, next){
  var file = __dirname + '/download/ShoeSnake.7z';
  res.download(file); // Set disposition and send it.
});


router.post('/inlog', function(req, res){
     User.login(req.body.mail, req.body.ww, function(err, result){
        if(err){
            console.log(err);
            res.redirect('/login'); 
        }else{
            res.redirect('/userHome'); 
        }
    });
    
});


router.post('/add', function(req, res){
    user = new User();
    user.setEmail(req.body.mail);
    user.setName(req.body.name);
    user.setPassword(req.body.ww);
    console.log("ADD: " + user.getEmail() + user.getName() + user.getPassword());
    User.register(user, function(err, result){
        if(err){
            console.log(err);
            res.send("geen success " + err);
        }else{
            //res.send(result);
            var transporter = nodemailer.createTransport({
                service : 'Gmail',
                auth: {
                    user: 'testnodemailserver@gmail.com',
                    pass: 'TestnodeMail'
                }
            });
            var mailOptions = {
                from: 'testnodemailserver@gmail.com',
                to: user.getEmail(),
                subject: 'Activeer account',
                html: "<a href='https://hidden-headland-69864.herokuapp.com/activate?email=" + user.getEmail() + "'>activeer uw VrouwenWillenSchoenen Account</a>"
                
            };
            transporter.sendMail(mailOptions, function(err, info){
                if(err){
                    res.send("kon mail niet versturen " + err);
                }else{
                    console.log('message sent: ' + info.response);
                    res.redirect('/');
                }
                
            });
            
            
        }
    }); 
});

router.get('/activate', function(req, res){
     User.activate(req.query.email, function(err, result){
        if(err){
            console.log(err);
            res.redirect('/register'); 
        }else{
            res.redirect('/'); 
        }
    });
    
});

router.get('/registerEnquette', function(req, res){
     User.insertEnquette(req.query.email, req.query.beroep, req.query.aantalKinderen, req.query.ProcType, function(err, result){
        if(err){
            console.log(err);
            res.redirect('/register'); 
        }else{
            res.redirect('/'); 
        }
    });
    
});


module.exports = router;
