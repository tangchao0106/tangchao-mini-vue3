export function patchAttr(el, key, nextValue) {
  if (nextValue) {
    el.setAttribute(nextValue);
  } else {
    el.removeAttribute(key);
  }
}
