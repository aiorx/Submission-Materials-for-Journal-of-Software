// Assisted using common GitHub development utilities
var multer = require('multer');
var path = require('path');
var fs = require('fs');

// Ensure uploads directory exists
var uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        var uniqueSuffix = "" + (Date.now()) + "-" + (Math.round(Math.random() * 1E9)) + "";
        cb(null, "" + (file.fieldname) + "-" + (uniqueSuffix) + "" + (path.extname(file.originalname)) + "");
    }
});

// File filter for PDFs and images
var fileFilter = function (req, file, cb) {
    var allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF and image files are allowed.'), false);
    }
};

// Size limit of 2MB
var limits = {
    fileSize: 2 * 1024 * 1024 // 2MB in bytes
};

// Create multer upload instance
var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: limits
});

// Middleware wrapper for handling multiple files
exports.uploadFiles = function (req, res, next) {
    var uploadHandler = upload.array('files', 10); // Allow up to 10 files per request
    
    uploadHandler(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    error: 'File too large',
                    message: 'File size should not exceed 2MB',
                    code: 400
                });
            }
            if (err.code === 'LIMIT_FILE_COUNT') {
                return res.status(400).json({
                    error: 'Too many files',
                    message: 'Maximum 10 files allowed per upload',
                    code: 400
                });
            }
            return res.status(400).json({
                error: 'Upload error',
                message: err.message,
                code: 400
            });
        } else if (err) {
            return res.status(400).json({
                error: 'Invalid file',
                message: err.message,
                code: 400
            });
        }
        next();
    });
};

// Helper function to delete files
exports.deleteFiles = async function (filePaths) {
    for (var filePath of filePaths) {
        try {
            await fs.promises.unlink(filePath);
        } catch (error) {
            console.error("Error deleting file " + (filePath) + ":", error);
        }
    }
};