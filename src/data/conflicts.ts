/** Shared data contracts for curated conflict overlays rendered on the globe. */
export type ConflictCategory = {
  id: string;
  title: string;
  code: string;
  color: string;
  defaultOn: boolean;
};

export type ConflictEventPoint = {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  placeName: string;
  latitude: number;
  longitude: number;
};
