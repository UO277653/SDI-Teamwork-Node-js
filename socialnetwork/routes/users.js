module.exports = function (app, usersRepository) {

  app.get('/users', function (req, res) {
    let filter = {};
    let options = {};

    if(req.query.search != null && typeof req.query.search != "undefined" && req.query.search != ""){
      let condition = {$regex: ".*" + req.query.search + ".*"}
      filter = {$or:[{"email": condition}, {"name": condition}, {"surname": condition}]};
    }

    let page = parseInt(req.query.page);
    if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") {
      page = 1;
    }

    usersRepository.getUsers(filter, options, page).then(result => {
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