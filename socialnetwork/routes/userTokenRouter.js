const jwt = require("jsonwebtoken");
const express = require('express');
const userTokenRouter = express.Router();
userTokenRouter.use(function (req, res, next) {
    console.log("userAuthorRouter");
    let token = req.headers['token'] || req.body.token || req.query.token;
    if (token != null) {
        // verificar el token
        jwt.verify(token, 'secreto', {}, function (err, infoToken) {
            if (err || (Date.now() / 1000 - infoToken.time) > 240) {
                res.status(403); // Forbidden
                res.json({
                    authorized: false,
                    error: 'Invalid or expired token'
                });
            } else {
                // dejamos correr la petición
                res.user = infoToken.user;
                next();
            }
        });
    } else {
        res.status(403);
        // Forbidden
        res.json({
            authorized: false,
            error: 'There is no token'
        });
    }
});
module.exports = userTokenRouter;