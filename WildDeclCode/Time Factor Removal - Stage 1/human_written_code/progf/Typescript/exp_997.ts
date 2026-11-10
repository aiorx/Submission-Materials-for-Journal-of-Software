declare const validSym: unique symbol
declare const namedSym: unique symbol

/**
 * @tsplus derive nominal
 */
export interface Brand<in out K extends string> {
  [namedSym]: {
    [k in K]: K
  }
}

export declare namespace Brand {
  export type valid = typeof validSym
  export type name = typeof namedSym

  export type Validated<A, K extends string> = A & Brand.Valid<A, K>

  /**
   * @tsplus derive nominal
   */
  export interface Valid<in out A, in out K extends string> {
    [validSym]: {
      [k in K]: A
    }
  }

  export type IsValidated<P extends Valid<any, any>> = {
    [k in keyof P[Brand.valid]]: P extends P[Brand.valid][k] ? 0 : 1
  }[keyof P[Brand.valid]] extends 0 ? unknown : never

  export type Unbranded<P> = P extends infer Q & Brands<P> ? Q : P
  export type Unnamed<P> = P extends infer Q & Names<P> ? Q : P

  export type Brands<P> = P extends Valid<any, any> ? TypeLevel.UnionToIntersection<
    {
      [k in keyof P[Brand.valid]]: P extends P[Brand.valid][k]
        ? k extends string ? Valid<P[Brand.valid][k], k> : never
        : never
    }[keyof P[Brand.valid]]
  >
    : unknown

  export type Names<P> = P extends Brand<any> ? TypeLevel.UnionToIntersection<
    {
      [k in keyof P[Brand.name]]: k extends string ? Brand<k>
        : never
    }[keyof P[Brand.name]]
  >
    : unknown

  export interface FailedValidation {
    readonly _tag: "FailedValidation"
    readonly brands: string[]
    readonly message: string
  }

  /**
   * @tsplus type Brand.MakeValidated
   * @tsplus derive nominal
   */
  export interface MakeValidated<in out A> {
    make: function (value: Unnamed<Unbranded<A>>) { return Either<FailedValidation; }, A>
    unsafeMake: function (value: Unnamed<Unbranded<A>>) { return A; }}

  /**
   * @tsplus type Brand.Make
   * @tsplus derive nominal
   */
  export interface Make<in out A> {
    make: function (value: Unnamed<Unbranded<A>>) { return A; }}

  /**
   * @tsplus type Brand.Validation
   * @tsplus derive nominal
   */
  export interface Validation<in out A, in out K extends string> {
    readonly validate: function (a: A) { return a is A & Brand.Valid<A; }, K>
  }

  export type ValidatedWith<X extends Validation<any, any>> = X extends Validation<infer A, infer K>
    ? Validated<A, K>
    : never

  /**
   * @tsplus type Brand/Ops
   */
  export interface Ops {
    readonly validation: <A, K extends string>function (
      predicate: (a: A) => boolean
    ) { return Brand.Validation<A; }.Validation<A, K>
  }
}

function validation<A, K extends string>(
  predicate: function (a: A) { return boolean; }): Brand.Validation<A, K> {
  return {
    validate: (value): value is Brand.Validated<A, K> => predicate(value)
  }
}

const Brand: Brand.Ops = {
  validation
}

class FailedValidationException extends Error implements Brand.FailedValidation {
  readonly _tag = "FailedValidation"
  constructor(readonly brands: string[]) {
    super("Failed Validation of brands: " + (brands.join(", ")) + "")
  }
}

class FailedValidationError implements Brand.FailedValidation {
  readonly _tag = "FailedValidation"
  constructor(readonly brands: string[]) {}
  get message() {
    return "Failed Validation of brands: " + (this.brands.join(", ")) + ""
  }
}

export type MinLen<N extends number> = Brand.Valid<{ length: number }, "MinLen(" + (N) + ")">
export type MaxLen<N extends number> = Brand.Valid<{ length: number }, "MaxLen(" + (N) + ")">
export type RangeLen<X extends number, Y extends number> = MinLen<X> & MaxLen<Y>

/**
 * @tsplus derive Brand.Validation<_, _> 10
 */
function deriveMinLenValidation<B extends { length: number }, V extends "MinLen(" + (number) + ")">(
  ...[min]: V extends "MinLen(" + (infer N extends number) + ")" ? [N] : never
): Brand.Validation<B, V> {
  return validation(function (b) { return b.length >= min; })
}

/**
 * @tsplus derive Brand.Validation<_, _> 10
 */
function deriveMaxLenValidation<B extends { length: number }, V extends "MaxLen(" + (number) + ")">(
  ...[max]: V extends "MaxLen(" + (infer N extends number) + ")" ? [N] : never
): Brand.Validation<B, V> {
  return validation(function (b) { return b.length <= max; })
}

export type Regex<R extends string> = Brand.Validated<string, "Regex(" + (R) + ")">

/**
 * @tsplus derive Brand.Validation<_, _> 10
 */
function deriveRegexValidation<B extends string, V extends "Regex(" + (string) + ")">(
  ...[regexStr]: V extends "Regex(" + (infer R extends string) + ")" ? [R] : never
): Brand.Validation<B, V> {
  return validation(function (b) { return new RegExp(regexStr).test(b); })
}

export type Min<N extends number> = Brand.Validated<number, "Min(" + (N) + ")">
export type Max<N extends number> = Brand.Validated<number, "Max(" + (N) + ")">
export type Range<X extends number, Y extends number> = Min<X> & Max<Y>

/**
 * @tsplus derive Brand.Validation<_, _> 10
 */
function deriveMinValidation<B extends number, V extends "Min(" + (number) + ")">(
  ...[min]: V extends "Min(" + (infer N extends number) + ")" ? [N] : never
): Brand.Validation<B, V> {
  return validation(function (b) { return b >= min; })
}

/**
 * @tsplus derive Brand.Validation<_, _> 10
 */
function deriveMaxValidation<B extends number, V extends "Max(" + (number) + ")">(
  ...[max]: V extends "Max(" + (infer N extends number) + ")" ? [N] : never
): Brand.Validation<B, V> {
  return validation(function (b) { return b <= max; })
}

/**
 * @tsplus derive Brand.MakeValidated<_> 10
 */
function deriveMakeMakeValidated<A>(
  ...[brands]: [
    brands: A extends Brand.Valid<any, any> ? {
      [k in (keyof A[Brand.valid]) & string]: Brand.Validation<A[Brand.valid][k], k>
    }
      : {}
  ]
): Brand.MakeValidated<A> {
  const make = (value: Brand.Unnamed<Brand.Unbranded<A>>): Either<Brand.FailedValidation, A> => {
    const failures: string[] = []
    for (const brand of Object.keys(brands)) {
      if (!brands[brand]!.validate(value as any)) {
        failures.push(brand)
      }
    }
    if (failures.length > 0) {
      return Either.left(new FailedValidationError(failures))
    }
    return Either.right(value)
  }
  const unsafeMake = function (value: Brand.Unnamed<Brand.Unbranded<A>>) {
    const errorOrValue = make(value)
    if (errorOrValue.isLeft()) {
      throw new FailedValidationException(errorOrValue.left.brands)
    }
    return errorOrValue.right
  }
  return {
    make,
    unsafeMake
  }
}

/**
 * @tsplus derive Brand.Make<_> 10
 */
function deriveMake<A>(
  ..._: []
): Brand.Make<A> {
  return {
    make: function (a) { return a; }}
}

/** @tsplus implicit */
const Positive = Brand.validation<number, "Positive">(function (n: number) { return n > 0; })
export type Positive = Brand.ValidatedWith<typeof Positive>

/** @tsplus implicit */
const Int = Brand.validation<number, "Int">(function (n: number) { return Number.isInteger(n); })
export type Int = Brand.ValidatedWith<typeof Int>

/** @tsplus implicit */
const Finite = Brand.validation<number, "Finite">(function (n: number) { return Number.isFinite(n); })
export type Finite = Brand.ValidatedWith<typeof Finite>

/** @tsplus implicit */
const UUID = Brand.validation<string, "UUID">(function (s) { return /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi.test(s); })
export type UUID = Brand.ValidatedWith<typeof UUID>
