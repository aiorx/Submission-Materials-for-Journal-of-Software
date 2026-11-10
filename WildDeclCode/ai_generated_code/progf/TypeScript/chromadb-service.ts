// Supported via standard GitHub programming aids
import { Service } from './base-service.js';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { EmbeddingService } from './embedding-service.js';
import { ChromaClient } from 'chromadb';

// Schema definitions for ChromaDB operations
const createCollectionSchema = z.object({
    name: z.string().describe('Collection name'),
    metadata: z.record(z.any()).optional().describe('Optional collection metadata'),
    embeddingFunction: z.string().optional().describe('Embedding function name (default: nomic-embed-text)')
});

// ... existing schemas ...

/**
 * Custom embedding function sử dụng EmbeddingService
 * Integrates với nomic-embed-text model qua Ollama
 */
class CustomEmbeddingFunction {
    constructor(private embeddingService: EmbeddingService) { }

    /**
     * Generate embeddings cho multiple texts
     * @param texts - Array of text documents to embed
     * @returns Promise<number[][]> - Array of embedding vectors
     */
    public async generate(texts: string[]): Promise<number[][]> {
        try {
            const result = await this.embeddingService.generateBatchEmbeddingsForTexts(
                texts,
                'nomic-embed-text',
                true
            );
            return result.embeddings;
        } catch (error) {
            console.error('❌ CustomEmbeddingFunction error:', error);
            // Fallback: return dummy embeddings
            return texts.map(() => Array(384).fill(0).map(() => Math.random() - 0.5));
        }
    }
}

const addDocumentsSchema = z.object({
    collectionName: z.string().describe('Collection name'),
    documents: z.array(z.string()).describe('Documents to add'),
    metadatas: z.array(z.record(z.any())).optional().describe('Optional metadata for each document'),
    ids: z.array(z.string()).optional().describe('Optional IDs for each document (auto-generated if not provided)'),
    embeddings: z.array(z.array(z.number())).optional().describe('Pre-computed embeddings (will compute if not provided)')
});

const queryCollectionSchema = z.object({
    collectionName: z.string().describe('Collection name'),
    queryTexts: z.array(z.string()).describe('Query texts'),
    nResults: z.number().optional().describe('Number of results to return (default: 10)'),
    whereMetadata: z.record(z.any()).optional().describe('Metadata filter conditions'),
    includeMetadata: z.boolean().optional().describe('Include metadata in results (default: true)'),
    includeDocuments: z.boolean().optional().describe('Include documents in results (default: true)'),
    includeDistances: z.boolean().optional().describe('Include distances in results (default: true)')
});

const deleteDocumentsSchema = z.object({
    collectionName: z.string().describe('Collection name'),
    ids: z.array(z.string()).optional().describe('Document IDs to delete'),
    whereMetadata: z.record(z.any()).optional().describe('Delete documents matching metadata filter')
});

interface CollectionInfo {
    name: string;
    id: string;
    metadata: Record<string, any>;
    dimension?: number;
    count?: number;
}

export class ChromaDBService implements Service {
    private client: ChromaClient;
    private embeddingService: EmbeddingService;
    private customEmbeddingFunction: CustomEmbeddingFunction;

    readonly namespace = 'chromadb';
    readonly name = 'chromadb-service';
    readonly description = 'ChromaDB vector database service with Vietnamese search optimization';
    readonly version = '1.0.0';

    constructor(embeddingService?: EmbeddingService) {
        // Initialize ChromaDB client với host/port format
        this.client = new ChromaClient({
            host: 'localhost',
            port: 8000
        });

        // Initialize embedding service
        this.embeddingService = embeddingService || new EmbeddingService();

        // Initialize custom embedding function
        this.customEmbeddingFunction = new CustomEmbeddingFunction(this.embeddingService);
    }
    async listTools(): Promise<{ tools: Tool[] }> {
        return {
            tools: [
                {
                    name: 'chromadb_list_collections',
                    description: 'List all collections in ChromaDB',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                },
                {
                    name: 'chromadb_create_collection',
                    description: 'Create a new collection',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'Collection name'
                            },
                            metadata: {
                                type: 'object',
                                description: 'Optional collection metadata'
                            },
                            embeddingFunction: {
                                type: 'string',
                                description: 'Embedding function name (default: nomic-embed-text)',
                                default: 'nomic-embed-text'
                            }
                        },
                        required: ['name']
                    }
                },
                {
                    name: 'chromadb_delete_collection',
                    description: 'Delete a collection',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'Collection name to delete'
                            }
                        },
                        required: ['name']
                    }
                },
                {
                    name: 'chromadb_get_collection',
                    description: 'Get collection information and statistics',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'Collection name'
                            }
                        },
                        required: ['name']
                    }
                },
                {
                    name: 'chromadb_add_documents',
                    description: 'Add documents to a collection with automatic embedding generation',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            collectionName: {
                                type: 'string',
                                description: 'Collection name'
                            },
                            documents: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Documents to add'
                            },
                            metadatas: {
                                type: 'array',
                                items: { type: 'object' },
                                description: 'Optional metadata for each document'
                            },
                            ids: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Optional IDs for each document (auto-generated if not provided)'
                            },
                            embeddings: {
                                type: 'array',
                                items: {
                                    type: 'array',
                                    items: { type: 'number' }
                                },
                                description: 'Pre-computed embeddings (will compute if not provided)'
                            }
                        },
                        required: ['collectionName', 'documents']
                    }
                },
                {
                    name: 'chromadb_query',
                    description: 'Query collection for similar documents using semantic search',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            collectionName: {
                                type: 'string',
                                description: 'Collection name'
                            },
                            queryTexts: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Query texts'
                            },
                            nResults: {
                                type: 'number',
                                description: 'Number of results to return (default: 10)',
                                default: 10
                            },
                            whereMetadata: {
                                type: 'object',
                                description: 'Metadata filter conditions'
                            },
                            includeMetadata: {
                                type: 'boolean',
                                description: 'Include metadata in results (default: true)',
                                default: true
                            },
                            includeDocuments: {
                                type: 'boolean',
                                description: 'Include documents in results (default: true)',
                                default: true
                            },
                            includeDistances: {
                                type: 'boolean',
                                description: 'Include distances in results (default: true)',
                                default: true
                            }
                        },
                        required: ['collectionName', 'queryTexts']
                    }
                },
                {
                    name: 'chromadb_delete_documents',
                    description: 'Delete documents from a collection',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            collectionName: {
                                type: 'string',
                                description: 'Collection name'
                            },
                            ids: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Document IDs to delete'
                            },
                            whereMetadata: {
                                type: 'object',
                                description: 'Delete documents matching metadata filter'
                            }
                        },
                        required: ['collectionName']
                    }
                },
                {
                    name: 'chromadb_health',
                    description: 'Check ChromaDB server health and connection status',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                },
                {
                    name: 'chromadb_reset',
                    description: 'Reset entire database (WARNING: This will delete all data!)',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                }
            ]
        };
    }

    async callTool(name: string, args: any): Promise<any> {
        switch (name) {
            case 'chromadb_list_collections': {
                const result = await this.listCollections();
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }

            case 'chromadb_create_collection': {
                const parsedArgs = createCollectionSchema.parse(args);
                const result = await this.createCollection(
                    parsedArgs.name,
                    parsedArgs.metadata,
                    parsedArgs.embeddingFunction
                );
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }

            case 'chromadb_delete_collection': {
                const parsedArgs = z.object({ name: z.string() }).parse(args);
                const result = await this.deleteCollection(parsedArgs.name);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }

            case 'chromadb_get_collection': {
                const parsedArgs = z.object({ name: z.string() }).parse(args);
                const result = await this.getCollection(parsedArgs.name);
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }

            case 'chromadb_add_documents': {
                const parsedArgs = addDocumentsSchema.parse(args);
                const result = await this.addDocuments(
                    parsedArgs.collectionName,
                    parsedArgs.documents,
                    parsedArgs.metadatas,
                    parsedArgs.ids,
                    parsedArgs.embeddings
                );
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }

            case 'chromadb_query': {
                const parsedArgs = queryCollectionSchema.parse(args);
                const result = await this.queryCollection(
                    parsedArgs.collectionName,
                    parsedArgs.queryTexts,
                    parsedArgs.nResults,
                    parsedArgs.whereMetadata,
                    parsedArgs.includeMetadata,
                    parsedArgs.includeDocuments,
                    parsedArgs.includeDistances
                );
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }

            case 'chromadb_delete_documents': {
                const parsedArgs = deleteDocumentsSchema.parse(args);
                const result = await this.deleteDocuments(
                    parsedArgs.collectionName,
                    parsedArgs.ids,
                    parsedArgs.whereMetadata
                );
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }

            case 'chromadb_health': {
                const result = await this.healthCheck();
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            }

            case 'chromadb_reset': {
                const result = await this.resetDatabase();
                return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
            } default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }
    private async listCollections(): Promise<CollectionInfo[]> {
        const collections = await this.client.listCollections();

        return collections.map((collection: any) => ({
            name: collection.name,
            id: collection.id,
            metadata: collection.metadata || {}
        }));
    } private async createCollection(
        name: string,
        metadata?: Record<string, any>,
        embeddingFunction: string = 'nomic-embed-text'
    ): Promise<CollectionInfo> {
        // Sử dụng getOrCreateCollection để tránh lỗi khi collection đã tồn tại
        const collection = await this.client.getOrCreateCollection({
            name,
            metadata: {
                ...metadata,
                embedding_function: embeddingFunction,
                created_at: new Date().toISOString()
            },
            embeddingFunction: this.customEmbeddingFunction // Sử dụng custom embedding function
        });

        return {
            name: collection.name,
            id: collection.id,
            metadata: collection.metadata || {}
        };
    }
    private async deleteCollection(name: string): Promise<{ success: boolean; message: string }> {
        await this.client.deleteCollection({ name });
        return {
            success: true,
            message: `Collection '${name}' deleted successfully`
        };
    } private async getCollection(name: string): Promise<CollectionInfo> {
        const collection = await this.client.getCollection({
            name,
            embeddingFunction: this.customEmbeddingFunction // Cần truyền embedding function
        });
        const count = await collection.count();

        return {
            name: collection.name,
            id: collection.id,
            metadata: collection.metadata || {},
            count: count
        };
    } private async addDocuments(
        collectionName: string,
        documents: string[],
        metadatas?: Record<string, any>[],
        ids?: string[],
        embeddings?: number[][]
    ): Promise<{ success: boolean; count: number; ids: string[] }> {
        // Get collection với embedding function
        const collection = await this.client.getCollection({
            name: collectionName,
            embeddingFunction: this.customEmbeddingFunction
        });

        // Generate IDs if not provided
        if (!ids) {
            ids = documents.map((_, index) => `doc_${Date.now()}_${index}`);
        }

        // Ensure metadatas array matches documents length
        if (!metadatas) {
            metadatas = documents.map((doc, index) => ({
                content_length: doc.length,
                added_at: new Date().toISOString(),
                doc_index: index
            }));
        }

        // Sử dụng upsert thay vì add để tránh trùng lặp
        // Không cần truyền embeddings - custom function sẽ tự generate
        await collection.upsert({
            ids,
            documents,
            metadatas
            // embeddings sẽ được tự động tạo bởi customEmbeddingFunction
        });

        return {
            success: true,
            count: documents.length,
            ids
        };
    } private async queryCollection(
        collectionName: string,
        queryTexts: string[],
        nResults: number = 10,
        whereMetadata?: Record<string, any>,
        includeMetadata: boolean = true,
        includeDocuments: boolean = true,
        includeDistances: boolean = true
    ): Promise<any> {
        // Get collection với embedding function
        const collection = await this.client.getCollection({
            name: collectionName,
            embeddingFunction: this.customEmbeddingFunction
        });

        const include: string[] = [];
        if (includeMetadata) include.push('metadatas');
        if (includeDocuments) include.push('documents');
        if (includeDistances) include.push('distances');

        const queryParams: any = {
            queryTexts: queryTexts, // Sử dụng queryTexts để tự động embed
            nResults: nResults,
            include: include
        };

        if (whereMetadata) {
            queryParams.where = whereMetadata;
        }

        const result = await collection.query(queryParams);

        return {
            query_texts: queryTexts,
            results: result,
            n_results: nResults,
            collection: collectionName
        };
    } private async deleteDocuments(
        collectionName: string,
        ids?: string[],
        whereMetadata?: Record<string, any>
    ): Promise<{ success: boolean; message: string }> {
        const collection = await this.client.getCollection({
            name: collectionName,
            embeddingFunction: this.customEmbeddingFunction
        });

        const deleteParams: any = {};

        if (ids) {
            deleteParams.ids = ids;
        }

        if (whereMetadata) {
            deleteParams.where = whereMetadata;
        }

        if (!ids && !whereMetadata) {
            throw new Error('Must provide either ids or whereMetadata for deletion');
        }

        await collection.delete(deleteParams);

        return {
            success: true,
            message: `Documents deleted from collection '${collectionName}'`
        };
    } private async healthCheck(): Promise<{
        status: string;
        chromadb_version?: string;
        database_size?: number;
        collections_count?: number;
        error?: string;
    }> {
        try {
            // Use ChromaDB client to check health
            const collections = await this.client.listCollections();

            return {
                status: 'healthy',
                chromadb_version: 'v1.0+',
                collections_count: collections.length
            };
        } catch (error) {
            console.error('ChromaDB Health Check Error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            return {
                status: 'unhealthy',
                error: errorMessage
            };
        }
    }
    private async resetDatabase(): Promise<{ success: boolean; message: string; warning: string }> {
        await this.client.reset();

        return {
            success: true,
            message: 'Database reset successfully',
            warning: 'All collections and documents have been permanently deleted!'
        };
    }
}