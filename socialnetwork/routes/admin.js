const {ObjectId} = require("mongodb");

module.exports = function (app, usersRepository, friendsRepository, publicationsRepository, messagesRepository) {
    let logger = app.get('logger');
    /**
     * It was decided that it was more suitable to create a specific .js file for admin functionalities, due to the
     * ease that it provides when checking if the right user is accessing these pages (it has to be the admin user)
     * and in order not to pollute the code of the user routes (/user/...-)
     *
     * It works with the request and returns the view with all the users as the response
     */
    app.get('/admin/list', function (req, res) {
        logger.info("[GET] /admin/list");

        usersRepository.getUsersAdmin({}, {}).then(users => {
            res.render('admin/users.twig', {users: users, sessionUser: req.session.user});
        }).catch(error => {
            res.send("Se ha producido un error al listar los usuarios: " + error)
        })
    });

    app.post('/admin/delete', function (req, res) {
        logger.info("[POST] /admin/delete");
        for (var key in req.body) {
            if (req.body.hasOwnProperty(key)) {
                item = req.body[key];

                if (item[0].length == 1) {
                    let filter = {_id: ObjectId(item)};
                    usersRepository.findUser(filter, {}).then( user => {

                        if(user==null) {
                            console.log("admin::delete found a null user!");
                            return;
                        }

                        let filterRequests = {
                            $or:[
                                {sender: user.email},
                                {receiver: user.email}
                            ],
                        }
                        friendsRepository.deleteFriendsOfUser(filterRequests, {});
                        let filterPublications = {
                            $or:[
                                {author: user.email},
                            ]
                        }
                        publicationsRepository.deletePublicationsOfUser(filterPublications, {});
                        let filterMessages = {
                            $or:[
                                {sender: user.email},
                                {receiver: user.email}
                            ]
                        }
                        messagesRepository.deleteMessagesOfUser(filterMessages, {});
                    }).then(
                    usersRepository.deleteUser(filter, {}).then(result => {
                        if (result == null || result.deletedCount == 0) {
                            res.send("No se ha podido eliminar el usuario");
                        } else {
                            res.redirect("/admin/list");
                        }
                    }).catch(error => {
                        res.send("Se ha producido un error al intentar eliminar el usuario: " + error)
                    })
                );

                } else {

                    let deletedIds = [];
                    for (let i = 0; i < item.length; i++) {
                            deletedIds.push(ObjectId(item[i]))
                    }
                    let filter = {_id: {$in: deletedIds}};
                    let options = { projection: { email : 1}}
                    usersRepository.findUsers(filter, options).then( emails => {

                    console.log(emails);

                    deleteUsersData(emails).then(usersRepository.deleteUsers(filter, {}).then(result => {
                            if (result == null || result.deletedCount == 0) {
                                res.send("No se ha podido eliminar el usuario");
                            } else {
                                res.redirect("/admin/list");
                            }
                        }).catch(error => {
                            res.send("Se ha producido un error al intentar eliminar el usuario: " + error)
                        })
                    );

                    })
                }
            }
        }
    });

    async function deleteUsersData(emails) {

        let emailsArray = [];
        for (let i = 0; i < emails.length; i++) {
            emailsArray.push(emails[i].email);
        }

        let filterRequests = {
            $or: [
                {sender: {$in: emailsArray}},
                {receiver: {$in: emailsArray}}
            ]
        }
        await friendsRepository.deleteFriendsOfUser(filterRequests, {});

        let filterPublications = {author: {$in: emailsArray}};

        await publicationsRepository.deletePublicationsOfUser(filterPublications, {});

        let filterMessages = {
            $or: [
                {sender: {$in: emailsArray}},
                {receiver: {$in: emailsArray}}
            ]
        }
        await messagesRepository.deleteMessagesOfUser(filterMessages, {});

    }





}