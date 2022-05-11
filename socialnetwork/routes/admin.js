const {ObjectId} = require("mongodb");
module.exports = function (app, usersRepository) {

    /**
     * It was decided that it was more suitable to create a specific .js file for admin functionalities, due to the
     * ease that it provides when checking if the right user is accessing these pages (it has to be the admin user)
     * and in order not to pollute the code of the user routes (/user/...-)
     *
     * It works with the request and returns the view with all the users as the response
     */
    app.get('/admin/list', function (req, res) {

        usersRepository.getUsersAdmin({}, {}).then(users => {
            res.render('admin/single-user.twig', {users: users});
        }).catch(error => {
            res.send("Se ha producido un error al listar los usuarios: " + error)
        })
    });

    app.post('/admin/delete', function (req, res) {

        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                item = req.body[key];

                if (item[0].length == 1) {
                    let filter = {_id: ObjectId(item)};
                    usersRepository.deleteUser(filter, {}).then(result => {
                        if (result == null || result.deletedCount == 0) {
                            res.send("No se ha podido eliminar el usuario");
                        } else {
                            res.redirect("/admin/list");
                        }
                    }).catch(error => {
                        res.send("Se ha producido un error al intentar eliminar el usuario: " + error)
                    });

                } else {

                    let deletedIds = [];

                    for (let i = 0; i < item.length; i++) {
                            deletedIds.push(ObjectId(item[i]))
                    }

                    let filter = {_id: {$in: deletedIds}};

                    usersRepository.deleteUsers(filter, {}).then(result => {
                        if (result == null || result.deletedCount == 0) {
                            res.send("No se ha podido eliminar el usuario");
                        } else {
                            res.redirect("/admin/list");
                        }
                    }).catch(error => {
                        res.send("Se ha producido un error al intentar eliminar el usuario: " + error)
                    });

                }
            }
        }
    });





}