// Supported via standard GitHub programming aids
var z = require('zod').z;

// --- Time ---
var ZGetTimeResponse = z.object({
    time: z.string(),
});
