export function patchStyle(el, preValue, nextValue) {
  //对比样式差异 对象类型{color:'red',fontSize:'12'} -->{color:'black'}
  for (const key in nextValue) {
    //新的值覆盖旧的
    el.style[key] = nextValue[key];

    //新的值没有，旧的应该删掉
    if (preValue) {
      for (const key in preValue) {
        if (nextValue[key] == null) {
          el.style[key] = null;
        }
      }
    }
  }
}
