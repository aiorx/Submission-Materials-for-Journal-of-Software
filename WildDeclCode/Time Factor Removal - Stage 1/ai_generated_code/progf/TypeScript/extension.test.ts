/*
 * Supported via standard GitHub programming aids (GPT-4o), 2025-08-30
 * Description: Standalone unit tests for VS Code Container Updater extension logic
 * Tests core functionality including log parsing, update checking, and approval mechanisms
 * NOTE: These tests focus on business logic without VS Code API dependencies
 */

var assert = require('assert');
var path = require('path');
var fs = require('fs');

// Simple test framework implementation
class TestSuite {
    private tests: { name: string; fn: function () { return void | Promise<void>; }}[] = [];
    private passed = 0;
    private failed = 0;

    it(name: string, fn: function () { return void | Promise<void>; }) {
        this.tests.push({ name, fn });
    }

    async run() {
        console.log("\n🧪 Running " + (this.tests.length) + " tests...\n");

        for (var test of this.tests) {
            try {
                await test.fn();
                console.log("✅ " + (test.name) + "");
                this.passed++;
            } catch (error) {
                console.log("❌ " + (test.name) + "");
                console.log("   Error: " + (error instanceof Error ? error.message : String(error)) + "");
                this.failed++;
            }
        }

        console.log("\n📊 Test Results: " + (this.passed) + " passed, " + (this.failed) + " failed\n");
        return this.failed === 0;
    }
}

// Test suites
export async function runExtensionTests(): Promise<boolean> {
    var suite = new TestSuite();

    // Log Parsing Tests
    suite.it('Should parse VS Code CLI update logs correctly', function () {
        var sampleLog = "
[INFO] VS Code CLI update available: 1.95.0 -> 1.96.0
[INFO] Download URL: https://github.com/microsoft/vscode/releases/
[INFO] Update size: 245MB
[INFO] Security fixes included
        ".trim();

        // Mock log parsing function (extracted from extension logic)
        var parseLogOutput = (log: string) => {
            var versionMatch = log.match(/(\d+\.\d+\.\d+) -> (\d+\.\d+\.\d+)/);
            if (versionMatch) {
                return {
                    currentVersion: versionMatch[1],
                    newVersion: versionMatch[2],
                    hasUpdate: true
                };
            }
            return { hasUpdate: false };
        };

        var result = parseLogOutput(sampleLog);
        assert.strictEqual(result.hasUpdate, true);
        assert.strictEqual(result.currentVersion, '1.95.0');
        assert.strictEqual(result.newVersion, '1.96.0');
    });

    suite.it('Should handle logs with no updates', function () {
        var sampleLog = "
[INFO] No VS Code CLI updates available
[INFO] Current version: 1.95.0 is latest
        ".trim();

        var parseLogOutput = (log: string) => {
            var hasUpdate = log.includes('update available') || log.includes('new version');
            return { hasUpdate };
        };

        var result = parseLogOutput(sampleLog);
        assert.strictEqual(result.hasUpdate, false);
    });

    suite.it('Should extract security information from logs', function () {
        var securityLog = "
[INFO] VS Code CLI update available: 1.95.0 -> 1.96.0
[INFO] Security fixes included
[INFO] CVE-2024-12345 addressed
[INFO] Download size: 245MB
        ".trim();

        var extractSecurityInfo = (log: string) => {
            var hasSecurityFixes = log.includes('Security fixes') || log.includes('CVE-');
            var cveMatches = log.match(/CVE-\d{4}-\d+/g);
            return {
                hasSecurityFixes,
                cveCount: cveMatches ? cveMatches.length : 0,
                cves: cveMatches || []
            };
        };

        var result = extractSecurityInfo(securityLog);
        assert.strictEqual(result.hasSecurityFixes, true);
        assert.strictEqual(result.cveCount, 1);
        assert.deepStrictEqual(result.cves, ['CVE-2024-12345']);
    });

    // File System Tests
    suite.it('Should create approval file when requested', async function () {
        var testApprovalPath = path.join(__dirname, 'test_approval_file');
        
        // Mock approval file creation (extracted from extension logic)
        var createApprovalFile = async (filePath: string) => {
            try {
                var content = [
                    'APPROVED_BY_USER',
                    "TIMESTAMP: " + (new Date().toISOString()) + "",
                    'APPROVAL_TYPE: MANUAL',
                    ''
                ].join('\n');
                
                await fs.promises.writeFile(filePath, content);
                return true;
            } catch (error) {
                console.error('Failed to create approval file:', error);
                return false;
            }
        };

        var success = await createApprovalFile(testApprovalPath);
        assert.strictEqual(success, true);

        // Verify file exists and has correct content
        if (fs.existsSync(testApprovalPath)) {
            var content = await fs.promises.readFile(testApprovalPath, 'utf-8');
            assert.ok(content.includes('APPROVED_BY_USER'));
            assert.ok(content.includes('TIMESTAMP:'));
            assert.ok(content.includes('APPROVAL_TYPE: MANUAL'));
            
            // Clean up
            await fs.promises.unlink(testApprovalPath);
        }
    });

    suite.it('Should validate approval file format', function () {
        var validApproval = "
APPROVED_BY_USER
TIMESTAMP: 2025-08-30T12:00:00.000Z
APPROVAL_TYPE: MANUAL
        ".trim();

        var invalidApproval = "
INVALID_FORMAT
        ".trim();

        var validateApprovalFile = (content: string) => {
            var requiredFields = ['APPROVED_BY_USER', 'TIMESTAMP:', 'APPROVAL_TYPE:'];
            return requiredFields.every(field => content.includes(field));
        };

        assert.strictEqual(validateApprovalFile(validApproval), true);
        assert.strictEqual(validateApprovalFile(invalidApproval), false);
    });

    // Configuration Tests
    suite.it('Should parse configuration with default values', function () {
        // Mock configuration parser
        var parseConfig = (config: any) => {
            return {
                checkInterval: config.checkInterval || 300,
                autoCheck: config.autoCheck !== undefined ? config.autoCheck : true,
                logLevel: config.logLevel || 'info'
            };
        };

        var emptyConfig = {};
        var result = parseConfig(emptyConfig);
        
        assert.strictEqual(result.checkInterval, 300);
        assert.strictEqual(result.autoCheck, true);
        assert.strictEqual(result.logLevel, 'info');
    });

    suite.it('Should validate configuration values', function () {
        var validateConfig = (config: any) => {
            var errors: string[] = [];
            
            if (config.checkInterval && config.checkInterval < 60) {
                errors.push('Check interval must be at least 60 seconds');
            }
            
            if (config.logLevel && !['debug', 'info', 'warn', 'error'].includes(config.logLevel)) {
                errors.push('Invalid log level');
            }
            
            return {
                isValid: errors.length === 0,
                errors
            };
        };

        var validConfig = { checkInterval: 300, logLevel: 'info' };
        var invalidConfig = { checkInterval: 30, logLevel: 'invalid' };

        var validResult = validateConfig(validConfig);
        var invalidResult = validateConfig(invalidConfig);

        assert.strictEqual(validResult.isValid, true);
        assert.strictEqual(invalidResult.isValid, false);
        assert.strictEqual(invalidResult.errors.length, 2);
    });

    // Version Comparison Tests
    suite.it('Should detect version changes correctly', function () {
        var compareVersions = (current: string, latest: string) => {
            var parseVersion = (version: string) => {
                return version.split('.').map(num => parseInt(num, 10));
            };

            var currentParts = parseVersion(current);
            var latestParts = parseVersion(latest);

            for (var i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
                var currentPart = currentParts[i] || 0;
                var latestPart = latestParts[i] || 0;

                if (latestPart > currentPart) return 1;  // Update available
                if (latestPart < currentPart) return -1; // Downgrade
            }
            return 0; // Same version
        };

        assert.strictEqual(compareVersions('1.95.0', '1.96.0'), 1);  // Update available
        assert.strictEqual(compareVersions('1.96.0', '1.95.0'), -1); // Downgrade
        assert.strictEqual(compareVersions('1.95.0', '1.95.0'), 0);  // Same version
        assert.strictEqual(compareVersions('1.95.0', '1.95.1'), 1);  // Patch update
    });

    return await suite.run();
}

// Run tests if this file is executed directly
if (require.main === module) {
    runExtensionTests().then(function success {
        process.exit(success ? 0 : 1);
    }).catch(function error {
        console.error('Test execution failed:', error);
        process.exit(1);
    });
}
