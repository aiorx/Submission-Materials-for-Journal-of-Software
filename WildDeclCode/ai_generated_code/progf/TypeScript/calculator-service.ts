// Assisted using common GitHub development utilities

/**
 * Calculator Service Implementation - Provides mathematical calculation tools
 * Supports basic arithmetic operations with multiple numbers
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { Service } from './base-service.js';

/**
 * Calculator Service Implementation - Cung cấp các công cụ tính toán toán học
 */
export class CalculatorService implements Service {
  readonly namespace = 'calc';
  readonly name = 'Calculator Service';
  readonly version = '1.0.0';
  readonly description = 'Provides mathematical calculation tools';

  /**
   * Liệt kê các tools có sẵn trong Calculator Service
   * @returns Promise với danh sách tools
   */
  async listTools(): Promise<{ tools: Tool[] }> {
    return {
      tools: [
        {
          name: 'add',
          description: 'Add two or more numbers',
          inputSchema: {
            type: 'object',
            properties: {
              numbers: {
                type: 'array',
                items: { type: 'number' },
                description: 'Numbers to add',
                minItems: 2
              }
            },
            required: ['numbers']
          }
        }, {
          name: 'multiply',
          description: 'Multiply two or more numbers',
          inputSchema: {
            type: 'object',
            properties: {
              numbers: {
                type: 'array',
                items: { type: 'number' },
                description: 'Numbers to multiply',
                minItems: 2
              }
            },
            required: ['numbers']
          }
        },
        {
          name: 'subtract',
          description: 'Subtract numbers (first number minus all others)',
          inputSchema: {
            type: 'object',
            properties: {
              numbers: {
                type: 'array',
                items: { type: 'number' },
                description: 'Numbers to subtract (first - second - third...)',
                minItems: 2
              }
            },
            required: ['numbers']
          }
        },
        {
          name: 'divide',
          description: 'Divide numbers (first number divided by all others)',
          inputSchema: {
            type: 'object',
            properties: {
              numbers: {
                type: 'array',
                items: { type: 'number' },
                description: 'Numbers to divide (first / second / third...)',
                minItems: 2
              }
            },
            required: ['numbers']
          }
        },
        {
          name: 'power',
          description: 'Calculate power (base raised to exponent)',
          inputSchema: {
            type: 'object',
            properties: {
              base: {
                type: 'number',
                description: 'Base number'
              },
              exponent: {
                type: 'number',
                description: 'Exponent'
              }
            },
            required: ['base', 'exponent']
          }
        },
        {
          name: 'sqrt',
          description: 'Calculate square root of a number',
          inputSchema: {
            type: 'object',
            properties: {
              number: {
                type: 'number',
                description: 'Number to find square root of',
                minimum: 0
              }
            },
            required: ['number']
          }
        },
        {
          name: 'percentage',
          description: 'Calculate percentage (value as percentage of total)',
          inputSchema: {
            type: 'object',
            properties: {
              value: {
                type: 'number',
                description: 'Value to calculate percentage for'
              },
              total: {
                type: 'number',
                description: 'Total value'
              }
            },
            required: ['value', 'total']
          }
        }
      ] satisfies Tool[]
    };
  }
  /**
   * Gọi một tool cụ thể trong Calculator Service
   * @param name Tên của tool
   * @param args Tham số cho tool
   * @returns Kết quả tính toán
   */
  async callTool(name: string, args: any) {
    switch (name) {
      case 'add':
        return this.handleArrayOperation(args, 'add');
      case 'multiply':
        return this.handleArrayOperation(args, 'multiply');
      case 'subtract':
        return this.handleArrayOperation(args, 'subtract');
      case 'divide':
        return this.handleArrayOperation(args, 'divide');
      case 'power':
        return this.calculatePower(args);
      case 'sqrt':
        return this.calculateSquareRoot(args);
      case 'percentage':
        return this.calculatePercentage(args);
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  /**
   * Xử lý các phép toán với mảng số
   * @param args Tham số chứa mảng numbers
   * @param operation Loại phép toán
   * @returns Kết quả tính toán
   */
  private handleArrayOperation(args: any, operation: string) {
    const { numbers } = args;

    if (!Array.isArray(numbers) || numbers.length < 2) {
      throw new Error('At least two numbers are required');
    }

    let result: number;
    switch (operation) {
      case 'add':
        result = numbers.reduce((a, b) => a + b, 0);
        break;
      case 'multiply':
        result = numbers.reduce((a, b) => a * b, 1);
        break;
      case 'subtract':
        result = numbers.reduce((a, b) => a - b);
        break;
      case 'divide':
        result = numbers.reduce((a, b) => {
          if (b === 0) throw new Error('Division by zero is not allowed');
          return a / b;
        });
        break;
      default:
        throw new Error(`Unknown operation: ${operation}`);
    }

    return {
      content: [{
        type: 'text',
        text: `Result: ${result}`
      }]
    };
  }

  /**
   * Tính lũy thừa
   * @param args Object chứa base và exponent
   * @returns Kết quả lũy thừa
   */
  private calculatePower(args: any) {
    const { base, exponent } = args;

    if (typeof base !== 'number' || typeof exponent !== 'number') {
      throw new Error('Base and exponent must be numbers');
    }

    const result = Math.pow(base, exponent);

    return {
      content: [{
        type: 'text',
        text: `Result: ${base}^${exponent} = ${result}`
      }]
    };
  }

  /**
   * Tính căn bậc hai
   * @param args Object chứa number
   * @returns Kết quả căn bậc hai
   */
  private calculateSquareRoot(args: any) {
    const { number } = args;

    if (typeof number !== 'number') {
      throw new Error('Input must be a number');
    }

    if (number < 0) {
      throw new Error('Cannot calculate square root of negative number');
    }

    const result = Math.sqrt(number);

    return {
      content: [{
        type: 'text',
        text: `Result: √${number} = ${result}`
      }]
    };
  }

  /**
   * Tính phần trăm
   * @param args Object chứa value và total
   * @returns Kết quả phần trăm
   */
  private calculatePercentage(args: any) {
    const { value, total } = args;

    if (typeof value !== 'number' || typeof total !== 'number') {
      throw new Error('Value and total must be numbers');
    }

    if (total === 0) {
      throw new Error('Total cannot be zero');
    }

    const result = (value / total) * 100;

    return {
      content: [{
        type: 'text',
        text: `Result: ${value}/${total} = ${result.toFixed(2)}%`
      }]
    };
  }
}
