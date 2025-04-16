export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value || value === 0) {
      query.append(key, value);
    }
  });
  return query.toString();
};
