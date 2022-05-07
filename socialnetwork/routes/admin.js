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
            res.render('admin/users.twig', {users: users});
        }).catch(error => {
            res.send("Se ha producido un error al listar los usuarios: " + error)
        })
    });





}