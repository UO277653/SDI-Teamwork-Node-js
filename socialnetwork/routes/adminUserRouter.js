const express = require('express');
const adminUserRouter = express.Router();

/**
 * Here we will make sure that only the user identified as admin can access the functionality of the administrator,
 * through the use of a router
 */
adminUserRouter.use(function(req, res, next) {
    console.log("routerAdminSession");
    if ( req.session.user == "admin@email.com" ) { // Check if user is admin
        next();
    } else {
        console.log("va a: " + req.originalUrl);
        res.redirect("/users/login"); // In case not admin, redirect to another page
    }
});
module.exports = adminUserRouter;