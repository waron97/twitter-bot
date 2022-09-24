export const processLogFilters = (params: any) => {
  const { since, appId, levels } = params;
  const filters: { [key: string]: any } = {};

  if (since) {
    filters.date = {
      $gt: since,
    };
  }

  if (appId) {
    filters.appId = appId;
  }

  if (levels && levels.length) {
    filters.level = { $in: levels };
  }

  return filters;
};
