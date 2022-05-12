const {ObjectId} = require("mongodb");

module.exports = function (app, messagesRepository, usersRepository, friendsRepository) {

    app.post("/api/v1.0/messages/add", function(req, res){
        try {
            let message = {
                sender: req.body.sender, //Aquí iría el correo del que crea el mensaje
                receiver: req.body.receiver,
                text: req.body.text,
                read: false,
                date: new Date()
            }


            if(req.body.sender == null || req.body.receiver == null){
                res.status(409);
                res.json({error: "Can not create message, sender or receiver invalid"});
            }
            else{
                messagesRepository.insertMessage(message).then(result =>{
                    if (result === null) {
                        res.status(404);
                        res.json({error: "Invalid id."});
                    }
                    else{
                        res.status(200);
                        res.json({
                            message: "Message added.",
                            result: result
                        })
                    }
                });
            }


        } catch (e) {
            res.status(500);
            res.json({error: "Error when adding a message: " + e})
        }
    });

    app.post("/api/v1.0/messages/conversation", function(req, res){
        try {
            let userName1 = req.body.userName1;
            let userName2 = req.body.userName2;

            let filter = {
                sender: {"$in": [userName1 , userName2]},
                receiver: {"$in": [userName1 , userName2]}
            };
            let options = {};
            messagesRepository.getMessages(filter, options).then(result =>{
                if (result === null) {
                    res.status(404);
                    res.json({error: "Invalid id."});
                }
                else{
                    res.status(200);
                    res.json({
                        message: "Conversation retrieved.",
                        result: result
                    })
                }
            });

        }
        catch (e) {
            res.status(500);
            res.json({error: "Error when adding a message: " + e})
        }
    });

    app.put("/api/v1.0/messages/setAsRead/:id", function(req, res){
        try {
            let userName1 = req.body.user;
            let id = req.params.id;

            let filter = {
                sender: userName1,
                _id : ObjectId(id)
            };
            const options = {upsert: false};
            messagesRepository.getMessages(filter, {}).then(result =>{
                if (result === null || result.length == 0) {
                    res.status(404);
                    res.json({error: "Invalid id."});
                }
                else{
                    result[0].read = true;
                    let messageId = ObjectId(id);
                    let newFilter = filter = {_id: messageId}
                    messagesRepository.updateMessage(result[0],newFilter, options).then(r => {
                        res.status(200);
                        res.json({
                            message: "Message modified.",
                            result: result[0]
                        })
                    }).catch(err =>{
                        res.status(500);
                        res.json({error : "Se ha producido un error al modificar el mensaje."})
                    });
                }
            });

        }
        catch (e) {
            res.status(500);
            res.json({error: "Error when adding a message: " + e})
        }
    });

    app.get("/api/v1.0/friends/list", function(req, res) {

        let options = {projection: {_id: 0, password: 0}}
        let filter = {
            $or:[
                {sender: req.query.user},
                {receiver: req.query.user}
            ],
            status: "ACCEPTED"
        };

        friendsRepository.getRequests(filter, options).then(requests => {
            let friendEmails = [];

            requests.forEach(request => {
                if(request.sender == req.query.user)
                    friendEmails.push(request.receiver);
                else
                    friendEmails.push(request.sender);
            });

            filter = {email: {$in: friendEmails}};
            usersRepository.getUsers(filter, options).then(users => {
                res.status(200);
                res.send({friends: users})
            }).catch(error => {
                res.status(500);
                res.json({ error: "Se ha producido un error al recuperar los amigos." })
            });
        });
    });

    app.post("/api/v1.0/users/login", function(req, res){
        try{
            let securePassword = app.get("crypto").createHmac('sha256', app.get('clave')).update(req.body.password).digest('hex');
            let filter = {
                email: req.body.email,
                password: securePassword
            }
            let options = {};
            usersRepository.findUser(filter, options).then(user => {
                if (user == null){
                    res.status(401); //unauthorized
                    res.json({
                        message: "Unauthorized user",
                        authenticated: false
                    })
                } else {
                    let token = app.get('jwt').sign(
                        {user: user.email, time:Date.now()/1000},
                        "secreto");
                    res.status(200);
                    res.json({
                        message: "Authorized user",
                        authenticated : true,
                        token: token
                    })
                }
            }).catch(error => {
                res.status(401);
                res.json({
                    message: "Se ha producido un error al verificar credenciales",
                    authenticated : false
                })
            })
        } catch (e){
            res.status(500);
            res.json({
                message: "Se ha producido un error al cerificar credenciales",
                authenticated: false
            })
        }
    });

}