const express = require('express');
const userRouter = express.Router();
userRouter.use(function(req, res, next) {
    console.log("userRouter");

    if ( req.session.user) {
        if (req.originalUrl.includes("/users/login") || req.originalUrl.includes("/users/signup")){ //Si el usuario ha iniciado sesion no puede acceder a signup ni login
            console.log("va a: " + req.originalUrl);
            res.redirect("/users");
        } else {
            next();
        }
    } else {
        if (req.originalUrl.includes("/users/logout")){ //si el usuario no esta autenticado no puede acceder a logout
            console.log("va a: " + req.originalUrl);
            res.redirect("/users/login");
        } else {
            next();
        }

    }
});
module.exports = userRouter;