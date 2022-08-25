import { createElement } from "./createElement";

export function createRenderer(renderOptions) {
  const render = (vnode, container) => {
    createElement(vnode);
  };
  return { render };
}
