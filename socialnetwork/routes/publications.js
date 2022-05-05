const {ObjectId} = require("mongodb");
const {request} = require("express");

module.exports = function (app, publicationsRepository) {

    app.get('/publications/add', function (req, res) {
        res.render("publications/add.twig");
    });

    app.post('/publications/add', function (req, res) {



        let publication = {
            title: req.body.title,
            text: req.body.text,
            date: new Date(),
            author: "tempAuthor"
        }

        publicationsRepository.insertPublication(publication).then(publicationId =>{
            res.send("La publicación ("+req.body.text+") ha sido añadida");
        }).catch(error => {
            res.send("Error al insertar la publicación");
        })


    });

}
