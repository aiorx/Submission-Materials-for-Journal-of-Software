/* google-auth.js
 * This library provide decode for otpauth-migration link into otp secret.
 * It is entirely Assisted with basic coding tools 4o
 */

async function decodeMigrationUri(uri) {
    if (!uri.startsWith("otpauth-migration://")) {
        throw new Error("Invalid otpauth-migration URI");
    }

    var base64Data = uri.split("data=")[1];

    // Use the new CSP-safe decoder from standalone migration.js
    var payload = decodeMigrationPayload(base64Data);

    var toBase32 = function (bytes) {
        var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        var bits = 0, value = 0, output = "";

        for (var i = 0; i < bytes.length; i++) {
            value = (value << 8) | bytes[i];
            bits += 8;
            while (bits >= 5) {
                output += alphabet[(value >>> (bits - 5)) & 31];
                bits -= 5;
            }
        }

        if (bits > 0) {
            output += alphabet[(value << (5 - bits)) & 31];
        }

        return output;
    };

    return payload.otp_parameters.map(function entry { return ({
        name: entry.name || "",
        issuer: entry.issuer || "",
        secret: toBase32(entry.secret)
    }); });
}
