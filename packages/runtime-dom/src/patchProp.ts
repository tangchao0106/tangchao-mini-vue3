import { patchClass } from "../modules/class";
import { patchStyle } from "../modules/style";

import { patchAttr } from "../modules/attr";

import { patchEvent } from "../modules/event";

// 封装dom的api操作
export function patchProp(el, key, preValue, nextValue) {
  //classname
  if (key === "class") {
    patchClass(el, nextValue);
  } else if (key === "style") {
    patchStyle(el, preValue, nextValue);
  } else if (/^on[^a-z]/.test(key)) {
    patchEvent(el, key, nextValue);
  } else {
    patchAttr(el, key, nextValue);
  }

  //style
  //event
  //属性
}
