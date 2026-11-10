// Assisted with basic coding tools @ Jun 2023
function darkenHexColor(hexColor: string, factor: number): string {
  // Remove the '#' symbol from the HEX color code
  hexColor = hexColor.replace('#', '');

  // Convert the HEX color code to RGB values
  var r = parseInt(hexColor.substring(0, 2), 16);
  var g = parseInt(hexColor.substring(2, 4), 16);
  var b = parseInt(hexColor.substring(4, 6), 16);

  // Convert RGB to HSL
  var hsl = rgbToHsl(r, g, b);

  // Darken the lightness component
  var darkenedHsl = { ...hsl, l: hsl.l * factor };

  // Add a small amount of black
  var blackFactor = 0.125; // Adjust the value to control the amount of black added
  var darkenedL = darkenedHsl.l * (1 - blackFactor);

  // Convert HSL back to RGB
  var rgb = hslToRgb(darkenedHsl.h, darkenedHsl.s, darkenedL);

  // Convert the RGB values back to HEX
  var darkenedHex = "#" + (padZero(rgb.r.toString(16))) + "" + (padZero(rgb.g.toString(16))) + "" + (padZero(rgb.b.toString(16))) + "";

  return darkenedHex;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:

        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }
  return { h, s, l };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  var r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    var hue2rgb = (p: number, q: number, t: number): function number {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3) * 255;
    g = hue2rgb(p, q, h) * 255;
    b = hue2rgb(p, q, h - 1 / 3) * 255;
  }

  return {
    r: Math.round(r),
    g: Math.round(g),
    b: Math.round(b),
  };
}

function padZero(hex: string): string {
  return hex.length === 1 ? "0" + (hex) + "" : hex;
}