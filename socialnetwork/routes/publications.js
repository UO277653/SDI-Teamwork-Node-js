const {ObjectId} = require("mongodb");
const {request} = require("express");

module.exports = function (app, publicationsRepository) {

    app.get('/publications/add', function (req, res) {
        res.render("publications/add.twig");
    });

    app.post('/publications/add', function (req, res) {

        let publication = {
            title: req.body.title,
            text: req.body.content,
            date: new Date(),
            //author: req.session.user
            author: "tempAuthor"
        }

        publicationsRepository.insertPublication(publication).then(publicationId =>{
            res.send("La publicación ha sido añadida");
        }).catch(error => {
            res.send("Error al insertar la publicación");
        })
    });

    app.get('/publications/list/:id', function (req, res) {
        //let author = req.params.id;
        let author = "tempAuthor";
        let filter = {
            author: author
        };
        let options = {};
        let page = parseInt(req.query.page);
        if (typeof req.query.page === "undefined" || req.query.page === null || req.query.page === "0") { //
            page = 1;
        }

        publicationsRepository.getPublicationsPg(filter, options, page).then(result => {

            let lastPage = result.total / 4;
            if (result.total % 4 > 0) {
                lastPage = lastPage + 1;
            }
            let pages = [];
            for (let i = 1; i <= lastPage +1 ; i++) {
                pages.push(i);
            }

            let response = {
                publications: result.publications,
                pages: pages,
                currentPage: page,
                author: author
            }
            res.render("publications/list.twig", response);
        }).catch(error => {
            res.send("Se ha producido un error al listar las publicaciones del usuario " + error)
        });
    });

}
