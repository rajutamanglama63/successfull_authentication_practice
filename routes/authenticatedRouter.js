const express = require("express");
const bycrypt = require("bcryptjs");
const authUser = require("../model/Authenticated_user");
const passport = require("passport");
const { forwardAuthenticated } = require("../config/auth");

const router = express.Router();

// Register page
router.get('/register', forwardAuthenticated, (req, res) => {
    res.render("register");
})

// Login page
router.get('/login', forwardAuthenticated, (req, res) => {
    res.render("login");
})

router.post('/register', (req, res) => {
    const { username, email, password, conformPassword } = req.body;
    let errors = [];

    if(!username || !email || !password || !conformPassword) {
        errors.push({msg:"All field required!"});
    }

    if(password != conformPassword) {
        errors.push({msg:"Password don't match!"});
    }

    if(password.length < 6) {
        errors.push({msg:"Password should be at least 6 character long."});
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            username,
            password,
            conformPassword
        });
    } else {
        authUser.findOne({email: email}).then(user => {
            if(user){
                errors.push({msg:"User already exist!"});
                res.render('register', {
                    errors,
                    username,
                    password,
                    conformPassword
                });
            } else {
                const newUser = new authUser({
                    username,
                    email,
                    password
                });
                // hash password
                bycrypt.genSalt(10, (err, salt) => 
                    bycrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        // set password to hassed
                        newUser.password = hash;
                        // save user
                        newUser
                            .save()
                            .then(user => {
                                req.flash('success_msg', 'Successfully registered! now you may proceed further to login.')
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    })
                )
            }
        })
    }
})

// login routes
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashbord',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})

// logout routes
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out.');
    res.redirect('/users/login');
})


module.exports = router;