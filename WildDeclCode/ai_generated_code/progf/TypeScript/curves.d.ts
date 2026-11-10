// Type definitions for pixl-curves
// Project: pixl-curves
// Definitions by: (Supported via standard programming aids)
// Minimum TypeScript Version: 4.5

/**
 * A Photoshop-style Curves engine for HTML5 Canvas pixels.
 * Methods are chainable unless noted otherwise.
 */
declare class Curve {
  /**
   * Construct a Curve instance bound to an existing canvas.
   * @param canvas A pre-created HTML5 Canvas.
   */
  constructor(canvas: HTMLCanvasElement);

  /** Canvas the curve instance is bound to. */
  readonly canvas: HTMLCanvasElement;
  /** 2D rendering context used internally. */
  readonly context: CanvasRenderingContext2D;
  /** Canvas width cached at construction time. */
  readonly width: number;
  /** Canvas height cached at construction time. */
  readonly height: number;

  /**
   * Reset current curve to a flat ramp.
   * Returns the instance for chaining.
   */
  reset(): this;

  /**
   * Build points into a 256-entry curve and apply on top of the current curve.
   * Provide channel-specific points or a single `rgb` curve that applies to R, G and B.
   * If `algo` is `"linear"`, linear interpolation is used; otherwise a monotone cubic
   * interpolation is used.
   */
  apply(opts: Curve.ApplyOptions): this;

  /**
   * Render the current curve to the canvas pixels.
   */
  render(): this;

  /**
   * Posterize using a stair-step curve with N levels.
   * Accepts either the number of levels or an options object.
   */
  posterize(levels: number): this;
  posterize(opts: Curve.PosterizeOptions): this;

  /**
   * Solarize using a ^-shaped curve.
   * `amount` is 0..100 (percentage).
   */
  solarize(opts: Curve.AmountWithChannels): this;

  /**
   * Invert with variable strength.
   * `amount` is 0..100 (percentage).
   */
  invert(opts: Curve.AmountWithChannels): this;

  /**
   * Color temperature adjustment. Positive warms (more red), negative cools (more blue).
   * `amount` is approximately -255..255.
   */
  temperature(amount: number): this;
  temperature(opts: Curve.TemperatureOptions): this;

  /**
   * Gamma adjustment. Typical range ~0.25..4. Defaults to 1 (no change).
   */
  gamma(amount: number): this;
  gamma(opts: Curve.GammaOptions): this;

  /**
   * Sepia tone (image should be pre-desaturated for a classic look).
   * `amount` is 0..100 (percentage).
   */
  sepia(amount: number): this;
  sepia(opts: Curve.SepiaOptions): this;

  /**
   * Normalize (stretch) contrast to expand the full range.
   * `amount` is 0..100 (percentage blend of the auto-stretch).
   */
  normalize(opts: Curve.NormalizeOptions): this;

  /**
   * Threshold to pure black/white at a given level (default 128).
   * Accepts either a level or an options object.
   */
  threshold(level: number): this;
  threshold(opts: Curve.ThresholdOptions): this;

  /**
   * Lighting adjustments: shadows and highlights (both -100..100).
   */
  lighting(opts: Curve.LightingOptions): this;

  /**
   * Midtone lighting adjustment (-100..100).
   */
  midtones(amount: number): this;
  midtones(opts: Curve.MidtonesOptions): this;

  /**
   * Exposure (camera-like) adjustment (-100..100).
   */
  exposure(amount: number): this;
  exposure(opts: Curve.ExposureOptions): this;

  /**
   * Brightness adjustment (-255..255).
   */
  brightness(amount: number): this;
  brightness(opts: Curve.BrightnessOptions): this;

  /**
   * Contrast adjustment (~-255..255). Positive increases; negative reduces.
   */
  contrast(amount: number): this;
  contrast(opts: Curve.ContrastOptions): this;

  /**
   * Desaturate the image to grayscale.
   */
  desaturate(): this;

  /**
   * Compute a histogram for all four channels.
   */
  histogram(): Curve.Histogram;

  /**
   * Generate a 256-entry curve from a set of points.
   * When given an array of Y values, X is spread evenly across 0..255.
   * When given [x, y] pairs, X must start at 0 and end at 255 (out-of-range is clamped).
   * If `algo` is `"linear"`, a linear interpolant is used; otherwise a monotone
   * cubic interpolant is used.
   * @protected
   */
  protected generateCurve(points: Curve.CurvePoints, algo?: string): number[];
}

declare namespace Curve {
  /** A curve can be expressed as an array of Y values, or an array of [x, y] pairs. */
  export type CurvePoints = number[] | Array<[number, number]>;

  /** Channel selector. Any combination like "rgb", "rgba", "r", "gb", etc. */
  export type Channels = string; // validated at runtime

  export interface ApplyOptions {
    /** RGB curve applied to R, G and B together. */
    rgb?: CurvePoints;
    /** Red channel curve. */
    red?: CurvePoints;
    /** Green channel curve. */
    green?: CurvePoints;
    /** Blue channel curve. */
    blue?: CurvePoints;
    /** Alpha channel curve. */
    alpha?: CurvePoints;
    /** Interpolation algorithm, e.g. "linear" for linear interpolation. */
    algo?: string;
  }

  export interface PosterizeOptions {
    /** Number of levels (>=1). Default 4. */
    levels?: number;
    /** Which channels to affect. Default "rgb". */
    channels?: Channels;
  }

  export interface AmountWithChannels {
    /** Strength (usually 0..100). */
    amount: number;
    /** Which channels to affect. Default "rgb". */
    channels?: Channels;
  }

  export interface TemperatureOptions {
    /** Positive warms (more red), negative cools (more blue). Roughly -255..255. */
    amount?: number;
  }

  export interface GammaOptions {
    /** Gamma value (e.g. 0.25..4). Default 1. */
    amount?: number;
    /** Which channels to affect. Default "rgb". */
    channels?: Channels;
  }

  export interface SepiaOptions {
    /** 0..100 percentage. */
    amount: number;
  }

  export interface NormalizeOptions {
    /** 0..100 percentage blend of the auto-stretch. */
    amount: number;
    /** Which channels to affect. Default "rgb". */
    channels?: Channels;
  }

  export interface ThresholdOptions {
    /** Threshold level 0..255. Default 128. */
    level?: number;
    /** Which channels to affect. Default "rgb". */
    channels?: Channels;
  }

  export interface LightingOptions {
    /** Enhance shadow detail (-100..100). */
    shadows?: number;
    /** Enhance highlight detail (-100..100). */
    highlights?: number;
    /** Which channels to affect. Default "rgb". */
    channels?: Channels;
  }

  export interface MidtonesOptions {
    /** Midtone adjustment (-100..100). */
    amount?: number;
    /** Which channels to affect. Default "rgb". */
    channels?: Channels;
  }

  export interface ExposureOptions {
    /** Exposure adjustment (-100..100). */
    amount?: number;
    /** Which channels to affect. Default "rgb". */
    channels?: Channels;
  }

  export interface BrightnessOptions {
    /** Brightness (-255..255). */
    amount?: number;
    /** Which channels to affect. Default "rgb". */
    channels?: Channels;
  }

  export interface ContrastOptions {
    /** Contrast (~-255..255). */
    amount?: number;
    /** Which channels to affect. Default "rgb". */
    channels?: Channels;
  }

  export interface Histogram {
    red: number[];
    green: number[];
    blue: number[];
    alpha: number[];
    redMax: number;
    greenMax: number;
    blueMax: number;
    alphaMax: number;
  }
}

/**
 * CommonJS export for Node/bundlers (`const Curve = require('pixl-curves')`).
 */
export = Curve;

/**
 * UMD-style global for script-tag usage.
 * When the library is loaded in a browser via a global script, a global `Curve`
 * constructor is available with this same shape.
 */
declare global {
  var Curve: typeof Curve;
}
