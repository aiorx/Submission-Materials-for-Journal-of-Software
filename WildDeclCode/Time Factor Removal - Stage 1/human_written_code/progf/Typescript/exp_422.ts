var _import = require('yargs');
var MigrationTemplate = require('./code_templates/MigrationTemplate').MigrationTemplate;
var ModelTemplate = require('./code_templates/ModelTemplate').ModelTemplate;
var RepositoryTemplate = require('./code_templates/RepositoryTemplate').RepositoryTemplate;
var ServiceTemplate = require('./code_templates/ServiceTemplate').ServiceTemplate;
var HandlerTemplate = require('./code_templates/HandlerTemplate').HandlerTemplate;
var Type = require('./code_templates/HandlerTemplate').Type;
var SwaggerRequestTemplate = require('./code_templates/SwaggerRequestTemplate').SwaggerRequestTemplate;
var SwaggerPathTemplate = require('./code_templates/SwaggerPathTemplate').SwaggerPathTemplate;
var SwaggerResponseTemplate = require('./code_templates/SwaggerResponseTemplate').SwaggerResponseTemplate;
var DynamoModelTemplate = require('./code_templates/DynamoModelTemplate').DynamoModelTemplate;
var DynamoRepositoryTemplate = require('./code_templates/DynamoRepositoryTemplate').DynamoRepositoryTemplate;
var SequenceTemplate = require('./code_templates/SequenceTemplate').SequenceTemplate;

const commands = yargs(process.argv.slice(2)).options({
    docs: { type: 'boolean', default: true, describe: 'Generate Swagger request, response & path' },
});

try {
    commands.command(
        'make:migration <table>',
        'Create a migration file',
        function () {},
        function (argv: Arguments) {
            const template = new MigrationTemplate(<string>argv.table);
            template.generate();
            console.log('Migration file successfully created');
        },
    );

    commands.command(
        'make:event <name>',
        'Create a new event handler',
        function () {},
        function (argv: Arguments) {
            const template = new HandlerTemplate(<string>argv.name, Type.EVENT);
            template.generate();
            console.log('Event Handler successfully created');
        },
    );

    commands.command(
        'make:api <name>',
        'Create a new api handler',
        function () {},
        function (argv: Arguments) {
            const template = new HandlerTemplate(<string>argv.name, Type.API);
            template.generate();
            console.log('API Handler successfully created');

            if (argv.docs) {
                const request = new SwaggerRequestTemplate(<string>argv.name);
                request.generate();
                console.log('Swagger definition successfully created');

                const response = new SwaggerResponseTemplate(<string>argv.name);
                response.generate();
                console.log('Swagger definition successfully created');

                const path = new SwaggerPathTemplate(<string>argv.name);
                path.generate();
                console.log('Swagger path successfully created');

                const sequence = new SequenceTemplate(<string>argv.name);
                sequence.generate();
                console.log('Sequence successfully created');
            }
        },
    );

    commands.command(
        'make:cron <name>',
        'Create a new cron handler',
        function () {},
        function (argv: Arguments) {
            const template = new HandlerTemplate(<string>argv.name, Type.CRON);
            template.generate();
            console.log('Cron Handler successfully created');
        },
    );

    commands.command(
        'make:model <name>',
        'Create a model class',
        function () {},
        function (argv: Arguments) {
            const template = new ModelTemplate(<string>argv.name);
            template.generate();

            console.log('Model successfully created');
        },
    );

    commands.command(
        'make:repository <name>',
        'Create a repository class',
        function () {},
        function (argv: Arguments) {
            const template = new ModelTemplate(<string>argv.name, true);
            template.generate();

            const repository = new RepositoryTemplate(<string>argv.name);
            repository.generate();

            console.log('Repository successfully created');
        },
    );

    commands.command(
        'dynamo:model <name>',
        'Create a dynamodb model class',
        function () {},
        function (argv: Arguments) {
            const template = new DynamoModelTemplate(<string>argv.name);
            template.generate();

            console.log('DynamoDB Model successfully created');
        },
    );

    commands.command(
        'dynamo:repository <name>',
        'Create a dynamodb repository class',
        function () {},
        function (argv: Arguments) {
            const template = new DynamoModelTemplate(<string>argv.name, true);
            template.generate();

            const repository = new DynamoRepositoryTemplate(<string>argv.name);
            repository.generate();

            console.log('DynamoDB Repository successfully created');
        },
    );

    commands.command(
        'make:service <name>',
        'Create a service class',
        function () {},
        function (argv: Arguments) {
            const template = new ServiceTemplate(<string>argv.name);
            template.generate();

            console.log('Service successfully created');
        },
    );

    commands.command(
        'swagger:request <name>',
        'Create a swagger request definition file',
        function () {},
        function (argv: Arguments) {
            const template = new SwaggerRequestTemplate(<string>argv.name);
            template.generate();

            console.log('Swagger definition successfully created');
        },
    );

    commands.command(
        'swagger:response <name>',
        'Create a swagger response definition file',
        function () {},
        function (argv: Arguments) {
            const template = new SwaggerResponseTemplate(<string>argv.name);
            template.generate();

            console.log('Swagger definition successfully created');
        },
    );

    commands.command(
        'swagger:path <name>',
        'Create a swagger path file',
        function () {},
        function (argv: Arguments) {
            const template = new SwaggerPathTemplate(<string>argv.name);
            template.generate();

            console.log('Swagger path successfully created');
        },
    );

    commands.command(
        'make:sequence <name>',
        'Create a sequence file',
        function () {},
        function (argv: Arguments) {
            const template = new SequenceTemplate(<string>argv.name);
            template.generate();

            console.log('Sequence successfully created');
        },
    );

    commands.strictCommands();
    commands.argv;
} catch (error) {
    console.log(error.message);
}
