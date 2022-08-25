//创建虚拟节点，有组件，元素，文本
export function createVnode(sel, data, children, text, elm) {
  const key = data.key;
  return { sel, data, children, text, elm };
}
