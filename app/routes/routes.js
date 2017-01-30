module.exports = function(app, qs, passport, async) {
    var UserTypes = require('./../models/userTypes');
    var Users = require('./../models/user');
    var CO = require('./../models/contributingOrg');
    var Rosetta = require('./../models/rosetta');
    var crypto = require('crypto');
    var bcrypt = require('bcrypt-nodejs');
    var nodemailer = require("nodemailer");

    var express = require('express');
    var schedule = require('node-schedule');
    var backup = require('mongodb-backup');
    var restore = require('mongodb-restore');
    var fs = require('fs');
    // =====================================
    // LOGIN ===============================
    // =====================================
    // database backup
    app.post('/api/backup/:par', function(req, res) {
        if (req.params.par === "now") {
            root = './backup/backup' + '_' + Date.now();

            var path = './backup/backup.txt';
            backup({
                uri: 'mongodb://127.0.0.1:27017/rtmms', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
                root: root, // write files into this dir
                parser: 'json'

            });




            fs.appendFile('./backup/backup.txt', root + ',', function(err) {
                if (err) {
                    throw 'error opening file: ' + err;
                }
            });

            res.send("Backup successful");



        } else if (req.params.par === "week") {
            schedule.scheduleJob('* * * * *', function() {
                backup({
                    uri: 'mongodb://127.0.0.1:27017/rtmms', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
                    root: './backup/backup' + Date.now(), // write files into this dir

                });
            });
            res.send("Backup successful");

        }

    });
    app.post('/api/restore', function(req, res) {
        console.log(req.body[0]);
        if (req.body[0] !== undefined) {
            root = req.body[0] + '/rtmms';
            restore({
                uri: 'mongodb://127.0.0.1:27017/rtmms', // mongodb://<dbuser>:<dbpassword>@<dbdomain>.mongolab.com:<dbport>/<dbdatabase>
                root: root
            });
            res.send("Restore successful");
        } else {

            res.send("Please select a backup");
        }



    });
    app.get('/api/readFile', function(req, res) {

        text = fs.readFileSync('./backup/backup.txt', 'utf8');

        res.json(text);

    });

    app.get('/api/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.send({
            user: req.user
        });
    });

    app.post('/api/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                res.status(401).send(req.flash('loginMessage'));
            } else {
                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send({
                        message: req.flash('loginMessage'),
                        user: req.user
                    });
                });
            }
        })(req, res, next);
    });

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/api/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.send({
            message: req.flash('signupMessage')
        });
    });

    app.post('/api/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            console.log("HERe========");
            console.log(user);
            if (err) {
                return next(err);
            }
            if (!user) {
                res.status(401).send(req.flash('signupMessage'));
            } else {
                req.logIn(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    res.status(200).send(req.flash('signupMessage'));
                });
            }
        })(req, res, next);
    });

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/api/profile', isLoggedIn, function(req, res) {
        res.send({
            user: req.user
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // =====================================
    // User Types ==============================
    // =====================================

    app.get('/api/usertypes', function(req, res) {
        queryUserTypes = UserTypes.find(null);

        queryUserTypes.exec(function(err, userTypes) {
            if (err) {
                return next(err);
            }
            res.json(userTypes);
            return;
        });
    });





    // =====================================
    // Users ==============================
    // =====================================
    app.post('/api/users', isAdminLoggedIn, function(req, res, next) {
        //        console.log(req.body);

        var query = Users.find(null);
        query.sort({
            id: -1
        }).exec(function(err, u) {
            max = u[0].id;


        }).then(function() {
            var user = new Users(req.body);
            user.password = user.generateHash(req.body.password);
            user.userTypes = {
                // id:JSON.parse(req.param('userTypes')).id,
                id: JSON.parse(req.param('userTypes')).id,
                usertype: JSON.parse(req.param('userTypes')).usertype
            };
            user.contributingOrganization = {
                _id: JSON.parse(req.param('contributingOrganization'))._id,
                name: JSON.parse(req.param('contributingOrganization')).name
            };
            user.userStat = "warning";
            user.id = max + 1;
            user.save(function(err, user) {
                if (err) {
                    return next(err)
                }
                res.json(201, user)
            });
            return;

        });

    });

    app.get('/api/users', isLoggedIn, function(req, res) {
        queryUsers = Users.find(null);
        // console.log(UserTypes);

        queryUsers.exec(function(err, users) {
            if (err) {
                return next(err);
            }


            res.json(users);
            return;
        });
    });

    app.get('/api/users/username', isLoggedIn, function(req, res) {
        Users.findOne({
            _id: req.params.username
        }, function(err, user) {
            if (err)
                res.send(err);

            if (user) {
                res.json(user);
            }


        });
    });


    app.put('/api/users/:username', isLoggedIn, function(req, res) {

        if ((typeof req.body.userTypes) === 'string') {
            req.body.userTypes = JSON.parse(req.body.userTypes);

        }
        var query = Users.where({
            _id: req.params.username
        });
        query.findOne(function(err, user) {
            if (err) {
                res.send(err);
            }
            if (user) {
                if (user.password !== req.body.password) {
                    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null);
                    console.log(req.body.password);
                }
            }
            Users.findOneAndUpdate({
                _id: req.params.username
            }, req.body, function(err) {
                console.log("here");
                if (!err) {

                    res.end('{"success" : "User updated successfully", "status" : 200}');
                } else {
                    console.log(err);
                    res.send(err);
                }
            });
        });





    });

    app.delete('/api/users/:username', isAdminLoggedIn, function(req, res) {
        Users.remove({
            _id: req.params.username
        }, function(err, user) {
            if (err) {
                res.send(err);
            } else {
                res.end('{"success" : "Enumeration value deleted successfully", "status" : 200}');
            }
        });
    });
    // =====================================
    // Reset Password ==============================
    // =====================================
    app.get('/api/forgot', function(req, res) {
        res.send({
            user: req.user
        });
    });

    app.post('/api/forgot', function(req, res, next) {
        async.waterfall([
                function(done) {
                    crypto.randomBytes(20, function(err, buf) {
                        var token = buf.toString('hex');
                        console.log(token);
                        done(err, token);
                    });
                },
                function(token, done) {
                    Users.findOne({
                        email: req.body.email
                    }, function(err, user) {
                        if (!user) {
                            req.flash('error', 'No account with that email address exists.');
                            return res.redirect('/forgot');
                        }

                        user.resetPasswordToken = token;
                        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
                        console.log(user);
                        user.save(function(err) {
                            done(err, token, user);
                        });
                    });
                },
                function(token, user, done) {
                    var smtpTransport = nodemailer.createTransport('SMTP', {
                        // host: 'stmp.nist.gov',
                        // port: 25
                        service: "Gmail",
                        auth: {
                            user: "ismailmell93@gmail.com",
                            pass: ""
                        }
                    });
                    var mailOptions = {
                        to: user.email,
                        from: 'passwordreset@demo.com',
                        subject: 'Node.js Password Reset',
                        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                    };
                    smtpTransport.sendMail(mailOptions, function(err) {
                        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                        done(err, 'done');
                    });
                }
            ],
            function(err) {
                if (err) return next(err);
                res.sendStatus(404);
            });
    });


    // MAIL

    app.post('/api/sendEmail', function(req, res) {
        console.log("heeere");
        var data = req.body;
        var smtpTransport = nodemailer.createTransport('SMTP', {
            host: 'stmp.nist.gov',
            port: 465,
            // service: "Gmail",
            auth: {
                user: process.env.MCRRC_EMAIL_ADDRESS,
                pass: process.env.MCRRC_EMAIL_PASSWORD
            }
        });
        smtpTransport.sendMail({
            from: "My Name <ismailmell93@gmail.com>", // sender address
            to: "Your Name <ismailmell93@gmail.com>", // comma separated list of receivers
            subject: "Hello ✔", // Subject line
            text: "Hello world ✔" // plaintext body
        }, function(error, response) {
            if (error) {
                console.log(error);
            } else {
                console.log("Message sent: " + response.message);
            }
        });

        /*
        transport.sendMail({
            from: {
                name: data.name,
                address: data.from
            },
            to: {
                name: "MCRRC RACE TEAM SITE ADMIN",
                address: process.env.MCRRC_EMAIL_ADDRESS
            },
            subject: data.subject, // Subject line
            text: data.body // plaintext body
        }, function(error, response) {
            if (error) {
                res.sendStatus(404);
            } else {
                res.end('{"success" : "Email sent successfully", "status" : 200}');
            }
        });*/
    });


    app.get('*', function(req, res) {
        res.render('index.ejs', {
            user: req.user
        }); // load the index.ejs file
    });

};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated()) {
        return next();
    }
    // if they aren't redirect them to the home page
    res.status(401).send("insufficient privileges");
}

// route middleware to make sure a user is logged in and an admin
function isAdminLoggedIn(req, res, next) {
    // if user is authenticated in the session and has an admin role, carry on 
    if (req.isAuthenticated() && req.user.userTypes.id === 4) {
        return next();
    }
    // if they aren't redirect them to the home page
    res.status(401).send("insufficient privileges");
}


function getAddDateToDate(date, years, months, days) {
    var resDate = new Date(date);
    resDate.setFullYear(resDate.getFullYear() + years, resDate.getMonth() + months, resDate.getDay() + days);
    return resDate;
}

// check if member is in list
function containsMember(list, member) {
    if (list.length == 0) {
        return false;
    }

    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].member[0]._id.equals(member._id)) {
            return true;
        }
    }
    return false;
}

function sortResultsByDistance(a, b) {
    if (a.racetype.meters < b.racetype.meters)
        return -1;
    if (a.racetype.meters > b.racetype.meters)
        return 1;
    return 0;
}