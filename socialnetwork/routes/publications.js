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
            author: req.session.user

        }

        publicationsRepository.insertPublication(publication).then(publicationId =>{
            res.send("La publicación ha sido añadida");
        }).catch(error => {
            res.send("Error al insertar la publicación");
        })
    });

    app.get("/publications/listown", function (req, res) {
        res.redirect("/publications/list/" + req.session.user)
    });

    app.get('/publications/list/:user', function (req, res) {
        let author = req.params.user;

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
            if (result.total % 4 > 0) { // Sobran decimales
                lastPage = lastPage + 1;
            }
            let pages = []; // paginas mostrar
            for (let i = page - 2; i <= page + 2; i++) {
                if (i > 0 && i <= lastPage) {
                    pages.push(i);
                }
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
