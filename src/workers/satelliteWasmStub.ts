/**
 * Stands in for satellite.js's optional WASM runtimes (`#wasm-single-thread` /
 * `#wasm-multi-thread`), which are aliased to this file in `vite.config.ts`.
 *
 * The propagator only uses the JS SGP4 entry points (`twoline2satrec`, `propagate`, `gstime`,
 * `eciToGeodetic`). The WASM builds are reachable solely through `createSingleThreadRuntime()` /
 * `createMultiThreadRuntime()`, which nothing here calls — but Vite still follows the dynamic
 * import and would otherwise inline a multi-megabyte Emscripten module (one that also reaches for
 * `node:worker_threads`) into the browser bundle.
 */
export default function unavailableWasmRuntime(): never {
  throw new Error(
    '[satellites] the satellite.js WASM runtime is stubbed out — this build uses the JS SGP4 path',
  );
}
