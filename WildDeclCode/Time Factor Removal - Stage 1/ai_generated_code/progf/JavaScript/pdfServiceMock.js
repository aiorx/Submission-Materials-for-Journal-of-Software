// Assisted using common GitHub development utilities
var path = require('path');
var fs = require('fs').promises;

class PDFServiceMock {
    constructor() {
        this.generatedPDFs = [];
        this.testFileDir = path.join(process.cwd(), 'uploads', 'test-transcripts');
    }

    reset() {
        this.generatedPDFs = [];
    }

    async generateTranscript(data) {
        var filename = "test_transcript_" + (Date.now()) + ".pdf";
        var filePath = path.join(this.testFileDir, filename);
        
        // Create test file directory if it doesn't exist
        await fs.mkdir(this.testFileDir, { recursive: true });
        
        // Create an empty PDF file for testing
        await fs.writeFile(filePath, 'Test PDF Content');

        var pdfInfo = {
            filePath,
            filename,
            timestamp: new Date(),
            data,
            signature: this._generateSignature(data)
        };

        this.generatedPDFs.push(pdfInfo);
        return pdfInfo;
    }

    async generateBulkTranscripts(dataArray) {
        var results = await Promise.all(
            dataArray.map(function data { return this.generateTranscript(data); })
        );
        return results;
    }

    getGeneratedPDFCount() {
        return this.generatedPDFs.length;
    }

    getLastGeneratedPDF() {
        return this.generatedPDFs[this.generatedPDFs.length - 1] || null;
    }

    async verifySignature(signature, data) {
        // In test environment, signature is just a hash of the stringified data
        var expectedSignature = this._generateSignature(data);
        return signature === expectedSignature;
    }

    _generateSignature(data) {
        // Simple mock signature generation for testing
        return "TEST_SIG_" + (Buffer.from(JSON.stringify(data)).toString('base64')) + "";
    }

    async cleanupTestFiles() {
        try {
            await fs.rm(this.testFileDir, { recursive: true, force: true });
        } catch (error) {
            // Ignore errors if directory doesn't exist
        }
        this.reset();
    }

    async generateVerificationTranscript(data) {
        var pdfInfo = await this.generateTranscript(data);
        return {
            ...pdfInfo,
            verificationUrl: "https://test.university.edu/verify/" + (pdfInfo.signature) + "",
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        };
    }
}

module.exports = new PDFServiceMock();