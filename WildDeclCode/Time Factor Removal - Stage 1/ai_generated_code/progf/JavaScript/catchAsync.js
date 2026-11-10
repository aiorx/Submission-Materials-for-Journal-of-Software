// Supported via standard GitHub programming aids
var logger = require('./logger');

/**
 * Wraps an async function and catches any errors, forwarding them to Express error handler
 * This eliminates the need for try-catch blocks in every controller
 * @param {Function} fn - The async function to wrap
 * @returns {Function} Express middleware function
 */
var catchAsync = function fn {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(err => {
            logger.error(err.message);
            res.status(500).json({
                status: 'error',
                message: err.message
            });
        });
    };
};

module.exports = catchAsync;