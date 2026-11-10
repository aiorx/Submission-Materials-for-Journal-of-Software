/**
 * Code Aided using common development resources. I couldn't use Node crypto, so I prompted ChatGPT to write a custom solution for hashing string. I don't yet understand how it works yet but, yeah it works :)
 * @param {string} message
 * @param {string} key
 * @returns {Promise<string>}
 */
export default async function hash(message, key) {
	async function sha256(ascii) {
		function rightRotate(value, amount) {
			return (value >>> amount) | (value << (32 - amount));
		}

		var mathPow = Math.pow;
		var maxWord = mathPow(2, 32);
		var lengthProperty = "length";
		var i, j; // Used as a counter across the whole method
		var result = "";

		var words = [];
		var asciiBitLength = ascii[lengthProperty] * 8;

		// * caching results is optional - remove/add slash from front of this line to toggle
		// var hash = (sha256.h = sha256.h || []);
		var hash = (sha256.h = [
			1779033703, 3144134277, 1013904242, 2773480762, 1359893119,
			2600822924, 528734635, 1541459225
		]);

		var k = (sha256.k = [
			1116352408, 1899447441, 3049323471, 3921009573, 961987163,
			1508970993, 2453635748, 2870763221, 3624381080, 310598401,
			607225278, 1426881987, 1925078388, 2162078206, 2614888103,
			3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983,
			1249150122, 1555081692, 1996064986, 2554220882, 2821834349,
			2952996808, 3210313671, 3336571891, 3584528711, 113926993,
			338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700,
			1986661051, 2177026350, 2456956037, 2730485921, 2820302411,
			3259730800, 3345764771, 3516065817, 3600352804, 4094571909,
			275423344, 430227734, 506948616, 659060556, 883997877, 958139571,
			1322822218, 1537002063, 1747873779, 1955562222, 2024104815,
			2227730452, 2361852424, 2428436474, 2756734187, 3204031479,
			3329325298
		]);

		ascii += "\x80"; // Append Ƈ' bit (plus zero padding)
		while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00"; // More zero padding
		for (i = 0; i < ascii[lengthProperty]; i++) {
			j = ascii.charCodeAt(i);
			if (j >> 8) return; // ASCII check: only accept characters in range 0-255
			words[i >> 2] |= j << (((3 - i) % 4) * 8);
		}
		words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
		words[words[lengthProperty]] = asciiBitLength;

		// process each chunk
		for (j = 0; j < words[lengthProperty]; ) {
			var w = words.slice(j, (j += 16)); // The message is expanded into 64 words as part of the iteration
			var oldHash = hash;
			// This is now the "working hash", often labelled as variables a...g
			// (we have to truncate as well, otherwise we'll get collisions)
			hash = hash.slice(0, 8);

			for (i = 0; i < 64; i++) {
				var i2 = i + j;
				// Expand the message into 64 words
				// Used below if
				var w15 = w[i - 15],
					w2 = w[i - 2];

				// Iterate
				var a = hash[0],
					e = hash[4];
				var temp1 =
					hash[7] +
					(rightRotate(e, 6) ^
						rightRotate(e, 11) ^
						rightRotate(e, 25)) + // S1
					((e & hash[5]) ^ (~e & hash[6])) + // ch
					k[i] +
					// Expand the message schedule if needed
					(w[i] =
						i < 16
							? w[i]
							: (w[i - 16] +
									(rightRotate(w15, 7) ^
										rightRotate(w15, 18) ^
										(w15 >>> 3)) + // s0
									w[i - 7] +
									(rightRotate(w2, 17) ^
										rightRotate(w2, 19) ^
										(w2 >>> 10))) | // s1
							  0);
				// This is only used once, so *could* be moved below, but it only
				// saves 4 bytes and makes things unreadable
				var temp2 =
					(rightRotate(a, 2) ^
						rightRotate(a, 13) ^
						rightRotate(a, 22)) + // S0
					((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2])); // maj

				hash = [(temp1 + temp2) | 0].concat(hash); // Add the hash to the beginning
				hash[4] = (hash[4] + temp1) | 0; // Add the temp1 result to the 5th element
			}

			for (i = 0; i < 8; i++) {
				hash[i] = (hash[i] + oldHash[i]) | 0;
			}
		}

		for (i = 0; i < 8; i++) {
			for (j = 3; j + 1; j--) {
				var b = (hash[i] >> (j * 8)) & 255;
				result += (b < 16 ? 0 : "") + b.toString(16);
			}
		}
		return result;
	}

	// HMAC-SHA256
	async function hmacSha256(key, message) {
		var blockSize = 64;
		if (key.length > blockSize) {
			key = sha256(key);
		}
		if (key.length < blockSize) {
			key += "\x00".repeat(blockSize - key.length);
		}

		var oKeyPad = key
			.split("")
			.map(function (char) {
				return char.charCodeAt(0) ^ 0x5c;
			})
			.map(String.fromCharCode)
			.join("");
		var iKeyPad = key
			.split("")
			.map(function (char) {
				return char.charCodeAt(0) ^ 0x36;
			})
			.map(String.fromCharCode)
			.join("");

		return await sha256(oKeyPad + (await sha256(iKeyPad + message)));
	}

	return await hmacSha256(key, message);
}
