import { createVnode } from "./vnode";
// * 形态①：h('div', {}, '文字')
// * 形态二：h('div', {}, [])
// * 形态三：h('div', {}, h())

export function h(sel, data, c) {
  if (arguments.length !== 3) {
    throw new Error("低配版h函数");
  }

  if (typeof c === "string" || typeof c === "number") {
    return createVnode(sel, data, undefined, c, undefined);
  }
}
