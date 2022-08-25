import { nodeOps } from "./nodeOps";
import { patchProp } from "./patchProp";
import { createRenderer } from "@vue/runtime-core";

const renderOptions = Object.assign(nodeOps, { patchProp });

console.log(renderOptions);

// createRenderer(renderOptions).render(h('h1','hello'))

export function render(vnode, container) {
  console.log("createRenderer-----", createRenderer(renderOptions));

  createRenderer(renderOptions).render(vnode, container);
}

export * from "@vue/runtime-core";
