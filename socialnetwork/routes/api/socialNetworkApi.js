const {ObjectId} = require("mongodb");

module.exports = function (app, messagesRepository) {

    app.post("/api/messages/add", function(req, res){
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

    app.post("/api/messages/conversation", function(req, res){
        try {
            //let userName1 = req.body.userName1;
            //let userName2 = req.body.userName2;

            let userName1 = "prueba1@prueba1.com";
            let userName2 = "prueba2@prueba2.com";

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

    app.put("/api/messages/setAsRead/:id", function(req, res){
        try {
            //let userName1;
            //let id = req.params.id;

            let userName1 = "prueba1@prueba1.com";
            let id = "6279287bebaa0e07720075b4";

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

}