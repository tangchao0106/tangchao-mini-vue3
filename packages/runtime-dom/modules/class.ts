export function patchClass(el, nextValue) {
      //值-替换为null
  if (nextValue == null) {
  
    el.removeAtrribute("class");
  } else {
    el.classname = nextValue;
  }
}
