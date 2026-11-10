var Body = require('@nestjs/common').Body;
var Controller = require('@nestjs/common').Controller;
var Delete = require('@nestjs/common').Delete;
var Get = require('@nestjs/common').Get;
var Param = require('@nestjs/common').Param;
var Post = require('@nestjs/common').Post;
var slug = require('slug');

var Author = require('./author.interface').Author;
var CreateAuthorDto = require('./create-author.dto').CreateAuthorDto;
var AuthorsService = require('./authors.service').AuthorsService;
var EntriesService = require('../entries/entries.service').EntriesService;
var Entry = require('../entries/entry.interface').Entry;

@Controller('authors')
class AuthorsController {

  constructor(
    private readonly authorsService: AuthorsService,
    private readonly entriesService: EntriesService,
  ) { }

  @Get()
  async findAll(): Promise<Author[]> {
    return this.authorsService.findAll();
  }

  @Post()
  async create( @Body() createAuthorDto: CreateAuthorDto) {
    const newEntry = Object.assign({}, createAuthorDto, {
      id: slug(createAuthorDto.display_name, { lower: true }),
    });
    await this.authorsService.create(newEntry);
  }

  @Delete(':authorId')
  delete( @Param('authorId') authorId) {
    return this.authorsService.deleteOne(authorId);
  }

  @Get(':authorId/entries')
  findEntriesByCategory( @Param('authorId') authorId): Promise<Entry[]> {
    return this.entriesService.findEntriesByAuthor(authorId);
  }

}
