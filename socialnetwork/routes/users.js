module.exports = function (app, usersRepository) {

  app.get('/users', function (req, res) {
    usersRepository.getUsers({}, {}).then(users => {
      res.render('user/users.twig', {users: users});
    }).catch(error => {
      res.send("Se ha producido un error al listar los usuarios: " + error)
    })

  });

  app.get('/users/signup', function (req, res) {
    res.render("signup.twig");
  });

  app.get('/users/login', function (req, res) {
    res.render("login.twig");
  });

  app.post("/users/login", function(req, res) {
    let securePassword = app.get("crypto").createHmac("sha256", app.get("clave"))
        .update(req.body.password).digest("hex");
    let filter = {
      email: req.body.email,
      password: securePassword
    }
    let options = {};
    usersRepository.findUser(filter, options).then(user => {
      if( user == null) {
        req.session.user = null;
        res.redirect("/users/login" +
            "?message=Email o password incorrecto"+
            "&messageType=alert-danger ");
      } else {
        req.session.user = user.email;
        res.redirect("/publications");
      }
    }).catch(error => {
      req.session.user = null;
      res.redirect("/users/login" +
          "?message=Se ha producido un error al buscar el usuario"+
          "&messageType=alert-danger ");
    })
  })

  app.post('/users/signup', function (req, res) {
    let securePassword = app.get("crypto").createHmac('sha256', app.get('clave'))
        .update(req.body.password).digest('hex');
    let user = {
      email: req.body.email,
      password: securePassword
    }
    usersRepository.insertUser(user).then(userId => {
      res.redirect("/users/login" + "?message=Nuevo usuario registrado." +
          "&messageType=alert-info");
    }).catch(error => {
      res.redirect("/users/signup" +
          "?message=Se ha producido un error al registrar el usuario." +
          "&messageType=alert-danger");
    });
  });

  app.get('/users/logout', function (req, res) {
    req.session.user = null;
    res.redirect("/users/login");
  });

}