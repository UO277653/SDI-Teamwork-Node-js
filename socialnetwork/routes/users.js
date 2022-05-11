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
        currentPage: page
      }

      res.render('user/users.twig', response);
    }).catch(error => {
      res.send("Se ha producido un error al listar los usuarios: " + error)
    })

  });
  
  app.get('/users/signup', function (req, res) {
    console.log("Access to signup form")
    res.render("signup.twig");
  });

  app.post('/users/signup', function (req, res) {
    let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
        .update(req.body.password).digest('hex');

    let user = {
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      password: securePassword,
      role: "standard"
    };

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

    usersRepository.getUsers({email: req.body.email}, {}).then( users => {
      if (users != null && users.length != 0){
        res.redirect("/users/signup" +
            "?message=Email is already in use"+
            "&messageType=alert-danger");
      } else {
        usersRepository.insertUser(user).then(userId => {
          req.session.user = user.email;
          //todo Redirigir a las opciones de usuario
          res.redirect("/users/users" + "?message=New user successfully registered" +
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

  });

  function validateSignup(user,passwordConfirm, res){
    //Name
    if (user.name === null || typeof user.name === 'undefined' ||user.name.length<4 ||user.name.length>24|| user.name.trim().length == 0){
      res.redirect("/users/signup" +
          "?message=Name must be between 4 and 24 characters, it cannot be empty"+
          "&messageType=alert-danger");
      return true;
    }

    //Surname
    if (user.username === null || typeof user.username === 'undefined' ||user.username.length<5 ||user.username.length>24|| user.username.trim().length == 0){
      res.redirect("/users/signup" +
          "?message=Username must be between 5 and 24 characters. It cannot be empty"+
          "&messageType=alert-danger");
      return true;
    }

    //Email
    if (user.email === null || typeof user.email === 'undefined' || user.email.trim().length == 0){
      res.redirect("/users/signup" +
          "?message=Email cannot be empty"+
          "&messageType=alert-danger");
      return true;
    }
    //testing the email has the correct format
    let pattern = /\S+@\S+\.\S+/;
    if (! pattern.test(user.email)){
      res.redirect("/users/signup" +
          "?message=Email does not follow the expected format"+
          "&messageType=alert-danger");
      return true;
    }

    //Password
    if (! user.password.equals(passwordConfirm)){
      res.redirect("/users/signup" +
          "?message=Passwords do not match"+
          "&messageType=alert-danger");
      return true;
    }
    if (user.password === null || typeof user.password === 'undefined' ||user.password.length<4 ||user.password.length>24|| user.username.trim().length == 0){
      res.redirect("/users/signup" +
          "?message=Password must be between 4 and 24 characters"+
          "&messageType=alert-danger");
      return true;
    }

    return false;
  }

  app.get('/users/login', function (req, res) {
    res.render("login.twig");
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
        res.redirect("/users"); //TODO redirect to users (ojo admin)
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
