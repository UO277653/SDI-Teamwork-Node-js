const {ObjectId} = require("mongodb");

module.exports = function (app, usersRepository, friendsRepository) {
  let logger = app.get('logger');


  // To make our lives easier on the Twig side,
  // we will create a collection of tuples that
  // contain the given user and the possible
  // friend request involving the logged user.
  function _usersListGenerateTuples(sessionUser, usersList, tupleCallback, onComplete) {

    let promises = [];
    for (let i = 0; i < usersList.length; i++) {
      let otherUser = usersList[i];
      let filter = { // Requests sent to or received by our user
        $or:[
          {sender: sessionUser, receiver: otherUser.email},
          {sender: otherUser.email, receiver: sessionUser},
        ]
      };
      promises[i] = friendsRepository.findRequest(filter, {});
    }

    Promise.all(promises).then(requests => {
      for (let i = 0; i < usersList.length; i++) {
        tupleCallback({ user: usersList[i], friendRequest: requests[i]});
      }
      onComplete();
    });
  }


  app.get('/users', function (req, res) {
    logger.info("[GET] /users");
    let filter = {};
    let options = {};

    if(req.query.search != null && typeof req.query.search != "undefined" && req.query.search != ""){
      let condition = {$regex: ".*" + req.query.search + ".*"}
      filter = {$or:[{"email": condition}, {"name": condition}, {"surname": condition}]};
    }

    // Not include admins
    filter["role"] = {$ne: "admin"};

    // Not include himself
    filter["email"] = {$ne: req.session.user};

    let page = parseInt(req.query.page);
    if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") {
      page = 1;
    }

    usersRepository.getUsersPg(filter, options, page).then(result => {
      const limit = app.get("pageLimit");
      let lastPage = result.total / limit;
      if (result.total % limit > 0) { // Sobran decimales
        lastPage = lastPage + 1;
      }
      let pages = []; // paginas mostrar
      for (let i = page - 2; i <= page + 2; i++) {
        if (i > 0 && i <= lastPage) {
          pages.push(i);
        }
      }

      let listedUsers = [];
      let tupleCallback = (tuple) => {
        listedUsers.push(tuple);
      };
      _usersListGenerateTuples(req.session.user, result.users, tupleCallback, () => {

        let response = {
          listedUsers: listedUsers,
          pages: pages,
          currentPage: page,
          sessionUser: req.session.user
        }
        res.render('user/users.twig', response);
      });

    }).catch(error => {
      logger.error("[GET] /users - Se ha producido un error al listar los usuarios");
      res.send("Se ha producido un error al listar los usuarios: " + error)
    })

  });
  
  app.get('/users/signup', function (req, res) {
    logger.info("[GET] /users/signup");
    res.render("signup.twig", {sessionUser:req.session.user});
  });

  app.post('/users/signup', function (req, res) {
    logger.info("[POST] /users/signup");
    let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
        .update(req.body.password).digest('hex');

    let userValidate = {
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      password: req.body.password,
      passwordConfirm : req.body.passwordConfirm
    };

    validateSignup(userValidate, function(errors){
      if (errors!=null && errors.length>0){
        logger.error("[POST] /users/signup - " + errors);
        res.redirect("/users/signup" +
            "?message="+errors+"&messageType=alert-danger");
      } else {
        let user = {
          email: req.body.email,
          name: req.body.name,
          surname: req.body.surname,
          password: securePassword,
          role:"standard"
        };

        usersRepository.getUsers({email: req.body.email}, {}).then( users => {
          if (users != null && users.length != 0){
            logger.error("[POST] /users/signup - Email is already in use");
            res.redirect("/users/signup" +
                "?message=Email is already in use"+
                "&messageType=alert-danger");
          } else {
            usersRepository.insertUser(user).then(userId => {
              req.session.user = user.email;
              //todo Redirigir a las opciones de usuario
              res.redirect("/users" + "?message=New user successfully registered" +
                  "&messageType=alert-success");
            }).catch(error => {
              logger.error("[POST] /users/signup - An error has occurred adding the user");
              res.redirect("/users/signup" +
                  "?message=An error has occurred adding the user"+
                  "&messageType=alert-danger");
            });
          }
        }).catch(error => {
          logger.error("[POST] /users/signup - An error has occurred");
          res.redirect("/users/signup" +
              "?message=An error has occurred"+
              "&messageType=alert-danger");
        });

      }
    })




  });


  function validateSignup(user, callback){
    let errors = new Array();
    //Name
    if (user.name === null || typeof user.name === 'undefined' ||user.name.length<4 ||user.name.length>24|| user.name.trim().length == 0){
      errors.push("Name must be between 4 and 24 characters, it cannot be empty");
    }

    //Surname
    if (user.surname === null || typeof user.surname === 'undefined' ||user.surname.length<5 ||user.surname.length>24|| user.surname.trim().length == 0){
      errors.push("Username must be between 5 and 24 characters. It cannot be empty");
    }

    //Email
    if (user.email === null || typeof user.email === 'undefined' || user.email.trim().length == 0){
      errors.push("Email cannot be empty");
    }
    //testing the email has the correct format
    let pattern = /\S+@\S+\.\S+/;
    if (! pattern.test(user.email)){
      errors.push("Email does not follow the expected format");
    }

    //Password
    if (user.password !== user.passwordConfirm){
      errors.push("Passwords do not match");
    }
    if (user.password === null || typeof user.password === 'undefined' ||user.password.length<4 ||user.password.length>24|| user.password.trim().length == 0){
      errors.push("Password must be between 4 and 24 characters");
    }


    if (errors.length<=0){
      callback(null);
    } else {
      callback(errors);
    }
  }

  app.get('/users/login', function (req, res) {
    logger.info("[GET] /users/login");
    res.render("login.twig", {sessionUser: req.session.user});
  })

  app.post('/users/login', function (req, res) {
    logger.info("[POST] /users/login");
    let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
        .update(req.body.password).digest('hex');
    let filter = {
      email: req.body.email,
      password: securePassword
    }
    console.log("USER SIGNING IN: " + req.body.email);

    usersRepository.findUser(filter, {}).then(user => {
      if (user == null){
        logger.error("[POST] /users/login - Wrong email or password");
        req.session.user = null;
        res.redirect("/users/login" +
            "?message=Wrong email or password"+
            "&messageType=alert-danger ");
      } else {
        req.session.user = user.email;
        if (user.role === 'admin'){
          //lista todos los usuarios de la aplicacion
          res.redirect("/admin/list" +
              "?message=Admin successfully logged in"+
              "&messageType=alert-success");
        } else {
          //listado de usuarios de la red social
          //console.log(res); // Si se comenta esta línea, los tests de login-logout-login no pasan
          res.redirect("/users" +
              "?message=User successfully logged in"+
              "&messageType=alert-success");
        }
      }
    }).catch(error => {
      logger.error("[POST] /users/login - n error has occurred finding the user");
      req.session.user = null;
      res.redirect("/users/login" +
          "?message=An error has occurred finding the user"+
          "&messageType=alert-danger ");
    })
  });

  app.get('/users/logout', function (req, res) {
    logger.info("[GET] /users/logout");

    req.session.user = null;
    res.redirect("/users/login" +
        "?message=User successfully logged out"+
        "&messageType=alert-success");
  });


}
