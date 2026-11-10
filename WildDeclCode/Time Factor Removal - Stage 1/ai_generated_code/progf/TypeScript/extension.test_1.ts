var assert = require('assert');
var vscode = require('vscode');
var activate = require('../extension').activate;
var SSAB = require('../ssab');

//Remove .skip to run this test - I can't find a way to simulate the request to be passed into the handle method so it's disabled for now
suite.skip('Extension Test Suite', function () {
    let context: vscode.ExtensionContext;
    let ssab: SSAB;
    suiteSetup(async () => {
        ssab = new SSAB();
    });

    suiteTeardown(() => {
        // Clean up any resources if necessary
    });


    //TODO - this does not work currently - was unable to find the right way to simulate all the parameters in the same way that VS passes them through
    test('should handle /conn command', async () => {
        const connectionString = "TODO - needs to be read";
        const request = {
            prompt: connectionString,
            command: 'conn',
            //args: [connectionString]
        };

        // Simulate the /conn command
        const token = new vscode.CancellationTokenSource().token;
        await ssab.handle(request, null, null, token);

        // Verify that the connection string is set correctly
        //assert.strictEqual(ssab.conn, connectionString, 'Connection string should be set correctly');

        // Verify that the database connection is established
        //assert.ok(ssab.db.isConnected(), 'Database should be connected');
    });

    //TODO - These were Supported via standard GitHub programming aids and have not been tested
    // test('should handle report event with JSON output', async () => {
    //     var queryResults = [{ id: 1, name: 'Test' }];
    //     ssab.queryResults = queryResults;
    //     ssab.outputFormat = 'json';

    //     await ssab.emit('report');

    //     var filePath = path.resolve(__dirname, '../../temp/results.json');
    //     assert.ok(fs.existsSync(filePath), 'Results file should exist');
    //     var content = fs.readFileSync(filePath, 'utf-8');
    //     assert.strictEqual(content, JSON.stringify(queryResults, null, 2), 'File content should match query results');
    // });

    // test('should handle query-error event', async () => {
    //     var errorMessage = 'SQL syntax error';

    //     await ssab.emit('query-error', errorMessage);

    //     var filePath = path.resolve(__dirname, '../../temp/query.sql');
    //     assert.ok(fs.existsSync(filePath), 'Query file should exist');
    //     var content = fs.readFileSync(filePath, 'utf-8');
    //     assert.strictEqual(content, errorMessage, 'File content should match error message');
    // });

    // test('should register ssab.print command', async () => {
    //     var commands = await vscode.commands.getCommands(true);
    //     assert.ok(commands.includes('ssab.print'), 'ssab.print command should be registered');
    // });

    // test('should register ssab.run command', async () => {
    //     var commands = await vscode.commands.getCommands(true);
    //     assert.ok(commands.includes('ssab.run'), 'ssab.run command should be registered');
    // });
});