var Controller = require('@/application/controllers').Controller;
var HttpResponse = require('@/application/helpers').HttpResponse;
var unauthorized = require('@/application/helpers').unauthorized;
var ok = require('@/application/helpers').ok;
var Builder = require('@/application/validation').ValidationBuilder;
var Validator = require('@/application/validation').Validator;
var AuthenticationError = require('@/domain/entities').AuthenticationError;
var FacebookAuthentication = require('@/domain/use-cases').FacebookAuthentication;

type HttpRequest = { token: string }
type Model = Error | { accessToken: string }

class FacebookLoginController extends Controller {
  constructor (private readonly facebookAuthentication: FacebookAuthentication) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuthentication({ token })
      return ok(accessToken)
    } catch (error) {
      if (error instanceof AuthenticationError) return unauthorized()
      throw error
    }
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return [
      ...Builder.of({ value: token, fieldName: 'token' }).required().build()
    ]
  }
}
