// Aided with basic GitHub coding tools

/**
 * Docker Service - Manages Docker containers and Docker Compose operations
 * Quản lý Docker containers và các thao tác Docker Compose
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Service } from './base-service.js';
import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

/**
 * Docker Container Status
 * Trạng thái của Docker container
 */
export interface ContainerStatus {
    name: string;
    status: 'running' | 'stopped' | 'paused' | 'restarting' | 'removing' | 'created' | 'exited' | 'dead';
    health: 'healthy' | 'unhealthy' | 'starting' | 'none';
    uptime: string;
    ports: string[];
    image: string;
}

/**
 * Docker Compose Service Definition
 * Định nghĩa service trong Docker Compose
 */
export interface ComposeService {
    name: string;
    image: string;
    ports: string[];
    volumes: string[];
    environment: Record<string, string>;
    healthCheck?: {
        test: string[];
        interval: string;
        timeout: string;
        retries: number;
    };
}

/**
 * Docker Service Implementation
 * Implements Docker container management operations
 */
export class DockerService implements Service {
    readonly namespace = 'docker';
    readonly name = 'Docker Management Service';
    readonly version = '1.0.0';
    readonly description = 'Manages Docker containers, images, and Docker Compose operations';

    private composePath: string;
    private projectName: string;

    constructor(composePath?: string, projectName?: string) {
        this.composePath = composePath || path.join(process.cwd(), 'docker-compose.yml');
        this.projectName = projectName || 'mcp';
    }

    /**
     * List all available Docker management tools
     * Liệt kê tất cả các công cụ quản lý Docker
     */
    async listTools(): Promise<{ tools: Tool[] }> {
        return {
            tools: [
                {
                    name: 'docker_ps',
                    description: 'List all Docker containers with their status',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            all: {
                                type: 'boolean',
                                description: 'Show all containers (default: false - only running)',
                                default: false
                            }
                        }
                    }
                },
                {
                    name: 'docker_compose_up',
                    description: 'Start Docker Compose services',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            services: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Specific services to start (optional - all services if not specified)'
                            },
                            detached: {
                                type: 'boolean',
                                description: 'Run in detached mode',
                                default: true
                            },
                            build: {
                                type: 'boolean',
                                description: 'Build images before starting',
                                default: false
                            }
                        }
                    }
                },
                {
                    name: 'docker_compose_down',
                    description: 'Stop and remove Docker Compose services',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            volumes: {
                                type: 'boolean',
                                description: 'Remove volumes as well',
                                default: false
                            },
                            removeImages: {
                                type: 'string',
                                enum: ['all', 'local', 'none'],
                                description: 'Remove images (all, local, or none)',
                                default: 'none'
                            }
                        }
                    }
                },
                {
                    name: 'docker_compose_restart',
                    description: 'Restart Docker Compose services',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            services: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Specific services to restart (optional)'
                            }
                        }
                    }
                }, {
                    name: 'docker_logs',
                    description: 'Get logs from Docker containers',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            container: {
                                type: 'string',
                                description: 'Container name or ID'
                            },
                            tail: {
                                type: 'number',
                                description: 'Number of lines to show from the end of logs',
                                default: 100
                            },
                            follow: {
                                type: 'boolean',
                                description: 'Follow log output',
                                default: false
                            }
                        },
                        required: ['container']
                    }
                },
                {
                    name: 'docker_health_check',
                    description: 'Check health status of all services',
                    inputSchema: {
                        type: 'object',
                        properties: {}
                    }
                }, {
                    name: 'docker_exec',
                    description: 'Execute command in running container',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            container: {
                                type: 'string',
                                description: 'Container name or ID'
                            },
                            command: {
                                type: 'string',
                                description: 'Command to execute'
                            },
                            interactive: {
                                type: 'boolean',
                                description: 'Run in interactive mode',
                                default: false
                            }
                        },
                        required: ['container', 'command']
                    }
                },
                {
                    name: 'docker_stats',
                    description: 'Get resource usage statistics for containers',
                    inputSchema: {
                        type: 'object',
                        properties: {
                            containers: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Specific containers to monitor (optional - all if not specified)'
                            }
                        }
                    }
                }
            ]
        };
    }

    /**
     * Execute Docker management tools
     * Thực thi các công cụ quản lý Docker
     */
    async callTool(name: string, args: any): Promise<any> {
        try {
            switch (name) {
                case 'docker_ps':
                    return await this.listContainers(args.all || false);

                case 'docker_compose_up':
                    return await this.composeUp(args.services, args.detached !== false, args.build || false);

                case 'docker_compose_down':
                    return await this.composeDown(args.volumes || false, args.removeImages || 'none');

                case 'docker_compose_restart':
                    return await this.composeRestart(args.services);

                case 'docker_logs':
                    return await this.getLogs(args.container, args.tail || 100, args.follow || false);

                case 'docker_health_check':
                    return await this.healthCheck();

                case 'docker_exec':
                    return await this.execCommand(args.container, args.command, args.interactive || false);

                case 'docker_stats':
                    return await this.getStats(args.containers);

                default:
                    throw new Error(`Unknown Docker tool: ${name}`);
            }
        } catch (error) {
            throw new Error(`Docker tool '${name}' failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

  /**
   * List Docker containers
   * Liệt kê các Docker containers
   */  private async listContainers(all: boolean = false): Promise<{ containers: ContainerStatus[] }> {
        const command = all ? 'docker ps -a --format "{{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"'
            : 'docker ps --format "{{.Names}}\t{{.Status}}\t{{.Ports}}\t{{.Image}}"';

        const { stdout } = await execAsync(command);
        const lines = stdout.trim().split('\n');

        const containers: ContainerStatus[] = [];
        for (const line of lines) {
            if (line.trim()) {
                const parts = line.split('\t');
                if (parts.length >= 4) {
                    const [name, status, ports, image] = parts;

                    // Get health status
                    let health: ContainerStatus['health'] = 'none';
                    try {
                        const { stdout: healthOutput } = await execAsync(`docker inspect --format='{{.State.Health.Status}}' ${name.trim()}`);
                        const healthStatus = healthOutput.trim();
                        if (healthStatus && healthStatus !== '<no value>') {
                            health = healthStatus as ContainerStatus['health'];
                        }
                    } catch {
                        // Health check not available
                    }

                    containers.push({
                        name: name.trim(),
                        status: this.parseContainerStatus(status.trim()),
                        health,
                        uptime: status.trim(),
                        ports: ports ? ports.split(',').map(p => p.trim()) : [],
                        image: image.trim()
                    });
                }
            }
        }

        return { containers };
    }

    /**
     * Start Docker Compose services
     * Khởi động các dịch vụ Docker Compose
     */
    private async composeUp(services?: string[], detached: boolean = true, build: boolean = false): Promise<{ success: boolean; message: string; output: string }> {
        let command = `docker compose -f "${this.composePath}"`;

        if (build) {
            command += ' up --build';
        } else {
            command += ' up';
        }

        if (detached) {
            command += ' -d';
        }

        if (services && services.length > 0) {
            command += ` ${services.join(' ')}`;
        }

        try {
            const { stdout, stderr } = await execAsync(command);
            return {
                success: true,
                message: `Docker Compose services started successfully`,
                output: stdout + stderr
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to start Docker Compose services: ${error.message}`,
                output: error.stdout + error.stderr
            };
        }
    }

    /**
     * Stop Docker Compose services
     * Dừng các dịch vụ Docker Compose
     */
    private async composeDown(volumes: boolean = false, removeImages: string = 'none'): Promise<{ success: boolean; message: string; output: string }> {
        let command = `docker compose -f "${this.composePath}" down`;

        if (volumes) {
            command += ' -v';
        }

        if (removeImages !== 'none') {
            command += ` --rmi ${removeImages}`;
        }

        try {
            const { stdout, stderr } = await execAsync(command);
            return {
                success: true,
                message: 'Docker Compose services stopped successfully',
                output: stdout + stderr
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to stop Docker Compose services: ${error.message}`,
                output: error.stdout + error.stderr
            };
        }
    }

    /**
     * Restart Docker Compose services
     * Khởi động lại các dịch vụ Docker Compose
     */
    private async composeRestart(services?: string[]): Promise<{ success: boolean; message: string; output: string }> {
        let command = `docker compose -f "${this.composePath}" restart`;

        if (services && services.length > 0) {
            command += ` ${services.join(' ')}`;
        }

        try {
            const { stdout, stderr } = await execAsync(command);
            return {
                success: true,
                message: 'Docker Compose services restarted successfully',
                output: stdout + stderr
            };
        } catch (error: any) {
            return {
                success: false,
                message: `Failed to restart Docker Compose services: ${error.message}`,
                output: error.stdout + error.stderr
            };
        }
    }

    /**
     * Get container logs
     * Lấy logs từ container
     */
    private async getLogs(container: string, tail: number = 100, follow: boolean = false): Promise<{ logs: string; container: string }> {
        let command = `docker logs --tail ${tail}`;

        if (follow) {
            command += ' -f';
        }

        command += ` ${container}`;

        try {
            const { stdout, stderr } = await execAsync(command);
            return {
                container,
                logs: stdout + stderr
            };
        } catch (error: any) {
            throw new Error(`Failed to get logs for container ${container}: ${error.message}`);
        }
    }

    /**
     * Health check for all services
     * Kiểm tra sức khỏe của tất cả các dịch vụ
     */
    private async healthCheck(): Promise<{ services: Array<{ name: string; status: string; health: string }> }> {
        const { containers } = await this.listContainers(false);

        const services = containers.map(container => ({
            name: container.name,
            status: container.status,
            health: container.health
        }));

        return { services };
    }

    /**
     * Execute command in container
     * Thực thi lệnh trong container
     */
    private async execCommand(container: string, command: string, interactive: boolean = false): Promise<{ output: string; container: string; command: string }> {
        let dockerCommand = 'docker exec';

        if (interactive) {
            dockerCommand += ' -it';
        }

        dockerCommand += ` ${container} ${command}`;

        try {
            const { stdout, stderr } = await execAsync(dockerCommand);
            return {
                container,
                command,
                output: stdout + stderr
            };
        } catch (error: any) {
            throw new Error(`Failed to execute command in container ${container}: ${error.message}`);
        }
    }

    /**
     * Get container resource statistics
     * Lấy thống kê tài nguyên của container
     */
    private async getStats(containers?: string[]): Promise<{ stats: string }> {
        let command = 'docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"';

        if (containers && containers.length > 0) {
            command += ` ${containers.join(' ')}`;
        }

        try {
            const { stdout } = await execAsync(command);
            return { stats: stdout };
        } catch (error: any) {
            throw new Error(`Failed to get container stats: ${error.message}`);
        }
    }

    /**
     * Parse container status from Docker output
     * Phân tích trạng thái container từ output của Docker
     */
    private parseContainerStatus(status: string): ContainerStatus['status'] {
        const statusLower = status.toLowerCase();

        if (statusLower.includes('up')) return 'running';
        if (statusLower.includes('exited')) return 'exited';
        if (statusLower.includes('created')) return 'created';
        if (statusLower.includes('restarting')) return 'restarting';
        if (statusLower.includes('removing')) return 'removing';
        if (statusLower.includes('paused')) return 'paused';
        if (statusLower.includes('dead')) return 'dead';

        return 'stopped';
    }

    /**
     * Check if Docker is available
     * Kiểm tra xem Docker có khả dụng không
     */
    async isDockerAvailable(): Promise<boolean> {
        try {
            await execAsync('docker --version');
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Check if Docker Compose is available
     * Kiểm tra xem Docker Compose có khả dụng không
     */
    async isDockerComposeAvailable(): Promise<boolean> {
        try {
            await execAsync('docker compose version');
            return true;
        } catch {
            return false;
        }
    }
}
