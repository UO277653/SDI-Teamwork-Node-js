const express = require('express');
const signUpRouter = express.Router();
signUpRouter.use(function(req, res, next) {
    console.log("signUpRouter");
    if ( req.session.user ) {
        // dejamos correr la petición
        next();
    } else {
        console.log("va a: " + req.originalUrl);
        res.redirect("/users/signup");
    }
    //Name
    if (user.name === null || typeof user.name === 'undefined' ||user.name.length<4 ||user.name.length>24|| user.name.trim().length === 0){
        res.redirect("/users/signup" +
            "?message=Name must be between 4 and 24 characters, it cannot be empty"+
            "&messageType=alert-danger");
        return;
    }

    //Surname
    if (user.surname === null || typeof user.surname === 'undefined' ||user.surname.length<5 ||user.surname.length>24|| user.surname.trim().length === 0){
        res.redirect("/users/signup" +
            "?message=Username must be between 5 and 24 characters. It cannot be empty"+
            "&messageType=alert-danger");
        return;

    }

    //Email
    if (user.email === null || typeof user.email === 'undefined' || user.email.trim().length === 0){
        res.redirect("/users/signup" +
            "?message=Email cannot be empty"+
            "&messageType=alert-danger");
        return;
    }
    //testing the email has the correct format
    let pattern = /\S+@\S+\.\S+/;
    if (! pattern.test(user.email)){
        res.redirect("/users/signup" +
            "?message=Email does not follow the expected format"+
            "&messageType=alert-danger");
        return;
    }

    //Password
    if ( req.body.password != (req.body.passwordConfirm)){
        res.redirect("/users/signup" +
            "?message=Passwords do not match"+
            "&messageType=alert-danger");
        return;
    }
    if (req.body.password === null || typeof req.body.password === 'undefined' ||req.body.password.length<4 ||req.body.password.length>24|| req.body.password.trim().length === 0){
        res.redirect("/users/signup" +
            "?message=Password must be between 4 and 24 characters"+
            "&messageType=alert-danger");
        return;
    }
});
module.exports = signUpRouter;