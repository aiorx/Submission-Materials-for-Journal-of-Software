#!/usr/bin/env node
// Assisted using common GitHub development utilities

/**
 * MCP Multi-Service Server - Framework for hosting multiple AI assistant services
 * Supports both stdio and HTTP transports with service discovery
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { URL } from 'url';
import { Service, TimeService, CalculatorService, PostgreSQLService, EmbeddingService, ChromaDBService, DockerService, AiChunkService, SequentialThinkingService, MemoryService } from './services/index.js';

/**
 * Service Registry - Manages multiple services
 */
class ServiceRegistry {
  private services: Map<string, Service> = new Map();

  register(service: Service) {
    if (this.services.has(service.namespace)) {
      throw new Error(`Service namespace '${service.namespace}' already registered`);
    }
    this.services.set(service.namespace, service);
  }

  get(namespace: string): Service | undefined {
    return this.services.get(namespace);
  }

  getAll(): Service[] {
    return Array.from(this.services.values());
  }

  async listAllTools(): Promise<{ tools: Tool[] }> {
    const tools: Tool[] = [];
    for (const service of this.services.values()) {
      const { tools: serviceTools } = await service.listTools();
      tools.push(...serviceTools.map(tool => ({
        ...tool,
        name: `${service.namespace}.${tool.name}`
      })));
    }
    return { tools };
  }

  async callTool(fullName: string, args: any): Promise<any> {
    const [namespace, toolName] = fullName.split('.', 2);
    if (!namespace || !toolName) {
      throw new Error(`Invalid tool name format: ${fullName}. Expected 'namespace.toolName'`);
    }

    const service = this.services.get(namespace);
    if (!service) {
      throw new Error(`Service not found: ${namespace}`);
    }

    return service.callTool(toolName, args);
  }
}

/**
 * Multi-Service Server Core
 */
class MultiServiceServer {
  private server: Server;
  private serviceRegistry: ServiceRegistry;

  constructor() {
    this.server = new Server(
      {
        name: 'multi-service-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.serviceRegistry = new ServiceRegistry();
    this.setupToolHandlers();
  }

  /**
   * Register a new service
   */
  registerService(service: Service) {
    this.serviceRegistry.register(service);
    console.log(`Registered service: ${service.name} (${service.namespace})`);
  }

  /**
   * Setup tool handlers
   */
  private setupToolHandlers(): void {
    // List available tools across all services
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return this.serviceRegistry.listAllTools();
    });

    // Handle tool calls with namespace prefix
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      return this.serviceRegistry.callTool(name, args);
    });
  }

  /**
   * Start in stdio mode
   */
  async startStdio(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Multi-service server running on stdio');
  }

  /**
   * Start in HTTP mode
   */
  async startHttp(port: number = 3000): Promise<void> {
    const httpServer = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const url = new URL(req.url || '/', `http://${req.headers.host}`);
        const pathname = url.pathname;

        // Health check
        if (pathname === '/health') {
          res.writeHead(200);
          res.end('OK');
          return;
        }

        // Service discovery
        if (pathname === '/services') {
          const services = this.serviceRegistry.getAll().map(s => ({
            namespace: s.namespace,
            name: s.name,
            version: s.version,
            description: s.description
          }));

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(services));
          return;
        }

        // MCP endpoint - JSON-RPC 2.0 over HTTP with SSE support
        if (pathname === '/mcp') {
          if (req.method === 'GET') {
            // SSE endpoint for MCP clients
            res.writeHead(200, {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            });

            // Send initial connection established event
            res.write('data: {"jsonrpc":"2.0","method":"initialized","params":{}}\n\n');

            // Keep connection alive with periodic ping
            const pingInterval = setInterval(() => {
              res.write('data: {"jsonrpc":"2.0","method":"ping","params":{}}\n\n');
            }, 30000);

            // Handle client disconnect
            req.on('close', () => {
              clearInterval(pingInterval);
            });

            return;
          }

          if (req.method === 'POST') {
            // Handle JSON-RPC 2.0 requests
            let body = '';
            for await (const chunk of req) {
              body += chunk;
            }

            try {
              const rpcRequest = JSON.parse(body);
              const rpcResponse = await this.handleMcpJsonRpc(rpcRequest);

              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(JSON.stringify(rpcResponse));
            } catch (error) {
              const errorResponse = {
                jsonrpc: '2.0',
                error: {
                  code: -32700,
                  message: 'Parse error',
                  data: error instanceof Error ? error.message : 'Unknown error'
                },
                id: null
              };
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(errorResponse));
            }
            return;
          }

          if (req.method === 'OPTIONS') {
            res.writeHead(204, {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Headers': 'Content-Type, Mcp-Session-Id',
              'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
            });
            res.end();
            return;
          }

          res.writeHead(405);
          res.end('Method Not Allowed');
          return;
        }

        if (req.method !== 'POST') {
          res.writeHead(405);
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        for await (const chunk of req) {
          body += chunk;
        }

        const request = JSON.parse(body);
        let response: any;

        if (pathname === '/list-tools') {
          response = await this.serviceRegistry.listAllTools();
        }
        else if (pathname === '/call-tool') {
          if (!request.name || !request.arguments) {
            throw new Error('Invalid request format');
          }
          response = await this.serviceRegistry.callTool(request.name, request.arguments);
        }
        else if (pathname.startsWith('/service/')) {
          const [, , namespace, action] = pathname.split('/');
          const service = this.serviceRegistry.get(namespace);

          if (!service) {
            res.writeHead(404);
            res.end('Service not found');
            return;
          }

          if (action === 'list-tools') {
            response = await service.listTools();
          }
          else if (action === 'call-tool') {
            if (!request.name || !request.arguments) {
              throw new Error('Invalid request format');
            }
            response = await service.callTool(request.name, request.arguments);
          }
          else {
            res.writeHead(404);
            res.end('Not Found');
            return;
          }
        }
        else {
          res.writeHead(404);
          res.end('Not Found');
          return;
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Invalid request',
          message: errorMessage
        }));
      }
    });

    httpServer.listen(port, () => {
      console.error(`Multi-service server running on http://localhost:${port}`);
      console.error('Endpoints:');
      console.error('  GET  /health            - Health check');
      console.error('  GET  /services          - List registered services');
      console.error('  POST /list-tools        - List all tools across services');
      console.error('  POST /call-tool         - Execute a namespaced tool (e.g., "time.get_current_time")');
      console.error('  POST /service/:ns/list-tools - List tools for a specific service');
      console.error('  POST /service/:ns/call-tool  - Execute a tool in a specific service');
      console.error('  GET  /mcp               - MCP endpoint for VSCode integration');
    });
  }

  /**
   * Handle MCP JSON-RPC 2.0 requests
   * @param rpcRequest JSON-RPC 2.0 request object
   */
  async handleMcpJsonRpc(rpcRequest: any): Promise<any> {
    // Basic JSON-RPC 2.0 validation
    if (!rpcRequest || rpcRequest.jsonrpc !== '2.0' || typeof rpcRequest.method !== 'string') {
      return {
        jsonrpc: '2.0',
        error: { code: -32600, message: 'Invalid Request' },
        id: rpcRequest?.id ?? null
      };
    }
    const { method, params, id } = rpcRequest;
    try {
      if (method === 'initialize') {
        return await this.handleMcpInitialize(params, id);
      }
      if (method === 'tools.list' || method === 'tools/list') {
        const tools = await this.serviceRegistry.listAllTools();
        return { jsonrpc: '2.0', result: tools, id };
      }
      if (method === 'tools.call' || method === 'tools/call') {
        if (!params?.name || params.arguments === undefined) {
          return {
            jsonrpc: '2.0',
            error: { code: -32602, message: 'Invalid params' },
            id
          };
        }
        try {
          const result = await this.serviceRegistry.callTool(params.name, params.arguments);
          return { jsonrpc: '2.0', result, id };
        } catch (err: any) {
          return {
            jsonrpc: '2.0',
            error: { code: -32603, message: err?.message || 'Internal error' },
            id
          };
        }
      }
      if (method === 'ping') {
        return { jsonrpc: '2.0', result: 'pong', id };
      }
      // Unknown method
      return {
        jsonrpc: '2.0',
        error: { code: -32601, message: 'Method not found' },
        id
      };
    } catch (error: any) {
      return {
        jsonrpc: '2.0',
        error: { code: -32603, message: error?.message || 'Internal error' },
        id
      };
    }
  }

  /**
   * Handle MCP initialize handshake
   * @param params Params from initialize request
   * @param id JSON-RPC request id
   */
  async handleMcpInitialize(params: any, id: any): Promise<any> {
    // You can extend this with more protocol negotiation if needed
    return {
      jsonrpc: '2.0',
      result: {
        name: 'multi-service-server',
        version: '1.0.0',
        description: 'MCP Multi-Service Server for VSCode integration',
        capabilities: {
          tools: {},
          logging: true,
          resources: true,
          prompts: true
        },
        endpoints: [
          '/health',
          '/services',
          '/list-tools',
          '/call-tool',
          '/service/:ns/list-tools',
          '/service/:ns/call-tool',
          '/mcp',
          '/initialize'
        ]
      },
      id
    };
  }
}

// Parse command-line arguments
const args = process.argv.slice(2);
const httpMode = args.includes('--http') || (args.includes('--transport') && args[args.indexOf('--transport') + 1] === 'http');
const portArgIndex = args.indexOf('--port');
const port = portArgIndex !== -1 ? parseInt(args[portArgIndex + 1]) : 3000;

// Create and configure server
const server = new MultiServiceServer();

// Register services
const embeddingService = new EmbeddingService();
server.registerService(new TimeService());
server.registerService(new CalculatorService());
server.registerService(new PostgreSQLService());
server.registerService(embeddingService);
server.registerService(new ChromaDBService(embeddingService));
server.registerService(new DockerService());
server.registerService(new AiChunkService());
server.registerService(new SequentialThinkingService());
server.registerService(new MemoryService());
// Add more services here...

// Start server
if (httpMode) {
  server.startHttp(port).catch((error) => {
    console.error('Failed to start HTTP server:', error);
    process.exit(1);
  });
} else {
  server.startStdio().catch((error) => {
    console.error('Failed to start stdio server:', error);
    process.exit(1);
  });
}