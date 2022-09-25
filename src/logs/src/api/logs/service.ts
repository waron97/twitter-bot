export const processLogFilters = (params: any) => {
  const { since, appId, levels, text } = params;
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

  if (text) {
    filters.$or = [
      { location: { $regex: text, $options: 'im' } },
      { message: { $regex: text, $options: 'im' } },
    ];
  }

  return filters;
};
