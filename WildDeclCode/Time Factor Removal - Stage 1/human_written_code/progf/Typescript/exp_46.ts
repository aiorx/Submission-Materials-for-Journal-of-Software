var Module = require('@nestjs/common').Module;

var EntriesModule = require('./entries/entries.module').EntriesModule;
var AuthorsModule = require('./authors/authors.module').AuthorsModule;
var CategoriesModule = require('./categories/categories.module').CategoriesModule;
@Module({
    modules: [EntriesModule, AuthorsModule, CategoriesModule],
})

class ApplicationModule { }