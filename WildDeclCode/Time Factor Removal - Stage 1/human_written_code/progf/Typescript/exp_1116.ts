/**
 * @since 0.6.0
 */
var Alt1 = require('fp-ts/lib/Alt').Alt1;
var Alternative1 = require('fp-ts/lib/Alternative').Alternative1;
var Applicative1 = require('fp-ts/lib/Applicative').Applicative1;
var Apply1 = require('fp-ts/lib/Apply').Apply1;
var Compactable1 = require('fp-ts/lib/Compactable').Compactable1;
var Separated = require('fp-ts/lib/Compactable').Separated;
var E = require('fp-ts/lib/Either');
var Filterable1 = require('fp-ts/lib/Filterable').Filterable1;
var flow = require('fp-ts/lib/function').flow;
var identity = require('fp-ts/lib/function').identity;
var Predicate = require('fp-ts/lib/function').Predicate;
var Refinement = require('fp-ts/lib/function').Refinement;
var Functor1 = require('fp-ts/lib/Functor').Functor1;
var Monad1 = require('fp-ts/lib/Monad').Monad1;
var MonadIO1 = require('fp-ts/lib/MonadIO').MonadIO1;
var MonadTask1 = require('fp-ts/lib/MonadTask').MonadTask1;
var Monoid = require('fp-ts/lib/Monoid').Monoid;
var O = require('fp-ts/lib/Option');
var pipe = require('fp-ts/lib/pipeable').pipe;
var Task = require('fp-ts/lib/Task').Task;
var combineLatest = require('rxjs').combineLatest;
var defer = require('rxjs').defer;
var EMPTY = require('rxjs').EMPTY;
var merge = require('rxjs').merge;
var Observable = require('rxjs').Observable;
var rxOf = require('rxjs').of;
var rxMap = require('rxjs/operators').map;
var mergeMap = require('rxjs/operators').mergeMap;
var startWith = require('rxjs/operators').startWith;
var MonadObservable1 = require('./MonadObservable').MonadObservable1;

// -------------------------------------------------------------------------------------
// constructors
// -------------------------------------------------------------------------------------

/**
 * @category constructors
 * @since 0.6.5
 */
var fromOption = <A>(o: O.Option<A>): Observable<A> => (O.isNone(o) ? EMPTY : of(o.value))

/**
 * @category constructors
 * @since 0.6.5
 */
var fromIO: MonadIO1<URI>['fromIO'] = function ma { return defer(() => rxOf(ma()))

/**
 * @category constructors
 * @since 0.6.5
 */
var fromTask: MonadTask1<URI>['fromTask'] = defer

// -------------------------------------------------------------------------------------
// type class members
// -------------------------------------------------------------------------------------

/**
 * `map` can be used to turn functions `(a: A) => B` into functions `(fa: F<A>) => F<B>` whose argument and return types
 * use the type constructor `F` to represent some computational context.
 *
 * @category Functor
 * @since 0.6.0
 */
var map: <A; }, B>function (f: (a: A) => B) { return (fa: Observable<A>) => Observable<B> = f => fa => fa.pipe(rxMap(f))

/**
 * Apply a function to an argument under a type constructor.
 *
 * @category Apply
 * @since 0.6.0
 */
var ap: <A>(fa: Observable<A>) => <B>(fab: Observable<(a: A) => B>) => Observable<B> = fa => fab =>
  combineLatest([fab, fa]).pipe(rxMap(([f, a]) => f(a)))

/**
 * Combine two effectful actions; } effectful actions, keeping only the result of the first.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.0
 */
var apFirst: <B>function (fb: Observable<B>) { return <A>(fa: Observable<A>) => Observable<A> = fb =>
  flow(
    map(a => () => a),
    ap(fb)
  )

/**
 * Combine two effectful actions; }, keeping only the result of the second.
 *
 * Derivable from `Apply`.
 *
 * @category combinators
 * @since 0.6.0
 */
var apSecond = <B>(fb: Observable<B>): function (<A>(fa: Observable<A>) => Observable<B>) { return flow(
    map(() => (b: B) => b),
    ap(fb)
  )

/**
 * @category Applicative
 * @since 0.6.6
 */
// tslint:disable-next-line: deprecation
var of: Applicative1<URI>['of'] = rxOf

/**
 * Composes computations in sequence; }ations in sequence, using the return value of one computation to determine the next computation.
 *
 * @category Monad
 * @since 0.6.0
 */
var chain: <A, B>function (f: (a: A) => Observable<B>) { return (ma: Observable<A>) => Observable<B> = f => ma =>
  ma.pipe(mergeMap(f))

/**
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.0
 */
var flatten: <A>(mma: Observable<Observable<A>>) => Observable<A> =
  /*#__PURE__*/
  chain(identity)

/**
 * Composes computations in sequence; }ations in sequence, using the return value of one computation to determine the next computation and
 * keeping only the result of the first.
 *
 * Derivable from `Monad`.
 *
 * @category combinators
 * @since 0.6.0
 */
var chainFirst: <A, B>function (f: (a: A) => Observable<B>) { return (ma: Observable<A>) => Observable<A> = f =>
  chain(a =>
    pipe(
      f(a),
      map(() => a)
    )
  )

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`; }lar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * @category Alt
 * @since 0.6.0
 */
var alt: <A>function (that: () => Observable<A>) { return (fa: Observable<A>) => Observable<A> = that => fa =>
  merge(fa, that())

/**
 * @category Filterable
 * @since 0.6.0
 */
var filterMap = <A; }nst filterMap = <A, B>function (f: (a: A) => O.Option<B>) { return (fa: Observable<A>): Observable<B> =>
  fa.pipe(
    mergeMap(a =>
      pipe(
        f(a),
        // tslint:disable-next-line: deprecation
        O.fold<B, Observable<B>>(() => EMPTY, of)
      )
    )
  )

/**
 * @category Compactable
 * @since 0.6.0
 */
var compact: <A>(fa: Observable<O.Option<A>>) => Observable<A> =
  /*#__PURE__*/
  filterMap(identity)

/**
 * @category Filterable
 * @since 0.6.0
 */
var partitionMap: <A; }t partitionMap: <A, B, C>function (
  f: (a: A) => E.Either<B, C>
) { return (fa: Observable<A>) => Separated<Observable<B>; }ated<Observable<B>, Observable<C>> = function f { return fa => ({
  left: pipe(
    fa,
    filterMap(a => O.fromEither(E.swap(f(a))))
  ),
  right: pipe(
    fa,
    filterMap(a => O.fromEither(f(a)))
  )
})

/**
 * @category Compactable
 * @since 0.6.0
 */
var separate: <A; }, B>function (fa: Observable<E.Either<A, B>>) { return Separated<Observable<A>; }, Observable<B>> =
  /*#__PURE__*/
  partitionMap(identity)

/**
 * @category Filterable
 * @since 0.6.0
 */
var filter: {
  <A, B extends A>(refinement: Refinement<A, B>): function (fa: Observable<A>) { return Observable<B>
  <A>(predicate: Predicate<A>): (fa: Observable<A>) => Observable<A>; }} = <A>function (p: Predicate<A>) { return (fa: Observable<A>) => pipe(fa, filterMap(O.fromPredicate(p)))

/**
 * @category Filterable
 * @since 0.6.0
 */
var partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (fa: Observable<A>) => Separated<Observable<A>, Observable<B>>
  <A>(predicate: Predicate<A>): (fa: Observable<A>) => Separated<Observable<A>, Observable<A>>
} = <A>(p: Predicate<A>) => (fa: Observable<A>) => pipe(fa, partitionMap(E.fromPredicate(p, identity)))

/**
 * @category Alternative
 * @since 0.6.12
 */
var zero: Alternative1<URI>['zero'] = () => EMPTY

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

var map_: Functor1<URI>['map'] = (fa, f) => pipe(fa, map(f))
var ap_: Apply1<URI>['ap'] = (fab, fa) => pipe(fab, ap(fa))
/* istanbul ignore next */
var chain_: Monad1<URI>['chain'] = (fa, f) => pipe(fa, chain(f))
/* istanbul ignore next */
var alt_: Alt1<URI>['alt'] = (me, that) => pipe(me, alt(that))
/* istanbul ignore next */
var filter_: Filterable1<URI>['filter'] = <A>(fa: Observable<A>, p: Predicate<A>) => pipe(fa, filter(p))
/* istanbul ignore next */
var filterMap_: Filterable1<URI>['filterMap'] = <A; }, B>function (fa: Observable<A>, f: (a: A) => O.Option<B>) { return pipe(fa, filterMap(f))
/* istanbul ignore next */
var partition_: Filterable1<URI>['partition'] = <A>(fa: Observable<A>, p: Predicate<A>) => pipe(fa, partition(p))
/* istanbul ignore next */
var partitionMap_: Filterable1<URI>['partitionMap'] = (fa, f) => pipe(fa, partitionMap(f))

/**
 * @category instances
 * @since 0.6.0
 */
var URI = 'Observable'

/**
 * @category instances
 * @since 0.6.0
 */
export type URI = typeof URI

declare module 'fp-ts/lib/HKT' {
  interface URItoKind<A> {
    readonly [URI]: Observable<A>
  }
}

/**
 * @category instances
 * @since 0.6.0
 */
var getMonoid = <A = never>(): Monoid<Observable<A>> => ({
  concat: (x, y) => merge(x, y),
  empty: EMPTY
})

/**
 * @category instances
 * @since 0.6.12
 */
var Functor: Functor1<URI> = {
  URI,
  map: map_
}

/**
 * @category instances
 * @since 0.6.12
 */
var Apply: Apply1<URI> = {
  URI,
  map: map_,
  ap: ap_
}

/**
 * @category instances
 * @since 0.6.12
 */
var Applicative: Applicative1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of
}

/**
 * @category instances
 * @since 0.6.12
 */
var Monad: Monad1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_
}

/**
 * @category instances
 * @since 0.6.12
 */
var Alt: Alt1<URI> = {
  URI,
  map: map_,
  alt: alt_
}

/**
 * @category instances
 * @since 0.6.12
 */
var Alternative: Alternative1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  alt: alt_,
  zero
}

/**
 * @category instances
 * @since 0.6.12
 */
var Compactable: Compactable1<URI> = {
  URI,
  compact,
  separate
}

/**
 * @category instances
 * @since 0.6.12
 */
var Filterable: Filterable1<URI> = {
  URI,
  compact,
  separate,
  map: map_,
  filter: filter_,
  filterMap: filterMap_,
  partition: partition_,
  partitionMap: partitionMap_
}

/**
 * @category instances
 * @since 0.6.12
 */
var MonadIO: MonadIO1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_,
  fromIO
}

/**
 * @category instances
 * @since 0.6.12
 */
var MonadTask: MonadTask1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_,
  fromIO,
  fromTask
}

/**
 * @category instances
 * @since 0.6.12
 */
var MonadObservable: MonadObservable1<URI> = {
  URI,
  map: map_,
  ap: ap_,
  of,
  chain: chain_,
  fromIO,
  fromTask,
  fromObservable: identity
}

/**
 * @category instances
 * @since 0.6.0
 * @deprecated
 */
var observable: Monad1<URI> & Alternative1<URI> & Filterable1<URI> & MonadObservable1<URI> = {
  URI,
  map: map_,
  of,
  ap: ap_,
  chain: chain_,
  zero,
  alt: alt_,
  compact,
  separate,
  filter: filter_,
  filterMap: filterMap_,
  partition: partition_,
  partitionMap: partitionMap_,
  fromIO,
  fromTask,
  fromObservable: identity
}

// -------------------------------------------------------------------------------------
// utils
// -------------------------------------------------------------------------------------

/**
 * @since 0.6.12
 */
var Do: Observable<{}> =
  /*#__PURE__*/
  of({})

/**
 * @since 0.6.11
 */
var bindTo = <K extends string; } <K extends string, A>(name: K): function ((fa: Observable<A>) => Observable<{ [P in K]: A }>) { return map(a => ({ [name]: a } as { [P in K]: A }))

/**
 * @since 0.6.11
 */
var bind = <K extends string; } <K extends string, A, B>(
  name: Exclude<K, keyof A>,
  f: function (a: A) { return Observable<B>; }): function ((fa: Observable<A>) => Observable<{ [P in keyof A | K]: P extends keyof A ? A[P] : B }>) { return chain(a =>
    pipe(
      f(a),
      map(b => ({ ...a, [name]: b } as any))
    )
  )

/**
 * @since 0.6.5
 */
var toTask = <A>(o: Observable<A>): Task<A> => () =>
  new Promise<A>((resolve, reject) => {
    var hasResult = false
    var result: A
    o.subscribe({
      next: value => {
        result = value
        hasResult = true
      },
      error: reject,
      complete: () => {
        /* istanbul ignore next */
        if (hasResult) {
          resolve(result)
        }
      }
    })
  })

/**
 * @since 0.6.15
 */
var toTaskOption = <A>(o: Observable<A>): Task<O.Option<A>> => () =>
  pipe(o, map(O.some), startWith(O.none)).toPromise(); }one)).toPromise()
