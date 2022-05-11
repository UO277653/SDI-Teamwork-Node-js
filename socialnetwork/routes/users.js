const {ObjectId} = require("mongodb");

module.exports = function (app, usersRepository, friendsRepository) {
  
  app.get('/users', function (req, res) {
    let filter = {};
    let options = {};

    if(req.query.search != null && typeof req.query.search != "undefined" && req.query.search != ""){
      let condition = {$regex: ".*" + req.query.search + ".*"}
      filter = {$or:[{"email": condition}, {"name": condition}, {"surname": condition}]};
    }

    // Not include admins
    filter["role"] = {$ne: "admin"};

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
      let response = {
        users: result.users,
        pages: pages,
        currentPage: page,
        session: req.session.user
      }

      res.render('user/users.twig', response);
    }).catch(error => {
      res.send("Se ha producido un error al listar los usuarios: " + error)
    })

  });
  
  app.get('/users/signup', function (req, res) {
    console.log("Access to signup form")
    res.render("signup.twig", {session: null});
  });

  app.post('/users/signup', function (req, res) {
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
              res.redirect("/users/signup" +
                  "?message=An error has occurred adding the user"+
                  "&messageType=alert-danger");
            });
          }
        }).catch(error => {
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
    res.render("login.twig", {session: null});
  })

  app.post('/users/login', function (req, res) {
    let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
        .update(req.body.password).digest('hex');
    let filter = {
      email: req.body.email,
      password: securePassword
    }

    usersRepository.findUser(filter, {}).then(user => {
      if (user == null){
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
          res.redirect("/users" +
              "?message=User successfully logged in"+
              "&messageType=alert-success");
        }
      }
    }).catch(error => {
      req.session.user = null;
      res.redirect("/users/login" +
          "?message=An error has occurred finding the user"+
          "&messageType=alert-danger ");
    })
  });

  app.get('/users/logout', function (req, res) {
    req.session.user = null;
    res.redirect("/users/login" +
        "?message=User successfully logged out"+
        "&messageType=alert-success");
  });



  /*
  app.get('/users/user/:id', function (req, res) {
    let filter = {_id: ObjectId(req.params.id)};
    usersRepository.findUser(filter, {}).then(user => {
      if (user == null){
        res.redirect("/users");
      } else {
        console.log("user found! "+ user);
        res.render("user/single-user.twig", {user: user, isFriend: false});
      }
    }).catch(error => {
      res.redirect("/users");
    })
  });*/

  app.get('/users/user/:id', function (req, res) {

    let filter = {_id: ObjectId(req.params.id)};
    usersRepository.findUser(filter, {}).then(user => {
      if (user == null){
        res.redirect("/users");
      } else {

        let friendFilter = { // Requests sent to or received by our user
          status: "ACCEPTED",
          $or:[
            {sender: req.session.user, receiver: user.email},
            {sender: user.email, receiver: req.session.user}
          ]
        };
        friendsRepository.findRequest(friendFilter, {}).then(friendRequest => {
          res.render("user/single-user.twig", {user: user, isFriend: friendRequest != null});
        }).catch(error => {
          res.render("user/single-user.twig", {user: user, isFriend: false});
        });
      }
    }).catch(error => {
      res.redirect("/users");
    })
  });
}
