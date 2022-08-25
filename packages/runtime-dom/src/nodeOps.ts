export const nodeOps = {
  // 增加删除修改查询

  insert(child, parent, anchor = null) {
    parent.insertBefore(child, anchor);
  },

  remove(child) {
    const parentNode = child.parent;
    if (parentNode) {
      parentNode.removeChild(child);
    }
  },

  setElementText(el, text) {
    el.textContent = text;
  },

  setText(node, text) {
    node.nodeValue = text;
  },

  querySelector(selector) {
    return document.querySelector(selector);
  },
  nextSibling(node) {
    return node.nextSibling;
  },
  //创建元素，创建文本
  createElement(tarname) {
    return document.createElement(tarname);
  },

  createText(text) {
    return document.createTextNode(text);
  },
};
