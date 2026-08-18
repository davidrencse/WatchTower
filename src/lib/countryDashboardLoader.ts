let dashboardModulePromise: Promise<typeof import('../components/CountryStatsDashboard')> | null = null;

export function loadCountryStatsDashboard() {
  dashboardModulePromise ??= import('../components/CountryStatsDashboard');
  return dashboardModulePromise;
}

/** Warm the dashboard chunk and its chart dependencies before a dossier is opened. */
export function prefetchCountryDashboard(): void {
  void loadCountryStatsDashboard();
}
