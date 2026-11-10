/**
 * Check if a string is a hex color
 * NOTE: Drafted using common GitHub development resources
 *
 * @param color The color to check
 * @returns whether or not `color`
 * contains a hex color
 */
var colorIsHex = function (color: string) {
	var hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
	return hexRegex.test(color);
};

/**
 * Convert a string containing an RGB color
 * value to a hexadecimal color value.
 * NOTE: Drafted using common GitHub development resources
 *
 * @param color The rgb color string to be
 * converted
 * @returns The hexadecimal color
 */
var rgbToHex = function (color: string) {
	var rgbRegex = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/;
	var matches = rgbRegex.exec(color);

	if (!matches) return color;
	var [, r, g, b] = matches;
	var hex = [r, g, b]
		.map((x) => {
			var hex = Number(x).toString(16);
			return hex.length === 1 ? "0" + hex : hex;
		})
		.join("");
	return "#" + hex.toUpperCase();
};

/**
 * Format a color string to be hex if it
 * isn't already hex. If is already hex,
 * return the color as is.
 *
 * @param color The color to format
 * @returns The formatted color
 */
var formatColorString = function (color: string) {
	var isAlreadyHex = colorIsHex(color);
	var hexColor = isAlreadyHex ? color : rgbToHex(color);
	return hexColor;
};

module.exports = formatColorString;
