// Supported via standard GitHub programming aids

/**
 * Đơn vị test cho MemoryService
 * Chạy: npx tsx test/memory-service.test.ts
 */

import { MemoryService } from '../src/services/memory-service.js';
import fs from 'fs/promises';
import path from 'path';
import assert from 'assert';

const TEST_MEMORY_FILE = path.join(process.cwd(), 'test', 'memory-test.json');

async function cleanup() {
    try { await fs.unlink(TEST_MEMORY_FILE); } catch { }
}

async function main() {
    await cleanup();
    const service = new MemoryService(TEST_MEMORY_FILE);

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
    const result = await service.readGraph();
    return JSON.parse(result.content[0].text);
}

/** Helper: Parse text result from service */
function parseTextResult(result: any): string {
    return result?.content?.[0]?.text ?? '';
}

async function advancedTests() {
    await cleanup();
    const service = new MemoryService(TEST_MEMORY_FILE);

    // Test searchNodes với query quá ngắn (bắt lỗi đúng, luôn chạy đầu)
    let shortQueryError = false;
    try {
        await service.searchNodes('a');
    } catch (e: any) {
        shortQueryError = true;
        assert(e.message.includes('at least 2 characters'), 'Thông báo lỗi searchNodes query ngắn hợp lệ');
    }
    assert(shortQueryError, 'Service phải ném lỗi khi searchNodes query quá ngắn');

    // Validation: entity thiếu trường
    let errorCaught = false;
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
    const dup = await service.createEntities([{ name: 'AA', entityType: 'table' }]);
    const dupText = parseTextResult(dup);
    assert(dupText.includes('Skipped duplicates'), 'Duplicate entity phải báo lỗi');

    // Duplicate relation
    await service.createEntities([{ name: 'B', entityType: 'table' }]);
    await service.createRelations([{ from: 'AA', to: 'B', relationType: 'ref' }]); // đổi 'A' thành 'AA'
    const dupRel = await service.createRelations([{ from: 'AA', to: 'B', relationType: 'ref' }]);
    const dupRelText = parseTextResult(dupRel);
    assert(dupRelText.includes('Skipped duplicates'), 'Duplicate relation phải báo lỗi');

    // Error: add observation cho entity không tồn tại
    const obs = await service.addObservations([{ entityName: 'NonExist', contents: ['abc'] }]);
    const obsArr = JSON.parse(parseTextResult(obs));
    assert(obsArr[0].error, 'Add observation cho entity không tồn tại phải báo lỗi');

    // Error: xóa entity không tồn tại
    const del = await service.deleteEntities(['NonExist']);
    const delText = parseTextResult(del);
    assert(delText.includes('Deleted 0 entities'), 'Xóa entity không tồn tại phải báo lỗi');

    // Edge case: entity tên đặc biệt
    await service.createEntities([{ name: 'E$#@!^', entityType: 'table' }]);
    const found = await service.searchNodes('E$#@!^');
    const foundObj = JSON.parse(parseTextResult(found));
    assert(foundObj.entities.length === 1 && foundObj.entities[0].name === 'E$#@!^', 'Tìm entity tên đặc biệt');

    // Edge case: entity không có observation
    await service.createEntities([{ name: 'NoObs', entityType: 'table' }]);
    const graph = await getGraph(service);
    assert(graph.entities.some((e: any) => e.name === 'NoObs'), 'Entity không có observation vẫn tồn tại');

    // Output verification: searchNodes trả về đúng entity
    const search = await service.searchNodes('AA');
    const searchObj = JSON.parse(parseTextResult(search));
    assert(searchObj.entities.some((e: any) => e.name === 'AA'), 'searchNodes trả về đúng entity');

    // Cache: kiểm tra cache hoạt động
    await service.createEntities([{ name: 'CacheTest', entityType: 'table' }]);
    const before = await service.searchNodes('CacheTest');
    const beforeObj = JSON.parse(parseTextResult(before));
    await service.deleteEntities(['CacheTest']);
    const after = await service.searchNodes('CacheTest');
    const afterObj = JSON.parse(parseTextResult(after));
    assert(beforeObj.entities.length === 1 && afterObj.entities.length === 0, 'Cache invalidation sau khi xóa entity');

    // Xóa hết entity/relation
    const all = (await getGraph(service)).entities.map((e: any) => e.name);
    await service.deleteEntities(all);
    const empty = await getGraph(service);
    assert(empty.entities.length === 0, 'Xóa hết entity');

    await cleanup();
    console.log('Tất cả test nâng cao đã PASSED!');
}

main().catch(console.error);
advancedTests().catch(e => { console.error('Test nâng cao FAILED:', e); process.exit(1); });
