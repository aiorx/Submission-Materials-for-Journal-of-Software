//controller vai ter a logica

//chamando o json de filmes
var filmesJson = require("../models/filmes.json")


//função getAll retorna todos os filmes
var getAll = function (request, response) {

    response.status(200).json([
        {
            "filmes": filmesJson
        }
    ])
}


//função getById retorna um filme de um id especifico
var getById = function (request, response) {
    var idRequest = request.params.id
    var idEncontrado = filmesJson.find(filme => filme.id == idRequest)

    response.status(200).send(idEncontrado)
}

var createMovie = function (request, response) {
    var body = request.body

    var novoFilme = {
        id: (filmesJson.length)+1,
        Title: body.Title,
        Plot: body.Plot
    }

    filmesJson.push(novoFilme)

    response.status(201).json(
        [
            {
                "mensagem":"filme cadastrado com sucesso",
                novoFilme
            }
        ]
    )

}

//PATCH atualiza somente otitulo do filme
var updateTitle = function (request, response) {
    var idRequest = request.params.id 
    var novoTitulo = request.body.Title

    filmeFiltrado = filmesJson.find(filme => filme.id == idRequest)

    filmeFiltrado.Title = request.body.Title

    response.status(200).json(
        [
            {
                "mensagem": "filme atualizadocom sucesso",
                filmeFiltrado
            }
        ]
    )
}

//PUT
var updateMovie = function (request, response) {
    var idRequest = request.params.id
    var filmeRequest = request.body

    var indexEncontrado = filmesJson.findIndex(filme => filme.id == idRequest)

    filmesJson.splice(indexEncontrado, 1, filmeRequest)

    response.status(200).json(
        [
            {
                "mensagem": "filme atualizado com sucesso",
                filmesJson
            }
        ]
    )
}

//exportando todas os funções do controller para ser usada no filmesRoutes.js
module.exports = {
    getAll,
    getById,
    createMovie,
    updateTitle,
    updateMovie
}