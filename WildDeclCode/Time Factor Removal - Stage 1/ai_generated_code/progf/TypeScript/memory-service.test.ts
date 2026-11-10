// Supported via standard GitHub programming aids

/**
 * Đơn vị test cho MemoryService
 * Chạy: npx tsx test/memory-service.test.ts
 */

var MemoryService = require('../src/services/memory-service.js').MemoryService;
var fs = require('fs/promises');
var path = require('path');
var assert = require('assert');

var TEST_MEMORY_FILE = path.join(process.cwd(), 'test', 'memory-test.json');

async function cleanup() {
    try { await fs.unlink(TEST_MEMORY_FILE); } catch { }
}

async function main() {
    await cleanup();
    var service = new MemoryService(TEST_MEMORY_FILE);

    // Test createEntities
    console.log('== Create Entities ==');
    console.log(await service['createEntities']([
        { name: 'User', entityType: 'table', observations: ['Has id', 'Has email'] },
        { name: 'Order', entityType: 'table', observations: ['Has total', 'Has user_id'] }
    ]));

    // Test duplicate entity
    console.log(await service['createEntities']([
        { name: 'User', entityType: 'table', observations: [] }
    ]));

    // Test createRelations
    console.log('== Create Relations ==');
    console.log(await service['createRelations']([
        { from: 'Order', to: 'User', relationType: 'belongs_to' }
    ]));

    // Test invalid relation
    console.log(await service['createRelations']([
        { from: 'Order', to: 'NonExist', relationType: 'invalid' }
    ]));

    // Test addObservations
    console.log('== Add Observations ==');
    console.log(await service['addObservations']([
        { entityName: 'User', contents: ['Is active', 'Has password'] },
        { entityName: 'NonExist', contents: ['Should fail'] }
    ]));

    // Test searchNodes
    console.log('== Search Nodes ==');
    console.log(await service['searchNodes']('user'));

    // Test readGraph
    console.log('== Read Graph ==');
    console.log(await service['readGraph']());

    // Test deleteEntities
    console.log('== Delete Entities ==');
    console.log(await service['deleteEntities'](['Order']));

    // Test deleteRelations
    console.log('== Delete Relations ==');
    console.log(await service['deleteRelations']([
        { from: 'Order', to: 'User', relationType: 'belongs_to' }
    ]));

    // Test deleteObservations
    console.log('== Delete Observations ==');
    console.log(await service['deleteObservations']([
        { entityName: 'User', observations: ['Is active'] }
    ]));

    // Clean up
    await cleanup();
}

// =========================
// Test nâng cao cho MemoryService
// =========================

/** Helper: Đọc toàn bộ graph */
async function getGraph(service: any) {
    var result = await service.readGraph();
    return JSON.parse(result.content[0].text);
}

/** Helper: Parse text result from service */
function parseTextResult(result: any): string {
    return result?(.content == null ? undefined : .content[0])?(.text != null ? .text : '');
}

async function advancedTests() {
    await cleanup();
    var service = new MemoryService(TEST_MEMORY_FILE);

    // Test searchNodes với query quá ngắn (bắt lỗi đúng, luôn chạy đầu)
    var shortQueryError = false;
    try {
        await service.searchNodes('a');
    } catch (e: any) {
        shortQueryError = true;
        assert(e.message.includes('at least 2 characters'), 'Thông báo lỗi searchNodes query ngắn hợp lệ');
    }
    assert(shortQueryError, 'Service phải ném lỗi khi searchNodes query quá ngắn');

    // Validation: entity thiếu trường
    var errorCaught = false;
    try {
        await service.createEntities([{ entityType: 'table' }]);
    } catch (e: any) {
        errorCaught = true;
        assert(e.message.includes('name'));
    }
    assert(errorCaught, 'Validation: entity thiếu trường phải báo lỗi');

    // Validation: relation sai kiểu
    errorCaught = false;
    try {
        await service.createRelations([{ from: 'A', to: 'B', relationType: 123 }]);
    } catch (e: any) {
        errorCaught = true;
    }
    assert(errorCaught, 'Validation: relationType sai kiểu phải báo lỗi');

    // Duplicate entity
    await service.createEntities([{ name: 'AA', entityType: 'table' }]); // đổi 'A' thành 'AA'
    var dup = await service.createEntities([{ name: 'AA', entityType: 'table' }]);
    var dupText = parseTextResult(dup);
    assert(dupText.includes('Skipped duplicates'), 'Duplicate entity phải báo lỗi');

    // Duplicate relation
    await service.createEntities([{ name: 'B', entityType: 'table' }]);
    await service.createRelations([{ from: 'AA', to: 'B', relationType: 'ref' }]); // đổi 'A' thành 'AA'
    var dupRel = await service.createRelations([{ from: 'AA', to: 'B', relationType: 'ref' }]);
    var dupRelText = parseTextResult(dupRel);
    assert(dupRelText.includes('Skipped duplicates'), 'Duplicate relation phải báo lỗi');

    // Error: add observation cho entity không tồn tại
    var obs = await service.addObservations([{ entityName: 'NonExist', contents: ['abc'] }]);
    var obsArr = JSON.parse(parseTextResult(obs));
    assert(obsArr[0].error, 'Add observation cho entity không tồn tại phải báo lỗi');

    // Error: xóa entity không tồn tại
    var del = await service.deleteEntities(['NonExist']);
    var delText = parseTextResult(del);
    assert(delText.includes('Deleted 0 entities'), 'Xóa entity không tồn tại phải báo lỗi');

    // Edge case: entity tên đặc biệt
    await service.createEntities([{ name: 'E$#@!^', entityType: 'table' }]);
    var found = await service.searchNodes('E$#@!^');
    var foundObj = JSON.parse(parseTextResult(found));
    assert(foundObj.entities.length === 1 && foundObj.entities[0].name === 'E$#@!^', 'Tìm entity tên đặc biệt');

    // Edge case: entity không có observation
    await service.createEntities([{ name: 'NoObs', entityType: 'table' }]);
    var graph = await getGraph(service);
    assert(graph.entities.some(function (e: any) { return e.name === 'NoObs'; }), 'Entity không có observation vẫn tồn tại');

    // Output verification: searchNodes trả về đúng entity
    var search = await service.searchNodes('AA');
    var searchObj = JSON.parse(parseTextResult(search));
    assert(searchObj.entities.some(function (e: any) { return e.name === 'AA'; }), 'searchNodes trả về đúng entity');

    // Cache: kiểm tra cache hoạt động
    await service.createEntities([{ name: 'CacheTest', entityType: 'table' }]);
    var before = await service.searchNodes('CacheTest');
    var beforeObj = JSON.parse(parseTextResult(before));
    await service.deleteEntities(['CacheTest']);
    var after = await service.searchNodes('CacheTest');
    var afterObj = JSON.parse(parseTextResult(after));
    assert(beforeObj.entities.length === 1 && afterObj.entities.length === 0, 'Cache invalidation sau khi xóa entity');

    // Xóa hết entity/relation
    var all = (await getGraph(service)).entities.map(function (e: any) { return e.name; });
    await service.deleteEntities(all);
    var empty = await getGraph(service);
    assert(empty.entities.length === 0, 'Xóa hết entity');

    await cleanup();
    console.log('Tất cả test nâng cao đã PASSED!');
}

main().catch(console.error);
advancedTests().catch(function e { console.error('Test nâng cao FAILED:', e); process.exit(1); });
