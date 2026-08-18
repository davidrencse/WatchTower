/**
 * Squarified treemap layout (Bruls, Huizing & van Wijk, 2000).
 *
 * Used by the births panel to give every country an area proportional to its share. The
 * reference graphic this panel follows uses a Voronoi treemap; a squarified one carries the
 * same encoding — area is the quantity, nesting is the region — while producing rectangles
 * with near-1:1 aspect ratios, which is what makes small cells legible enough to label. It is
 * also ~70 lines with no dependency, where a weighted-Voronoi relaxation would need a
 * geometry library the 200 KB initial-bundle budget cannot absorb.
 */

export interface TreemapNode<T> {
  value: number;
  datum: T;
}

export interface TreemapRect<T> {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
  datum: T;
}

interface Frame {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Worst (largest) aspect ratio in a row, given the row's total and the side it lays along. */
function worstRatio(row: number[], rowSum: number, side: number, scale: number): number {
  if (rowSum <= 0 || side <= 0) return Infinity;
  const areaSum = rowSum * scale;
  const sideSquared = side * side;
  const areaSumSquared = areaSum * areaSum;
  let worst = 0;
  for (const value of row) {
    const area = value * scale;
    if (area <= 0) continue;
    worst = Math.max(worst, (sideSquared * area) / areaSumSquared, areaSumSquared / (sideSquared * area));
  }
  return worst;
}

/**
 * Lay `nodes` out inside the given frame. Input order does not matter — nodes are sorted
 * descending internally, which the algorithm requires. Non-positive values are dropped.
 */
export function squarify<T>(
  nodes: readonly TreemapNode<T>[],
  frame: Frame,
): TreemapRect<T>[] {
  const items = nodes.filter((node) => node.value > 0).sort((a, b) => b.value - a.value);
  const total = items.reduce((sum, node) => sum + node.value, 0);
  if (!items.length || total <= 0 || frame.width <= 0 || frame.height <= 0) return [];

  const out: TreemapRect<T>[] = [];
  // Value → pixel² conversion, held constant so every rect is comparable across the layout.
  const scale = (frame.width * frame.height) / total;

  let { x, y, width, height } = frame;
  let index = 0;

  while (index < items.length) {
    const side = Math.min(width, height);
    const row: number[] = [];
    let rowSum = 0;

    // Grow the row while doing so improves the worst aspect ratio in it.
    while (index < items.length) {
      const next = items[index].value;
      const current = worstRatio(row, rowSum, side, scale);
      const candidate = worstRatio([...row, next], rowSum + next, side, scale);
      if (row.length && candidate > current) break;
      row.push(next);
      rowSum += next;
      index += 1;
    }

    // Thickness of the strip this row occupies, perpendicular to `side`.
    const thickness = (rowSum * scale) / side;
    const horizontal = width >= height;
    let offset = 0;

    for (let i = 0; i < row.length; i++) {
      const node = items[index - row.length + i];
      const extent = (node.value * scale) / thickness;
      out.push(
        horizontal
          ? { x, y: y + offset, width: thickness, height: extent, value: node.value, datum: node.datum }
          : { x: x + offset, y, width: extent, height: thickness, value: node.value, datum: node.datum },
      );
      offset += extent;
    }

    if (horizontal) {
      x += thickness;
      width -= thickness;
    } else {
      y += thickness;
      height -= thickness;
    }
    if (width <= 0.01 || height <= 0.01) break;
  }

  return out;
}
