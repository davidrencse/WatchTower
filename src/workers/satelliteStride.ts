/**
 * Floats per satellite in the worker's packed position buffer:
 * `[mercatorX, mercatorY, altitudeMetres, ecefX, ecefY, ecefZ]`.
 *
 * Kept in its own module so the renderer can import the layout without pulling the worker (and
 * with it satellite.js) into the main bundle.
 */
export const SAT_STRIDE = 6;
