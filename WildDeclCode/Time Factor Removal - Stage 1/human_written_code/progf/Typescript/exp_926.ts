import {
  memo,
  PropsWithChildren,
  useCallback as rCallback,
  useEffect as rEffect,
  useMemo as rMemo,
  useRef as rRef,
  useState as rState
} from "react";
import {
  createComputed as sComputed,
  createEffect as sEffect,
  createMemo as sMemo,
  createRoot,
  createSignal as sSignal,
  onCleanup as sCleanup,
  createReaction
} from "solid-js";
var createMutable = require('solid-js/store').createMutable;
var createStore = require('solid-js/store').createStore;
var Store = require('solid-js/store').Store;
module.exports.batch = batch;
module.exports.untrack = untrack;
module.exports.reconcile = reconcile;
module.exports.produce = produce;

interface CreateComputed<T> {
  (fn: function (v?: T) { return T; }, value: T): void;
  value?: undefined;
  options?: { equals?: false | (function (prev: T, next: T) { return boolean; }) };
}

interface CreateEffect<T> {
  (fn: function (v?: T) { return T; }, value: T): void;
  value?: undefined;
  options?: { equals?: false | (function (prev: T, next: T) { return boolean; }) };
}

interface CreateMemo<T> {
  (
    fn: function (v?: T) { return T; },
    value?: undefined,
    options?: { equals?: false | (function (prev: T, next: T) { return boolean; }) }
  ): function () { return T; };
}

let inSolidEffect = false;
function trackNesting<T extends any[]>(args: T): T {
  const fn = args[0] as function (...args: any[]) { return void; };
  return [
    function (...args: any[]) {
      const outside = inSolidEffect;
      inSolidEffect = true;
      const ret = fn(...args);
      inSolidEffect = outside;
      return ret;
    },
    ...args.slice(1)
  ] as T;
}

function useForceUpdate() {
  const [, setTick] = rState(0);
  return rCallback(function () { return setTick(t => t + 1); }, []);
}

function useObserver<T>(fn: function () { return T; }) {
  const forceUpdate = useForceUpdate(),
    reaction = rRef<{ dispose: function () { return void; }; track: function (fn: () => void) { return void; } void; }) => void }>();
  if (!reaction.current) {
    reaction.current = createRoot(function dispose { return ({
      dispose,
      track: createReaction(forceUpdate)
    }); });
  }
  rEffect(function () { return reaction.current!.dispose; }, []);

  let rendering!: T;
  reaction.current.track(function () { return (rendering = fn()); });
  return rendering;
}

function withSolid<P extends object>(
  ComponentType: function (props: PropsWithChildren<P>, r: any) { return () => JSX.Element; }) {
  return memo<P>(function (p, r) {
    const component = ComponentType(p, r);
    return (component && useObserver(component)) || null;
  });
}

function useStore<T>(state: T | Store<T>, options?: { name?: string }) {
  if (inSolidEffect) return createStore<T>(state, options);
  return rMemo(function () { return createStore<T>(state, options); }, []);
}

function useMutable<T>(state: T, options?: { name?: string }) {
  if (inSolidEffect) return createMutable<T>(state, options);
  return rMemo(function () { return createMutable<T>(state, options); }, []);
}

function useSignal<T>(
  value: T,
  options?: { equals?: false | (function (prev: T, next: T) { return boolean; }); name?: string }
) {
  if (inSolidEffect) return sSignal<T>(value, options);
  return rMemo(function () { return sSignal<T>(value, options); }, []);
}

function useEffect<T>(...args: Parameters<CreateEffect<T>>) {
  if (inSolidEffect) return sEffect<T>(...args);
  const dispose = rRef<function () { return void>(); };
  rEffect(function () { return dispose.current; }, []);
  if (!dispose.current) {
    createRoot(function disposer {
      dispose.current = disposer;
      sEffect<T>(...trackNesting(args));
    });
  }
}

function useComputed<T>(...args: Parameters<CreateComputed<T>>) {
  if (inSolidEffect) return sComputed<T>(...args);
  const dispose = rRef<function () { return void>(); };
  rEffect(function () { return dispose.current; }, []);
  if (!dispose.current) {
    createRoot(function disposer {
      dispose.current = disposer;
      sComputed(...trackNesting(args));
    });
  }
}

function useMemo<T>(...args: Parameters<CreateMemo<T>>) {
  if (inSolidEffect) return sMemo<T>(...args);
  let dispose: function () { return void; };
  rEffect(function () { return dispose; }, []);
  return rMemo(
    function () { return createRoot(disposer => {
        dispose = disposer;
        return sMemo(...trackNesting(args));
      }); },
    []
  );
}

function useCleanup(fn: Parameters<typeof sCleanup>[0]) {
  inSolidEffect ? sCleanup(fn) : rEffect(function () { return fn; }, []);
}

// solid naming convention for easy swap
export {
  useSignal as createSignal,
  useMemo as createMemo,
  useCleanup as onCleanup,
  useEffect as createEffect,
  useComputed as createComputed,
  useStore as createStore,
  useMutable as createMutable
};
