import PropTypes from "prop-types";
import { Box } from "@chakra-ui/react";

/**
 * Renders a rounded box with a background color corresponding to the skill name based on the given colorMapping. 
 * It also calculates and sets the text color based on the background color to ensure good contrast and readability.
 * 
 * @param {string} tagName - The name of the tag, which determines its background color.
 * @param {Object} colorMapping - A mapping of skill names to hex color values.
 * 
 * @returns {JSX.Element} The rendered Tag component.
 * 
 * Assisted with basic coding tools- prompt used: can we have a react component that takes a text input.
 *   this represents a "skill" tag. the component jsx file will also contain a map of skills strings to hex color value. 
 *   for example "Python" will be black, "JavaScript" will be orange. it will be a rounded box.
 */
const Tag = ({ tagName, colorMapping }) => {
	const color = colorMapping[tagName] || "#CCCCCC"; // Default to gray if color not found
	
	// Function to determine text color based on background color
	const getTextColor = (bgColor) => {
		const hexToRGB = (hex) => {
			const bigint = parseInt(hex.slice(1), 16);
			const r = (bigint >> 16) & 255;
			const g = (bigint >> 8) & 255;
			const b = bigint & 255;
			return [r, g, b];
		};
		
		const [r, g, b] = hexToRGB(bgColor);
		// Calculate the relative luminance using the formula
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
		// Return black (#000000) for lighter backgrounds, white (#FFFFFF) for darker backgrounds
		return luminance > 0.5 ? "#000000" : "#FFFFFF";
	};
	
	const textColor = getTextColor(color);
	
	return (
		<Box
		  bg={color}
		  color={textColor}
		  px={[1, 1, 1.5, 2, 2.5]}
		  py={[1, 1, 1.5, 2, 2.5]}
		  borderRadius="20px"
		  display="inline-block"
		>
		  {tagName}
		</Box>
	  );
	};

Tag.propTypes = {
	tagName: PropTypes.string.isRequired,
	colorMapping: PropTypes.object.isRequired,
};

export default Tag;