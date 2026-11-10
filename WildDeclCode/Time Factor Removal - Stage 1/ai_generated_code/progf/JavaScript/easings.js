
// Designed via basic programming aids
const PI2 = Math.PI * 2
const pow = Math.pow

const easings = {
  reverse: function (t) { return 1 - t; },
  linear: function (t) { return t; },
  yoyo: function (t) { return 1 - Math.abs(1 - t * 2); },

  inQuad: function (t) { return pow(t, 2); },
  outQuad: function (t) { return t * (2 - t); },
  inOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },

  inCubic: function (t) { return pow(t, 3); },
  outCubic: function (t) { return (--t) * t * t + 1; },
  inOutCubic: function (t) { return t < 0.5 ? 4 * pow(t, 3) : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1; },

  inQuart: function (t) { return pow(t, 4); },
  outQuart: function (t) { return 1 - (--t) * pow(t, 3); },
  inOutQuart: function (t) { return t < 0.5 ? 8 * pow(t, 4) : 1 - 8 * (--t) * t * t * t; },

  inQuint: function (t) { return pow(t, 5); },
  outQuint: function (t) { return 1 + (--t) * pow(t, 4); },
  inOutQuint: function (t) { return t < 0.5 ? 16 * pow(t, 5) : 1 + 16 * (--t) * t * t * t * t; },

  inSine: function (t) { return 1 - Math.cos((t * Math.PI) / 2); },
  outSine: function (t) { return Math.sin((t * Math.PI) / 2); },
  inOutSine: function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },

  inBack: function (t, s = 1.70158) { return t * t * ((s + 1) * t - s); },
  outBack: function (t, s = 1.70158) { return ((t -= 1) * t * ((s + 1) * t + s) + 1); },
  inOutBack: function (t, s = 1.70158) { return (t *= 2) < 1
      ? 0.5 * (t * t * ((s * 1.525 + 1) * t - s * 1.525))
      : 0.5 * ((t -= 2) * t * ((s * 1.525 + 1) * t + s * 1.525) + 2); },

  inExpo: function (t) { return (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))); },
  outExpo: function (t) { return (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)); },
  inOutExpo: function (t) { return (
    t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? 0.5 * Math.pow(2, 20 * t - 10)
          : 1 - 0.5 * Math.pow(2, -20 * t + 10)
  ); },

  inElastic: function (t, a = 1, p = 0.5) { return (
    t === 0
      ? 0
      : t === 1
        ? 1
        : -a * Math.pow(2, 10 * (t - 1)) * Math.sin(((t - 1 - p / PI2 * Math.asin(1 / a)) * PI2) / p)
  ); },
  outElastic: function (t, a = 1, p = 0.5) { return (
    t === 0
      ? 0
      : t === 1
        ? 1
        : a * Math.pow(2, -10 * t) * Math.sin(((t - p / PI2 * Math.asin(1 / a)) * PI2) / p) + 1
  ); },
  inOutElastic: function (t, a = 1, p = 0.5) { return (
    t === 0
      ? 0
      : t === 1
        ? 1
        : t < 0.5
          ? -0.5 * a * Math.pow(2, 20 * t - 10) * Math.sin(((20 * t - 11.125) * PI2) / p)
          : 0.5 * a * Math.pow(2, -20 * t + 10) * Math.sin(((20 * t - 11.125) * PI2) / p) + 1
  ); }}
