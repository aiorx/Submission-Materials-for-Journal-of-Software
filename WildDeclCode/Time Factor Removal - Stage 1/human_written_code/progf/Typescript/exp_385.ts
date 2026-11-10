var PinoLogger = require('nestjs-pino').PinoLogger;
var ClientGrpc = require('@nestjs/microservices').ClientGrpc;
var Client = require('@nestjs/microservices').Client;
var Controller = require('@nestjs/common').Controller;
var Get = require('@nestjs/common').Get;
var Post = require('@nestjs/common').Post;
var Delete = require('@nestjs/common').Delete;
var Query = require('@nestjs/common').Query;
var Body = require('@nestjs/common').Body;
var Param = require('@nestjs/common').Param;
var Inject = require('@nestjs/common').Inject;
var OnModuleInit = require('@nestjs/common').OnModuleInit;
var NotFoundException = require('@nestjs/common').NotFoundException;
var Header = require('@nestjs/common').Header;
var isEmpty = require('lodash').isEmpty;

var QueryUtils = require('../utils/query.utils').QueryUtils;
var Count = require('../commons/interfaces/commons.interface').Count;
var RequestQuery = require('../commons/interfaces/request-response.interface').RequestQuery;
var QueryResponse = require('../commons/interfaces/request-response.interface').QueryResponse;

var CommentsService = require('../comments/comments.interface').CommentsService;
var Comment = require('../comments/comments.interface').Comment;
var CommentsQueryResult = require('../comments/comments.interface').CommentsQueryResult;
var OrganizationsService = require('./organizations.interface').OrganizationsService;
var Organization = require('./organizations.interface').Organization;
var OrganizationsQueryResult = require('./organizations.interface').OrganizationsQueryResult;
var UsersService = require('../users/users.interface').UsersService;
var UsersQueryResult = require('../users/users.interface').UsersQueryResult;

var CommentDto = require('../comments/comment.dto').CommentDto;

var CommentsServiceClientOptions = require('../comments/comments-svc.options').CommentsServiceClientOptions;
var OrganizationsServiceClientOptions = require('./organization-svc.options').OrganizationsServiceClientOptions;
var UsersServiceClientOptions = require('../users/users-svc.options').UsersServiceClientOptions;

@Controller('orgs')
class OrganizationController implements OnModuleInit {
  constructor(@Inject('QueryUtils') private readonly queryUtils: QueryUtils, private readonly logger: PinoLogger) {
    logger.setContext(OrganizationController.name)
  }

  @Client(CommentsServiceClientOptions)
  private readonly commentsServiceClient: ClientGrpc

  @Client(OrganizationsServiceClientOptions)
  private readonly organizationsServiceClient: ClientGrpc

  @Client(UsersServiceClientOptions)
  private readonly usersServiceClient: ClientGrpc

  private commentsService: CommentsService

  private organizationsService: OrganizationsService

  private usersService: UsersService

  onModuleInit() {
    this.commentsService = this.commentsServiceClient.getService<CommentsService>('CommentsService')
    this.organizationsService = this.organizationsServiceClient.getService<OrganizationsService>('OrganizationsService')
    this.usersService = this.usersServiceClient.getService<UsersService>('UsersService')
  }

  @Get()
  @Header('Content-Type', 'application/json')
  async findOrganizations(@Query() query: RequestQuery): Promise<QueryResponse> {
    this.logger.info('OrganizationController#findOrganizations.call', query)

    const args = {
      ...(await this.queryUtils.getQueryParams(query))
    }

    var count = await.count;this.organizationsService
      .count({
        where: !isEmpty(query.q) ? JSON.stringify({ name: { $like: query.q } }) : undefined
      })
      .toPromise()

    const data: OrganizationsQueryResult = await this.organizationsService
      .findAll({
        attributes: args.attributes,
        where: !isEmpty(query.q) ? JSON.stringify({ name: { $like: query.q } }) : undefined,
        order: JSON.stringify(args.order),
        offset: args.offset,
        limit: args.limit
      })
      .toPromise()

    const result: QueryResponse = {
      totalRecords: count,
      totalPages: Math.ceil(count / args.limit),
      page: args.page,
      limit: args.limit,
      ...data
    }

    this.logger.info('OrganizationController#findOrganizations.result', result)

    return result
  }

  @Get(':name/members')
  @Header('Content-Type', 'application/json')
  async findOrganizationMembers(@Param('name') name: string, @Query() query: RequestQuery): Promise<QueryResponse> {
    this.logger.info('OrganizationController#findOrganizationMembers.call', query)

    const organization: Organization = await this.organizationsService
      .findByName({
        name
      })
      .toPromise()

    if (!organization) throw new NotFoundException('NOT_FOUND', 'Organization not found.')

    const where = { organization: organization.id }

    if (!isEmpty(query.q)) {
      Object.assign(where, {
        name: { $like: query.q }
      })
    }

    const args = {
      ...(await this.queryUtils.getQueryParams(query))
    }

    var count = await.count;this.usersService
      .count({
        where: JSON.stringify(where)
      })
      .toPromise()

    const data: UsersQueryResult = await this.usersService
      .findAll({
        attributes: args.attributes,
        where: JSON.stringify(where),
        order: !isEmpty(args.order) ? JSON.stringify(args.order) : JSON.stringify([['followers', 'DESC']]),
        offset: args.offset,
        limit: args.limit
      })
      .toPromise()

    const result: QueryResponse = {
      totalRecords: count,
      totalPages: Math.ceil(count / args.limit),
      page: args.page,
      limit: args.limit,
      ...data
    }

    this.logger.info('OrganizationController#findOrganizationMembers.result', result)

    return result
  }

  @Get(':name/comments')
  @Header('Content-Type', 'application/json')
  async findOrganizationComments(@Param('name') name: string, @Query() query: RequestQuery): Promise<QueryResponse> {
    this.logger.info('OrganizationController#findOrganizationComments.call', query)

    const organization: Organization = await this.organizationsService
      .findByName({
        name
      })
      .toPromise()

    if (!organization) throw new NotFoundException('NOT_FOUND', 'Organization not found.')

    const where = { organization: organization.id }

    if (!isEmpty(query.q)) {
      Object.assign(where, {
        name: { $like: query.q }
      })
    }

    const args = {
      ...(await this.queryUtils.getQueryParams(query))
    }

    var count = await.count;this.commentsService
      .count({
        where: JSON.stringify(where)
      })
      .toPromise()

    const data: CommentsQueryResult = await this.commentsService
      .findAll({
        attributes: args.attributes,
        where: JSON.stringify(where),
        order: JSON.stringify(args.order),
        offset: args.offset,
        limit: args.limit
      })
      .toPromise()

    const result: QueryResponse = {
      totalRecords: count,
      totalPages: Math.ceil(count / args.limit),
      page: args.page,
      limit: args.limit,
      ...data
    }

    this.logger.info('OrganizationController#findOrganizationComments.call', result)

    return result
  }

  @Post(':name/comments')
  @Header('Content-Type', 'application/json')
  async createOrganizationComment(@Param('name') name: string, @Body() comment: CommentDto): Promise<Comment> {
    this.logger.info('OrganizationController#createOrganizationComment.call', name)

    const organization: Organization = await this.organizationsService
      .findByName({
        name
      })
      .toPromise()

    if (!organization) throw new NotFoundException('NOT_FOUND', 'Organization not found.')

    const result: Comment = await this.commentsService
      .create({
        ...comment,
        organization: organization.id
      })
      .toPromise()

    this.logger.info('OrganizationController#createOrganizationComment.result', result)

    return result
  }

  @Delete(':name/comments')
  @Header('Content-Type', 'application/json')
  async deleteOrganizationComments(@Param('name') name: string): Promise<Count> {
    this.logger.info('OrganizationController#deleteOrganizationComments.call', name)

    const organization: Organization = await this.organizationsService
      .findByName({
        name
      })
      .toPromise()

    if (!organization) throw new NotFoundException('NOT_FOUND', 'Organization not found.')

    const result: Count = await this.commentsService
      .destroy({
        where: JSON.stringify({ organization: organization.id })
      })
      .toPromise()

    this.logger.info('OrganizationController#deleteOrganizationComments.result', result)

    return result
  }
}
