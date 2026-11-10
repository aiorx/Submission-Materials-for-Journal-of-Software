var ArgsValidator = require('vesper').ArgsValidator;
var Controller = require('vesper').Controller;
var Mutation = require('vesper').Mutation;
var Query = require('vesper').Query;
var EntityManager = require('typeorm').EntityManager;
var FindManyOptions = require('typeorm').FindManyOptions;
var TextGenerator = require('../service/TextGenerator').TextGenerator;
var Post = require('../entity/Post').Post;
var PostsArgs = require('../args/PostsArgs').PostsArgs;
var PostSaveArgs = require('../args/PostSaveArgs').PostSaveArgs;
var Category = require('../entity/Category').Category;
var PostsArgsValidator = require('../validator/PostsArgsValidator').PostsArgsValidator;

@Controller()
class PostController {

    constructor(private entityManager: EntityManager,
                private textGenerator: TextGenerator) {
    }

    @Query()
    @ArgsValidator(PostsArgsValidator)
    posts(args: PostsArgs) {

        let findOptions: FindManyOptions = {};
        if (args.limit)
            findOptions.take = args.limit;
        if (args.offset)
            findOptions.skip = args.offset;
        if (args.sortBy === "last")
            findOptions.order = { "id": "DESC" };
        if (args.sortBy === "name")
            findOptions.order = { "name": "ASC" };

        return this.entityManager.find(Post, findOptions);
    }

    @Query()
    post({ id }) {
        return this.entityManager.findOne(Post, id);
    }

    @Mutation()
    async postSave(args: PostSaveArgs) {

        const post = args.id ? await this.entityManager.findOneOrFail(Post, args.id) : new Post();
        post.title = args.title;
        post.text = args.text ? args.text : this.textGenerator.generate();
        if (args.categoryIds) {
            post.categories = await Promise.all(args.categoryIds.map(function categoryId {
                return this.entityManager.findOne(Category, categoryId);
            }));
        }

        return this.entityManager.save(Post, post);
    }

    @Mutation()
    async postDelete({ id }) {
        await this.entityManager.remove({ id: id });
        return true;
    }

}