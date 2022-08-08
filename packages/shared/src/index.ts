export const isObject = (value) => {
  return typeof value === "object" && value !== null;
};

export const isFunction = (value) => {
  return typeof value === "function" && value != null;
};
