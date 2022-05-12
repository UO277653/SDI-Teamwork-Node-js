const {ObjectId} = require("mongodb");

module.exports = function (app, usersRepository, friendsRepository) {
    let logger = app.get('logger');

    // To make our lives easier on the Twig side,
    // we will create a collection of tuples that
    // contain the actual friend request and the
    // other user involved.
    function _friendsListGenerateTuples(sessionUser, friendRequests, tupleCallback, onComplete) {

        let promises = [];
        for (let i = 0; i < friendRequests.length; i++) {
            let friendReq = friendRequests[i];
            let filter = {email: friendReq.sender};
            promises[i] = usersRepository.findUser(filter, {});
        }

        Promise.all(promises).then(users => {
            for (let i = 0; i < friendRequests.length; i++) {
                tupleCallback({ request: friendRequests[i], otherUser: users[i]});
            }
            onComplete();
        });
    }

    app.get('/request/list', function (req, res) {
        logger.info("[GET] /requests/list");

        let filter = { // Requests sent to or received by our user
            receiver: req.session.user,
            status: "SENT"
        }
        friendsRepository.getRequests(filter, {}).then(async requests => {
            if (requests == null) {
                res.status(500);
                res.redirect("/users");
                return;
            }

            let tuples = [];
            let tupleCallback = (tuple) => {
                tuples.push(tuple);
            };
            _friendsListGenerateTuples(req.session.user, requests, tupleCallback, () => {
                res.render("user/friendRequests.twig", {possibleFriends: tuples, sessionUser: req.session.user });
            });

        }).catch(error => {
            res.send("Se ha producido un error al listar las publicaciones del usuario:" + error)
        });
    });



    // Receives: id of a user
    app.post('/friends/request/:id', function (req, res) {
        logger.info("[POST] /friends/requests/:id");
        if (req.session.user == null) {
            res.redirect("/users/signup" + "?message=User must be logged in."+ "&messageType=alert-danger");
            return;
        }
        let filter = {_id: ObjectId(req.params.id)};
        usersRepository.findUser(filter, {}).then(user => {
            if (user == null){
                res.redirect("/users");
                return;
            }
            if (req.session.user === user.email) {
                res.status(500);
                res.redirect("/users");
                return;
            }

            let filter = { // Find if there are requests between these two users
                $or:[
                    {sender: req.session.user, receiver: user.email},
                    {sender: user.email, receiver: req.session.user},
                ]
            }
            friendsRepository.findRequest(filter, {}).then(existingRequest => {
                if (existingRequest != null){
                    res.status(500);
                    res.redirect("/users");
                    return;
                }

                let friendRequest = {
                    sender: req.session.user,
                    receiver: user.email,
                    status: "SENT"
                };
                friendsRepository.insertRequest(friendRequest).then(reqId => {
                    res.status(200);
                    res.redirect("/users");
                }).catch(error => {
                    res.status(500);
                    res.redirect("/users");
                });
            });
        }).catch(error => {
            res.redirect("/users");
        })
    });



    // Receives: id of a friend request
    app.post('/friends/accept/:id', function (req, res) {
        logger.info("[POST] /friends/accept/:id");
        if (req.session.user == null) {
            res.redirect("/users/signup" + "?message=User must be logged in."+ "&messageType=alert-danger");
            return;
        }
        let filter = {_id: ObjectId(req.params.id)};
        friendsRepository.findRequest(filter, {}).then(friendRequest => {
            if (friendRequest == null){
                res.status(500);
                res.redirect("/users");
            } else {
                // Now that we've got the request, mark it as accepted and send it back to the db
                friendRequest.status = "ACCEPTED";
                friendsRepository.updateRequest(friendRequest)
                    .then(updateRes => {
                        res.status(200);
                        res.redirect("/users");
                    }).catch(error => {
                        res.status(500);
                        res.redirect("/users");
                    });
            }
        }).catch(error => {
            res.status(500);
            res.redirect("/users");
        })
    });

    app.get("/friends", function(req, res) {
        logger.info("[GET] /friends");
       let options = {};
       let filter = {
           $or:[
               {sender: req.session.user},
               {receiver: req.session.user}
           ],
           status: "ACCEPTED"
       };

        let page = parseInt(req.query.page);
        if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") {
            page = 1;
        }

       friendsRepository.getRequests(filter, options).then(requests => {
           let friendEmails = [];
           requests.forEach(request => {
               if(request.sender == req.session.user)
                   friendEmails.push(request.receiver);
               else friendEmails.push(request.sender);
           });

           filter = {email: {$in: friendEmails}};
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
                   friends: result.users,
                   pages: pages,
                   currentPage: page,
                   sessionUser: req.session.user
               }

               res.render('user/friends.twig', response);
           });
       });
    });

}
