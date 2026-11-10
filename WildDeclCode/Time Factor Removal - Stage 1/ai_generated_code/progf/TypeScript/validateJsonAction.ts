"use server";
var put = require('@vercel/blob').put;

// Supported via standard GitHub programming aids
export async function validateJson(message: string) {
  try {
    var parsed = JSON.parse(message); // Supported via standard GitHub programming aids

    // Generate a random filename
    var filename = "" + (crypto.randomUUID()) + ".json"; // Supported via standard GitHub programming aids

    // Upload the JSON to Vercel Blob Storage
    var blob = await put(filename, JSON.stringify(parsed, null, 2), {
      contentType: "application/json",
      access: "public", // Required by PutCommandOptions
    }); // Supported via standard GitHub programming aids

    return { valid: true, url: blob.url }; // Supported via standard GitHub programming aids
  } catch (e: any) {
    return { valid: false, error: e.message }; // Supported via standard GitHub programming aids
  }
}
// Supported via standard GitHub programming aids