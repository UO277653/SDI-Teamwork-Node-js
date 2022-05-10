const {ObjectId} = require("mongodb");

module.exports = function (app, usersRepository, friendsRepository) {


    app.get('/friends/list', function (req, res) {

        let filter = { // Requests sent to or received by our user
            $or:[
                {sender: req.session.user},
                {receiver: req.session.user},
            ]
        }
        friendsRepository.getRequests(filter, {}).then(async requests => {
            if (requests == null) {
                res.redirect("/users"); // TODO: error
                return;
            }
            // To make our lives easier on the Twig side,
            // we will create a collection of tuples that
            // contain the actual friend request and the
            // other user involved.
            let tuples= requests.map(function (friendReq, index, array) {
                return {
                    request: friendReq,
                    otherUser: (friendReq.sender === req.session.user)
                        ? friendReq.receiver
                        : friendReq.sender
                }
            });

            res.render("user/friendRequests.twig", {possibleFriends: tuples});

        }).catch(error => {
            res.send("Se ha producido un error al listar las publicaciones del usuario:" + error)
        });
    });



    // Receives: id of a user
    app.post('/friends/request/:id', function (req, res) {
        if (req.session.user == null) {
            res.redirect("/users/signup" + "?message=User must be logged in."+ "&messageType=alert-danger");
            return;
        }
        let friendId = ObjectId(req.params.id);
        if (req.session.user._id === friendId) {
            res.redirect("/users"); // TODO: error status - cannot send request to self
            return;
        }

        let filter = {_id: friendId};
        usersRepository.findUser(filter, {}).then(user => {
            if (user == null){
                res.redirect("/users");
                return;
            }

            let filter = { // Find if there are requests between these two users
                $or:[
                    {sender: req.session.user, receiver: user},
                    {sender: user, receiver: req.session.user},
                ]
            }
            friendsRepository.findRequest(filter, {}).then(existingRequest => {
                if (existingRequest != null){
                    res.redirect("/users");// TODO: error status - request already exists
                    return;
                }

                let friendRequest = {
                    sender: req.session.user,
                    receiver: user,
                    status: "sent"
                };
                friendsRepository.insertRequest(friendRequest).then(reqId => {
                    res.redirect("/users"); // TODO - success status
                }).catch(error => {
                    res.redirect("/users");// TODO: error status - request already exists
                });
            });
        }).catch(error => {
            res.redirect("/users");
        })
    });



    // Receives: id of a friend request
    app.post('/friends/accept/:id', function (req, res) {
        if (req.session.user == null) {
            res.redirect("/users/signup" + "?message=User must be logged in."+ "&messageType=alert-danger");
            return;
        }
        let filter = {_id: ObjectId(req.params.id)};
        friendsRepository.findRequest(filter, {}).then(friendRequest => {
            if (friendRequest == null){
                res.redirect("/users");// TODO: error status - no existing request
            } else {
                // Now that we've got the request, mark it as accepted and send it back to the db
                friendRequest.status = "ACCEPTED";
                friendsRepository.updateRequest(friendRequest)
                    .then(updateRes => {
                        res.redirect("/users"); // TODO - success status
                    }).catch(error => {
                        res.redirect("/users");// TODO: error status - request already exists
                    });
            }
        }).catch(error => {
            res.redirect("/users");// TODO: error status
        })
    });

}
