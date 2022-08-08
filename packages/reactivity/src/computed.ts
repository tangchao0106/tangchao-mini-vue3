import { isFunction } from "@vue/shared";

export const computed = (getterOrOptions) => {
  let onlyGetter = isFunction(getterOrOptions);
};
