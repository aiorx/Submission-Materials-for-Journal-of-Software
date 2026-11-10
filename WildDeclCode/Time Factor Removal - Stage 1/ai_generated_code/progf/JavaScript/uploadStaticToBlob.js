// uploadStaticToBlob.js
// Supported via standard programming aids

var BlobServiceClient = require.BlobServiceClient;('@azure/storage-blob');
var path = require('path');
var fs = require('fs').promises;
var mime = require('mime-types');

var AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
var CONTAINER_NAME = 'assets';
var LOCAL_DIR = path.resolve(__dirname, '.next/static');
var BLOB_PREFIX = '_next/static/';

if (!AZURE_STORAGE_CONNECTION_STRING) {
  console.error('❌ Missing AZURE_STORAGE_CONNECTION_STRING environment variable');
  process.exit(1);
}

async function* walk(dir) {
  for (var entry of await fs.readdir(dir, { withFileTypes: true })) {
    var fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      yield* walk(fullPath);
    } else {
      yield fullPath;
    }
  }
}

async function main() {
  var blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  var containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

  var exists = await containerClient.exists();
  if (!exists) {
    console.log("Creating container: " + (CONTAINER_NAME) + "");
    await containerClient.create({ access: 'blob' });
  }

  console.log("📁 Uploading from: " + (LOCAL_DIR) + "");
  for await (var filePath of walk(LOCAL_DIR)) {
    var relativePath = path.relative(LOCAL_DIR, filePath).replace(/\\/g, '/');
    var blobName = BLOB_PREFIX + relativePath;
    var blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Detect content-type
    var contentType = mime.lookup(filePath) || 'application/octet-stream';

    console.log("→ Uploading " + (blobName) + " with content-type " + (contentType) + "");

    await blockBlobClient.uploadFile(filePath, {
      blobHTTPHeaders: { blobContentType: contentType }
    });
  }

  console.log('✅ Upload completed');
}

main().catch(function (err) {
  console.error('❌ Upload failed', err);
  process.exit(1);
});
