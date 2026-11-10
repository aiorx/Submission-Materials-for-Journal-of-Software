// Assisted using common GitHub development utilities
/**
 * Run command for Custom Rules CLI
 */
import * as fs from 'fs-extra';
import * as path from 'path';
import chalk from 'chalk';
import { GlobalOptions, ConfigManager } from '../core/config.js';

interface RunOptions extends GlobalOptions {
  report?: string;
}

export async function runCommand(options: RunOptions): Promise<void> {
  const { verbose = false, profile = 'default', dest = process.cwd(), report } = options;
  
  if (verbose) {
    console.log(chalk.blue(`Running rules validation with profile: ${profile}`));
    console.log(chalk.blue(`Destination: ${dest}`));
  }
  
  try {
    // Initialize configuration
    const configManager = new ConfigManager(options);
    const config = configManager.getConfig();
    
    console.log(chalk.blue.bold('🔍 Custom Rules Validation'));
    console.log(chalk.blue('==========================='));
    
    // Check if there are any rules configured
    if (!config.rules || config.rules.length === 0) {
      console.log(chalk.yellow('No rules configured. Run \'custom-rules init\' to set up rules.'));
      return;
    }
    
    // Run enabled rules
    const enabledRules = config.rules.filter(rule => rule.enabled);
    
    if (enabledRules.length === 0) {
      console.log(chalk.yellow('No rules are enabled. Check your configuration.'));
      return;
    }
    
    console.log(chalk.green(`Found ${enabledRules.length} enabled rule(s):`));
    
    const results = [];
    
    for (const rule of enabledRules) {
      console.log(chalk.cyan(`\n📋 Running rule: ${rule.name}`));
      
      // Simulate rule execution (actual implementation would run real rules)
      const result = await executeRule(rule, dest, verbose);
      results.push(result);
      
      // Display result
      if (result.passed) {
        console.log(chalk.green(`  ✓ ${rule.description || rule.name} - PASSED`));
      } else {
        const color = result.severity === 'error' ? 'red' : result.severity === 'warning' ? 'yellow' : 'blue';
        console.log(chalk[color](`  ✗ ${rule.description || rule.name} - FAILED (${result.issues.length} issues)`));
        
        if (verbose && result.issues.length > 0) {
          result.issues.forEach(issue => {
            console.log(chalk.dim(`    - ${issue}`));
          });
        }
      }
    }
    
    // Summary
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    console.log(chalk.blue.bold('\n📊 Summary:'));
    console.log(chalk.green(`  ✓ Passed: ${passed}`));
    console.log(chalk.red(`  ✗ Failed: ${failed}`));
    console.log(chalk.cyan(`  Total: ${results.length}`));
    
    // Generate report if requested
    if (report) {
      await generateReport(results, config, dest, report, verbose);
    }
    
    // Exit with error code if any rules failed
    if (failed > 0) {
      process.exit(1);
    }
    
  } catch (error) {
    console.error(chalk.red(`Error during validation: ${error instanceof Error ? error.message : 'Unknown error'}`));
    throw error;
  }
}

async function executeRule(rule: any, dest: string, verbose: boolean): Promise<any> {
  // Simulate rule execution - in real implementation, this would:
  // 1. Load the rule implementation
  // 2. Execute the rule against the target directory
  // 3. Return actual results
  
  const result = {
    name: rule.name,
    passed: Math.random() > 0.3, // Simulate random pass/fail for demo
    severity: rule.severity || 'warning',
    issues: [] as string[]
  };
  
  if (!result.passed) {
    // Simulate some issues
    result.issues = [
      `Mock issue 1 for rule ${rule.name}`,
      `Mock issue 2 for rule ${rule.name}`
    ];
  }
  
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 100));
  
  return result;
}

async function generateReport(
  results: any[],
  config: any,
  dest: string,
  format: string,
  verbose: boolean
): Promise<void> {
  const reportsDir = path.join(dest, config.destinations?.reports || './reports');
  await fs.ensureDir(reportsDir);
  
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const reportPath = path.join(reportsDir, `custom-rules-report-${timestamp}.${format}`);
  
  try {
    let content: string;
    
    switch (format.toLowerCase()) {
      case 'json':
        content = JSON.stringify({
          timestamp: new Date().toISOString(),
          profile: config.name,
          summary: {
            total: results.length,
            passed: results.filter(r => r.passed).length,
            failed: results.filter(r => !r.passed).length
          },
          results
        }, null, 2);
        break;
        
      case 'yaml':
        const yamlData = {
          timestamp: new Date().toISOString(),
          profile: config.name,
          summary: {
            total: results.length,
            passed: results.filter(r => r.passed).length,
            failed: results.filter(r => !r.passed).length
          },
          results
        };
        content = require('yaml').stringify(yamlData);
        break;
        
      case 'html':
        content = generateHtmlReport(results, config);
        break;
        
      default:
        throw new Error(`Unsupported report format: ${format}`);
    }
    
    await fs.writeFile(reportPath, content);
    console.log(chalk.green(`\n📄 Report generated: ${reportPath}`));
    
  } catch (error) {
    console.error(chalk.red(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`));
  }
}

function generateHtmlReport(results: any[], config: any): string {
  const passed = results.filter(r => r.passed).length;
  const failed = results.filter(r => !r.passed).length;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Custom Rules Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .header { background: #f5f5f5; padding: 20px; border-radius: 8px; }
        .summary { margin: 20px 0; }
        .passed { color: #28a745; }
        .failed { color: #dc3545; }
        .rule { margin: 10px 0; padding: 10px; border-left: 4px solid #ddd; }
        .rule.passed { border-left-color: #28a745; }
        .rule.failed { border-left-color: #dc3545; }
        .issues { margin-top: 10px; padding-left: 20px; }
        .issue { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Custom Rules Validation Report</h1>
        <p><strong>Profile:</strong> ${config.name}</p>
        <p><strong>Generated:</strong> ${new Date().toISOString()}</p>
    </div>
    
    <div class="summary">
        <h2>Summary</h2>
        <p><span class="passed">✓ Passed: ${passed}</span></p>
        <p><span class="failed">✗ Failed: ${failed}</span></p>
        <p><strong>Total: ${results.length}</strong></p>
    </div>
    
    <div class="results">
        <h2>Results</h2>
        ${results.map(result => `
        <div class="rule ${result.passed ? 'passed' : 'failed'}">
            <strong>${result.name}</strong> - ${result.passed ? 'PASSED' : 'FAILED'}
            ${!result.passed && result.issues.length > 0 ? `
            <div class="issues">
                ${result.issues.map(issue => `<div class="issue">• ${issue}</div>`).join('')}
            </div>
            ` : ''}
        </div>
        `).join('')}
    </div>
</body>
</html>`;
}
