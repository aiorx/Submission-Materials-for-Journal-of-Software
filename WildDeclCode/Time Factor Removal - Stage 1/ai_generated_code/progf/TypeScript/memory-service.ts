// Assisted using common GitHub development utilities

/**
 * @file memory-service.ts
 * @description Knowledge graph memory service for agents/services. Lưu trữ entities, relations, observations dạng graph vào file (mỗi dòng một object JSON).
 * Có thể mở rộng lưu vào DB hoặc backend khác nếu cần.
 * @author Copilot
 */

var Tool = require('@modelcontextprotocol/sdk/types.js').Tool;
var Service = require('./base-service.js').Service;
var fs = require('fs').promises;
var _import = require('path');
var fileURLToPath = require('url').fileURLToPath;
var z = require('zod').z;

// Optimized import for __dirname
var __dirname = dirname(fileURLToPath(import.meta.url));
var defaultMemoryPath = path.join(__dirname, '../memory.json');

var MEMORY_FILE_PATH = process.env.MEMORY_FILE_PATH
    ? path.isAbsolute(process.env.MEMORY_FILE_PATH)
        ? process.env.MEMORY_FILE_PATH
        : path.join(__dirname, process.env.MEMORY_FILE_PATH)
    : defaultMemoryPath;

// Zod schemas for validation
var EntitySchema = z.object({
    name: z.string().min(1, 'Entity name cannot be empty'),
    entityType: z.string().min(1, 'Entity type cannot be empty'),
    observations: z.array(z.string()).default([]),
});

var RelationSchema = z.object({
    from: z.string().min(1, 'From entity cannot be empty'),
    to: z.string().min(1, 'To entity cannot be empty'),
    relationType: z.string().min(1, 'Relation type cannot be empty'),
});

export interface Entity extends z.infer<typeof EntitySchema> { }
export interface Relation extends z.infer<typeof RelationSchema> { }
export interface KnowledgeGraph {
    entities: Entity[];
    relations: Relation[];
}

/**
 * @class MemoryService
 * @description Service quản lý knowledge graph cho agent/service
 */
class MemoryService implements Service {
    readonly namespace = 'memory';
    readonly name = 'Memory Service';
    readonly version = '1.0.0';
    readonly description = 'Knowledge graph memory storage and retrieval';

    // In-memory cache for performance
    #graphCache: KnowledgeGraph | null = null;
    #lastModified = 0;

    /**
     * Đọc toàn bộ knowledge graph từ file, dùng cache nếu file không đổi
     * @returns {Promise<KnowledgeGraph>} KnowledgeGraph object
     */
    private async loadGraph(): Promise<KnowledgeGraph> {
        try {
            var stats = await fs.stat(MEMORY_FILE_PATH);
            if (this.#graphCache && stats.mtimeMs <= this.#lastModified) {
                return this.#graphCache;
            }
            var data = await fs.readFile(MEMORY_FILE_PATH, 'utf-8');
            var lines = data.split('\n').filter(function line { return line.trim() !== ''; });
            var graph: KnowledgeGraph = { entities: [], relations: [] };
            for (var line of lines) {
                try {
                    var item = JSON.parse(line);
                    if (item.type === 'entity') {
                        graph.entities.push(EntitySchema.parse(item));
                    } else if (item.type === 'relation') {
                        graph.relations.push(RelationSchema.parse(item));
                    }
                } catch (parseError) {
                    console.error('Failed to parse graph item:', line, parseError);
                }
            }
            this.#graphCache = graph;
            this.#lastModified = stats.mtimeMs;
            return graph;
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                return { entities: [], relations: [] };
            }
            console.error('Failed to load knowledge graph:', error);
            throw new Error("Failed to load knowledge graph: " + (error.message) + "");
        }
    }

    /**
     * Ghi knowledge graph ra file và cập nhật cache
     * @param {KnowledgeGraph} graph - KnowledgeGraph object
     * @returns {Promise<void>}
     */
    private async saveGraph(graph: KnowledgeGraph): Promise<void> {
        try {
            var lines = [
                ...graph.entities.map(function e { return JSON.stringify({ type: 'entity', ...e }); }),
                ...graph.relations.map(function r { return JSON.stringify({ type: 'relation', ...r }); }),
            ];
            await fs.writeFile(MEMORY_FILE_PATH, lines.join('\n'));
            this.#graphCache = graph;
            this.#lastModified = Date.now();
        } catch (error: any) {
            console.error('Failed to save knowledge graph:', error);
            throw new Error("Failed to save knowledge graph: " + (error.message) + "");
        }
    }

    async listTools(): Promise<{ tools: Tool[] }> {
        return {
            tools: [
                {
                    name: "create_entities",
                    description: "Create multiple new entities in the knowledge graph",
                    inputSchema: {
                        type: "object",
                        properties: {
                            entities: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string", description: "The name of the entity" },
                                        entityType: { type: "string", description: "The type of the entity" },
                                        observations: {
                                            type: "array",
                                            items: { type: "string" },
                                            description: "An array of observation contents associated with the entity"
                                        },
                                    },
                                    required: ["name", "entityType"],
                                },
                            },
                        },
                        required: ["entities"],
                    },
                },
                {
                    name: "create_relations",
                    description: "Create multiple new relations between entities in the knowledge graph",
                    inputSchema: {
                        type: "object",
                        properties: {
                            relations: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        from: { type: "string", description: "The name of the entity where the relation starts" },
                                        to: { type: "string", description: "The name of the entity where the relation ends" },
                                        relationType: { type: "string", description: "The type of the relation" },
                                    },
                                    required: ["from", "to", "relationType"],
                                },
                            },
                        },
                        required: ["relations"],
                    },
                },
                {
                    name: "add_observations",
                    description: "Add new observations to existing entities in the knowledge graph",
                    inputSchema: {
                        type: "object",
                        properties: {
                            observations: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        entityName: { type: "string", description: "The name of the entity to add the observations to" },
                                        contents: {
                                            type: "array",
                                            items: { type: "string" },
                                            description: "An array of observation contents to add"
                                        },
                                    },
                                    required: ["entityName", "contents"],
                                },
                            },
                        },
                        required: ["observations"],
                    },
                },
                {
                    name: "delete_entities",
                    description: "Delete multiple entities and their associated relations from the knowledge graph",
                    inputSchema: {
                        type: "object",
                        properties: {
                            entityNames: {
                                type: "array",
                                items: { type: "string" },
                                description: "An array of entity names to delete"
                            },
                        },
                        required: ["entityNames"],
                    },
                },
                {
                    name: "delete_observations",
                    description: "Delete specific observations from entities in the knowledge graph",
                    inputSchema: {
                        type: "object",
                        properties: {
                            deletions: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        entityName: { type: "string", description: "The name of the entity containing the observations" },
                                        observations: {
                                            type: "array",
                                            items: { type: "string" },
                                            description: "An array of observations to delete"
                                        },
                                    },
                                    required: ["entityName", "observations"],
                                },
                            },
                        },
                        required: ["deletions"],
                    },
                },
                {
                    name: "delete_relations",
                    description: "Delete multiple relations from the knowledge graph",
                    inputSchema: {
                        type: "object",
                        properties: {
                            relations: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        from: { type: "string", description: "The name of the entity where the relation starts" },
                                        to: { type: "string", description: "The name of the entity where the relation ends" },
                                        relationType: { type: "string", description: "The type of the relation" },
                                    },
                                    required: ["from", "to", "relationType"],
                                },
                            },
                        },
                        required: ["relations"],
                    },
                },
                {
                    name: "read_graph",
                    description: "Read the entire knowledge graph",
                    inputSchema: {
                        type: "object",
                        properties: {},
                    },
                },
                {
                    name: "search_nodes",
                    description: "Search for nodes in the knowledge graph based on a query",
                    inputSchema: {
                        type: "object",
                        properties: {
                            query: { type: "string", description: "The search query to match against entity names, types, and observation content" },
                        },
                        required: ["query"],
                    },
                },
                {
                    name: "open_nodes",
                    description: "Open specific nodes in the knowledge graph by their names",
                    inputSchema: {
                        type: "object",
                        properties: {
                            names: {
                                type: "array",
                                items: { type: "string" },
                                description: "An array of entity names to retrieve",
                            },
                        },
                        required: ["names"],
                    },
                },
            ],
        };
    }

    /**
     * Gọi tool theo tên
     * @param {string} name - Tên tool
     * @param {any} args - Tham số truyền vào tool
     * @returns {Promise<any>} Kết quả thực thi tool
     */
    async callTool(name: string, args: any): Promise<any> {
        try {
            switch (name) {
                case 'create_entities':
                    return this.createEntities(args.entities);
                case 'create_relations':
                    return this.createRelations(args.relations);
                case 'add_observations':
                    return this.addObservations(args.observations);
                case 'delete_entities':
                    return this.deleteEntities(args.entityNames);
                case 'delete_observations':
                    return this.deleteObservations(args.deletions);
                case 'delete_relations':
                    return this.deleteRelations(args.relations);
                case 'read_graph':
                    return this.readGraph();
                case 'search_nodes':
                    return this.searchNodes(args.query);
                case 'open_nodes':
                    return this.openNodes(args.names);
                default:
                    throw new Error("Unknown tool: " + (name) + "");
            }
        } catch (error: any) {
            console.error("Error in " + (name) + ":", error);
            return {
                content: [{
                    type: 'text',
                    text: "❌ Error: " + (error.message || 'Operation failed') + ""
                }]
            };
        }
    }

    /**
     * Tạo mới entities với validation và duplicate check
     * @param {any[]} entities - Danh sách entity
     * @returns {Promise<any>} Kết quả tạo entity
     */
    private async createEntities(entities: any[]): Promise<any> {
        var parsedEntities = z.array(EntitySchema).parse(entities);
        var graph = await this.loadGraph();
        var existingNames = new Set(graph.entities.map(function e { return e.name; }));
        var newEntities: Entity[] = [];
        var duplicates: string[] = [];
        for (var entity of parsedEntities) {
            if (existingNames.has(entity.name)) {
                duplicates.push(entity.name);
                continue;
            }
            newEntities.push(entity);
            existingNames.add(entity.name);
        }
        if (newEntities.length > 0) {
            graph.entities.push(...newEntities);
            await this.saveGraph(graph);
        }
        var result = "Created " + (newEntities.length) + " entities";
        if (duplicates.length > 0) {
            result += ". Skipped duplicates: " + (duplicates.join(', ')) + "";
        }
        return {
            content: [{ type: 'text', text: result }]
        };
    }

    /**
     * Tạo mới relations với validation, duplicate check, và kiểm tra entity tồn tại
     * @param {any[]} relations - Danh sách relation
     * @returns {Promise<any>} Kết quả tạo relation
     */
    private async createRelations(relations: any[]): Promise<any> {
        var parsedRelations = z.array(RelationSchema).parse(relations);
        var graph = await this.loadGraph();
        var entityNames = new Set(graph.entities.map(function e { return e.name; }));
        var newRelations: Relation[] = [];
        var invalid: string[] = [];
        var duplicates: string[] = [];
        for (var relation of parsedRelations) {
            if (!entityNames.has(relation.from)) {
                invalid.push('Source entity "' + (relation.from) + '" not found');
                continue;
            }
            if (!entityNames.has(relation.to)) {
                invalid.push('Target entity "' + (relation.to) + '" not found');
                continue;
            }
            var isDuplicate = graph.relations.some(function r { return r.from === relation.from &&
                r.to === relation.to &&
                r.relationType === relation.relationType; });
            if (isDuplicate) {
                duplicates.push("" + (relation.from) + "->" + (relation.to) + "(" + (relation.relationType) + ")");
                continue;
            }
            newRelations.push(relation);
        }
        if (newRelations.length > 0) {
            graph.relations.push(...newRelations);
            await this.saveGraph(graph);
        }
        var result = "Created " + (newRelations.length) + " relations";
        if (invalid.length > 0) {
            result += ". Invalid relations: " + (invalid.join('; ')) + "";
        }
        if (duplicates.length > 0) {
            result += ". Skipped duplicates: " + (duplicates.join(', ')) + "";
        }
        return {
            content: [{ type: 'text', text: result }]
        };
    }

    /**
     * Thêm observations cho entity với validation
     * @param {{ entityName: string; contents: string[] }[]} observations
     * @returns {Promise<any>} Kết quả thêm observation
     */
    private async addObservations(observations: { entityName: string; contents: string[] }[]): Promise<any> {
        if (!Array.isArray(observations)) throw new Error('Observations must be an array');
        var graph = await this.loadGraph();
        var entityMap = new Map(graph.entities.map(function e { return [e.name, e]; }));
        var results = observations.map(function o {
            var entity = entityMap.get(o.entityName);
            if (!entity) return { entityName: o.entityName, added: 0, error: 'Entity not found' };
            var newObs = o.contents.filter(content => !entity.observations.includes(content));
            entity.observations.push(...newObs);
            return { entityName: o.entityName, added: newObs.length };
        });
        await this.saveGraph(graph);
        return {
            content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
        };
    }

    /**
     * Xóa entities và các relations liên quan
     * @param {string[]} entityNames - Danh sách tên entity cần xóa
     * @returns {Promise<any>} Kết quả xóa entity
     */
    private async deleteEntities(entityNames: string[]): Promise<any> {
        if (!Array.isArray(entityNames)) throw new Error('entityNames must be an array');
        var graph = await this.loadGraph();
        var initialCount = graph.entities.length;
        graph.entities = graph.entities.filter(function e { return !entityNames.includes(e.name); });
        graph.relations = graph.relations.filter(function r { return !entityNames.includes(r.from) && !entityNames.includes(r.to); });
        await this.saveGraph(graph);
        return {
            content: [{ type: 'text', text: "Deleted " + (initialCount - graph.entities.length) + " entities" }]
        };
    }

    /**
     * Xóa observations khỏi entity
     * @param {{ entityName: string; observations: string[] }[]} deletions
     * @returns {Promise<any>} Kết quả xóa observation
     */
    private async deleteObservations(deletions: { entityName: string; observations: string[] }[]): Promise<any> {
        if (!Array.isArray(deletions)) throw new Error('deletions must be an array');
        var graph = await this.loadGraph();
        var entityMap = new Map(graph.entities.map(function e { return [e.name, e]; }));
        var results = deletions.map(function d {
            var entity = entityMap.get(d.entityName);
            if (!entity) return { entityName: d.entityName, deleted: 0, error: 'Entity not found' };
            var initialCount = entity.observations.length;
            entity.observations = entity.observations.filter(o => !d.observations.includes(o));
            return { entityName: d.entityName, deleted: initialCount - entity.observations.length };
        });
        await this.saveGraph(graph);
        return {
            content: [{ type: 'text', text: JSON.stringify(results, null, 2) }]
        };
    }

    /**
     * Xóa relations
     * @param {Relation[]} relations - Danh sách relation cần xóa
     * @returns {Promise<any>} Kết quả xóa relation
     */
    private async deleteRelations(relations: Relation[]): Promise<any> {
        if (!Array.isArray(relations)) throw new Error('relations must be an array');
        var graph = await this.loadGraph();
        var initialCount = graph.relations.length;
        graph.relations = graph.relations.filter(function r { return !relations.some(d =>
                d.from === r.from &&
                d.to === r.to &&
                d.relationType === r.relationType
            ); });
        await this.saveGraph(graph);
        return {
            content: [{ type: 'text', text: "Deleted " + (initialCount - graph.relations.length) + " relations" }]
        };
    }

    /**
     * Đọc toàn bộ graph
     * @returns {Promise<any>} KnowledgeGraph object
     */
    private async readGraph(): Promise<any> {
        var graph = await this.loadGraph();
        return {
            content: [{ type: 'text', text: JSON.stringify(graph, null, 2) }]
        };
    }

    /**
     * Tìm kiếm node theo query, kiểm tra input tối thiểu 2 ký tự
     * @param {string} query - Từ khóa tìm kiếm
     * @returns {Promise<any>} Kết quả tìm kiếm
     */
    private async searchNodes(query: string): Promise<any> {
        if (!query || query.trim().length < 2) {
            throw new Error('Search query must be at least 2 characters');
        }
        var graph = await this.loadGraph();
        var lowerQuery = query.toLowerCase();
        var filteredEntities = graph.entities.filter(function e { return e.name.toLowerCase().includes(lowerQuery) ||
            e.entityType.toLowerCase().includes(lowerQuery) ||
            e.observations.some(o => o.toLowerCase().includes(lowerQuery)); });
        var entityNames = new Set(filteredEntities.map(function e { return e.name; }));
        var filteredRelations = graph.relations.filter(function r { return entityNames.has(r.from) && entityNames.has(r.to); });
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({ entities: filteredEntities, relations: filteredRelations }, null, 2)
            }]
        };
    }

    /**
     * Mở node theo tên
     * @param {string[]} names - Danh sách tên entity
     * @returns {Promise<any>} Kết quả mở node
     */
    private async openNodes(names: string[]): Promise<any> {
        if (!Array.isArray(names)) throw new Error('names must be an array');
        var graph = await this.loadGraph();
        var filteredEntities = graph.entities.filter(function e { return names.includes(e.name); });
        var entityNames = new Set(filteredEntities.map(function e { return e.name; }));
        var filteredRelations = graph.relations.filter(function r { return entityNames.has(r.from) && entityNames.has(r.to); });
        return {
            content: [{
                type: 'text',
                text: JSON.stringify({ entities: filteredEntities, relations: filteredRelations }, null, 2)
            }]
        };
    }

    /**
     * Trả về index entity dạng Map cho truy vấn hiệu năng cao
     * @returns {Promise<Map<string, Entity>>}
     */
    private async getEntityIndex(): Promise<Map<string, Entity>> {
        var graph = await this.loadGraph();
        return new Map(graph.entities.map(function entity { return [entity.name, entity]; }));
    }
}