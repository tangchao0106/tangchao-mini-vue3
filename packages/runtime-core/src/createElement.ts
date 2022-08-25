//创建真实dom，将虚拟vnode 创建未dom
export function createElement(vnode) {
  console.log("目的是把虚拟节点", vnode, "真正变为dom");

  let domNode = document.createElement(vnode.sel);
  if (
    (vnode.text != "" && vnode.children == undefined) ||
    vnode.children.length === 0
  ) {
    domNode.innerText = vnode.text;
  }
  console.log("domNo====", domNode);

  vnode.elm = domNode;
  // 返回elm，
  return vnode.elm;
}
