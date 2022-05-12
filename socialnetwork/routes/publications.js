const {ObjectId} = require("mongodb");
const {request} = require("express");

module.exports = function (app, publicationsRepository, friendsRepository) {
    let logger = app.get('logger');

    app.get('/publications/add', function (req, res) {
        logger.info("[GET] /publications/add");
        res.render("publications/add.twig", {sessionUser: req.session.user});
    });

    app.post('/publications/add', function (req, res) {
        logger.info("[POST] /publications/add");

        let publication = {
            title: req.body.title,
            text: req.body.content,
            date: new Date(),
            author: req.session.user

        }
        // ?message=Wrong email or password&messageType=alert-danger%20
        if(publication.title == null || isBlank(publication.title)){
            logger.error("[POST] /publications/add - Title must not be empty");
            res.redirect("/publications/add?message=Title must not be empty&messageType=alert-danger%20");
        }
        else if ( publication.text == null || isBlank(publication.text)){
            logger.error("[POST] /publications/add - Content must not be empty");
            res.redirect("/publications/add?message=Content must not be empty&messageType=alert-danger%20");
        }
        else{

            publicationsRepository.insertPublication(publication).then(publicationId =>{
                res.send("The publication has been added");
            }).catch(error => {
                res.send("Error at inserting publication");
            })
        }

    });

    function isBlank(str) {
        return (!str || /^\s*$/.test(str));
    }

    app.get("/publications/listown", function (req, res) {
        logger.info("[GET] /publications/listown");
        res.redirect("/publications/list/" + req.session.user)
    });

    app.get('/publications/list/:user', function (req, res) {
        logger.info("[GET] /publications/list...");

        let author = req.params.user;

        let user1 = req.session.user
        let user2 = req.params.user


        let filter = {
            $or:[
                {sender: user1, receiver: user2},
                {sender: user2, receiver: user1}
            ]
        }


        friendsRepository.getRequests(filter,{}).then(requests =>{


            if(req.params.user == req.session.user || requests.length != 0) {
                if (req.params.user == req.session.user || requests[0].status == "ACCEPTED") {
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
                            author: author,
                            sessionUser: req.session.user
                        }
                        res.render("publications/list.twig", response);
                    }).catch(error => {
                        res.send("Se ha producido un error al listar las publicaciones del usuario " + error)
                    });

                } else {
                    res.send("You dont have permission to see the publications of this user");
                }
            }
            else{
                res.send("You dont have permission to see the publications of this user");
            }
        });



    });




}