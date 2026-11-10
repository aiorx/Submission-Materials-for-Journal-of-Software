var HttpContextContract = require('@ioc:Adonis/Core/HttpContext').HttpContextContract;
var Comment = require('App/Models/Comment');
var Moment = require('App/Models/Moment');

module.exports = class CommentsController {;
  public async store({ request, response, params }: HttpContextContract) {
    const body = request.body()
    const momentId = params.momentId

    await Moment.findOrFail(momentId)

    body.momentId = momentId

    const comment = await Comment.create(body)

    response.status(201)

    return {
      message: 'Comentário adicionado com sucesso!',
      data: comment,
    }
  }
}
