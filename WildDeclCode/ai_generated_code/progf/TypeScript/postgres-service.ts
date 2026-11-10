// Assisted using common GitHub development utilities

/**
 * PostgreSQL Service Implementation - Provides database connection and SQL query tools
 * Supports basic SQL operations with PostgreSQL server
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Service } from './base-service.js';
import { Client } from 'pg';

/**
 * PostgreSQL Service Implementation - Cung cấp các công cụ kết nối và truy vấn PostgreSQL
 */
export class PostgreSQLService implements Service {
    readonly namespace = 'postgres';
    readonly name = 'PostgreSQL Service';
    readonly version = '1.0.0';
    readonly description = 'Provides PostgreSQL database connection and SQL query tools';

    private config = {
        host: 'localhost',
        port: 5432,
        database: 'postgres',
        user: 'odoo',
        password: 'odoo#2025',
    };

    /**
     * Tạo connection mới cho mỗi operation, cho phép chọn database động
     * @param database Tên database (tùy chọn)
     * @returns Promise<Client>
     */
    private async createConnection(database?: string): Promise<Client> {
        const config = { ...this.config, database: database ?? this.config.database };
        const client = new Client(config);
        try {
            await client.connect();
            return client;
        } catch (error) {
            throw new Error(`Failed to connect to PostgreSQL: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    /**
     * Liệt kê các tools có sẵn trong PostgreSQL Service
     * @returns Promise với danh sách tools
     */
    async listTools(): Promise<{ tools: Tool[] }> {
        return {
            tools: [
                {
                    name: 'list_databases',
                    description: 'List all databases in PostgreSQL server',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
                {
                    name: 'list_tables',
                    description: 'List all tables in a specific database',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            database: {
                                type: 'string',
                                description: 'Database name (optional, uses current connection if not specified)',
                            },
                        },
                    },
                },
                {
                    name: 'execute_query',
                    description: 'Execute a SQL query',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            query: {
                                type: 'string',
                                description: 'SQL query to execute',
                            },
                            database: {
                                type: 'string',
                                description: 'Database name (optional, uses current connection if not specified)',
                            },
                        },
                        required: ['query'],
                    },
                },
                {
                    name: 'get_table_schema',
                    description: 'Get schema information for a specific table',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            table_name: {
                                type: 'string',
                                description: 'Name of the table',
                            },
                            database: {
                                type: 'string',
                                description: 'Database name (optional, uses current connection if not specified)',
                            },
                        },
                        required: ['table_name'],
                    },
                },
                {
                    name: 'get_server_info',
                    description: 'Get PostgreSQL server information',
                    inputSchema: {
                        type: 'object',
                        properties: {},
                    },
                },
            ] satisfies Tool[],
        };
    }    /**
     * Gọi một tool cụ thể trong PostgreSQL Service
     * @param name Tên của tool
     * @param args Tham số cho tool
     * @returns Kết quả truy vấn
     */
    async callTool(name: string, args: any) {
        switch (name) {
            case 'list_databases':
                return this.listDatabases();
            case 'list_tables':
                return this.listTables(args);
            case 'execute_query':
                return this.executeQuery(args);
            case 'get_table_schema':
                return this.getTableSchema(args);
            case 'get_server_info':
                return this.getServerInfo();
            default:
                throw new Error(`Unknown tool: ${name}`);
        }
    }    /**
     * Liệt kê tất cả databases trong PostgreSQL server
     * @returns Danh sách databases
     */
    private async listDatabases() {
        const client = await this.createConnection();
        try {
            const result = await client.query(`
        SELECT datname as database_name, 
               pg_size_pretty(pg_database_size(datname)) as size,
               datallowconn as allow_connections
        FROM pg_database 
        WHERE datistemplate = false
        ORDER BY datname;
      `);

            const databases = result.rows;
            const count = databases.length;

            return {
                content: [{
                    type: 'text',
                    text: `Found ${count} database(s) in PostgreSQL server:\n\n${databases.map((db, index) =>
                        `${index + 1}. ${db.database_name} (Size: ${db.size}, Connections: ${db.allow_connections ? 'Allowed' : 'Disabled'})`
                    ).join('\n')}`
                }]
            };
        } catch (error) {
            throw new Error(`Failed to list databases: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await client.end();
        }
    }

    /**
     * Liệt kê tất cả tables trong database
     * @param args Object chứa database name (optional)
     * @returns Danh sách tables
     */
    private async listTables(args: any) {
        const dbName = args?.database;
        const client = await this.createConnection(dbName);
        try {
            const result = await client.query(`
        SELECT schemaname, tablename, tableowner 
        FROM pg_tables 
        WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
        ORDER BY schemaname, tablename;
      `);

            const tables = result.rows;
            const count = tables.length;

            return {
                content: [{
                    type: 'text',
                    text: `Found ${count} table(s):\n\n${tables.map((table, index) =>
                        `${index + 1}. ${table.schemaname}.${table.tablename} (Owner: ${table.tableowner})`
                    ).join('\n')}`
                }]
            };
        } catch (error) {
            throw new Error(`Failed to list tables: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await client.end();
        }
    }    /**
     * Thực thi SQL query
     * @param args Object chứa query và database (optional)
     * @returns Kết quả query
     */
    private async executeQuery(args: any) {
        const { query, database } = args;

        if (!query) {
            throw new Error('Query is required');
        }

        const client = await this.createConnection(database);
        try {
            const result = await client.query(query);

            if (result.command === 'SELECT') {
                return {
                    content: [{
                        type: 'text',
                        text: `Query executed successfully!\n\nRows returned: ${result.rowCount}\n\nResults:\n${JSON.stringify(result.rows, null, 2)}`
                    }]
                };
            } else {
                return {
                    content: [{
                        type: 'text',
                        text: `Query executed successfully!\n\nCommand: ${result.command}\nRows affected: ${result.rowCount}`
                    }]
                };
            }
        } catch (error) {
            throw new Error(`Failed to execute query: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await client.end();
        }
    }

    /**
     * Lấy schema information của table
     * @param args Object chứa table_name và database (optional)
     * @returns Schema information
     */
    private async getTableSchema(args: any) {
        const { table_name, database } = args;

        if (!table_name) {
            throw new Error('Table name is required');
        }

        const client = await this.createConnection(database);
        try {
            const result = await client.query(`
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [table_name]);

            const columns = result.rows;

            if (columns.length === 0) {
                return {
                    content: [{
                        type: 'text',
                        text: `Table '${table_name}' not found or has no columns.`
                    }]
                };
            }

            return {
                content: [{
                    type: 'text',
                    text: `Schema for table '${table_name}':\n\n${columns.map((col, index) =>
                        `${index + 1}. ${col.column_name} (${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}) - ${col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL'}${col.column_default ? ` DEFAULT ${col.column_default}` : ''}`
                    ).join('\n')}`
                }]
            };
        } catch (error) {
            throw new Error(`Failed to get table schema: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await client.end();
        }
    }

    /**
     * Lấy thông tin PostgreSQL server
     * @returns Server information
     */
    private async getServerInfo() {
        const client = await this.createConnection();
        try {
            const versionResult = await client.query('SELECT version();');
            const settingsResult = await client.query(`
        SELECT name, setting, unit, short_desc
        FROM pg_settings 
        WHERE name IN ('server_version', 'port', 'max_connections', 'shared_buffers', 'data_directory')
        ORDER BY name;
      `);

            return {
                content: [{
                    type: 'text',
                    text: `PostgreSQL Server Information:\n\n${versionResult.rows[0].version}\n\nKey Settings:\n${settingsResult.rows.map(setting =>
                        `- ${setting.name}: ${setting.setting}${setting.unit || ''} (${setting.short_desc})`
                    ).join('\n')}`
                }]
            };
        } catch (error) {
            throw new Error(`Failed to get server info: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            await client.end();
        }
    }
}
