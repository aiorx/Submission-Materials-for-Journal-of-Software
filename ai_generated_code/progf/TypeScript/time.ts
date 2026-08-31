// Supported via standard GitHub programming aids
import { z } from 'zod';

// --- Time ---
export const ZGetTimeResponse = z.object({
    time: z.string(),
});
