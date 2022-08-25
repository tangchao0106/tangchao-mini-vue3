var VueRuntimeDom = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/runtime-dom/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    createElement: () => createElement,
    createRenderer: () => createRenderer,
    h: () => h,
    render: () => render
  });

  // packages/runtime-dom/src/nodeOps.ts
  var nodeOps = {
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
    createElement(tarname) {
      return document.createElement(tarname);
    },
    createText(text) {
      return document.createTextNode(text);
    }
  };

  // packages/runtime-dom/modules/class.ts
  function patchClass(el, nextValue) {
    if (nextValue == null) {
      el.removeAtrribute("class");
    } else {
      el.classname = nextValue;
    }
  }

  // packages/runtime-dom/modules/style.ts
  function patchStyle(el, preValue, nextValue) {
    for (const key in nextValue) {
      el.style[key] = nextValue[key];
      if (preValue) {
        for (const key2 in preValue) {
          if (nextValue[key2] == null) {
            el.style[key2] = null;
          }
        }
      }
    }
  }

  // packages/runtime-dom/modules/Attr.ts
  function patchAttr(el, key, nextValue) {
    if (nextValue) {
      el.setAttribute(nextValue);
    } else {
      el.removeAttribute(key);
    }
  }

  // packages/runtime-dom/modules/event.ts
  function patchEvent(el, eventName, nextValue) {
    let invokers = el._vei || (el._vei = {});
    let exits = invokers[eventName];
    if (exits && nextValue) {
      exits.value = nextValue;
    } else {
      let event = eventName.slice(2).toLowerCase();
      console.log("event==", event);
      if (nextValue) {
        const invoker = invokers[eventName] = createInvoker(nextValue);
        el.addEventListener(event, invoker);
      } else if (exits) {
        el.removeEventListener(event, exits);
        invokers[eventName] = void 0;
      }
    }
  }
  function createInvoker(callback) {
    const invoker = (e) => invoker.value(e);
    invoker.value = callback;
    return invoker;
  }

  // packages/runtime-dom/src/patchProp.ts
  function patchProp(el, key, preValue, nextValue) {
    if (key === "class") {
      patchClass(el, nextValue);
    } else if (key === "style") {
      patchStyle(el, preValue, nextValue);
    } else if (/^on[^a-z]/.test(key)) {
      patchEvent(el, key, nextValue);
    } else {
      patchAttr(el, key, nextValue);
    }
  }

  // packages/runtime-core/src/createElement.ts
  function createElement(vnode) {
    console.log("\u76EE\u7684\u662F\u628A\u865A\u62DF\u8282\u70B9", vnode, "\u771F\u6B63\u53D8\u4E3Adom");
    let domNode = document.createElement(vnode.sel);
    if (vnode.text != "" && vnode.children == void 0 || vnode.children.length === 0) {
      domNode.innerText = vnode.text;
    }
    console.log("domNo====", domNode);
    vnode.elm = domNode;
    return vnode.elm;
  }

  // packages/runtime-core/src/renderer.ts
  function createRenderer(renderOptions2) {
    const render2 = (vnode, container) => {
      createElement(vnode);
    };
    return { render: render2 };
  }

  // packages/runtime-core/src/vnode.ts
  function createVnode(sel, data, children, text, elm) {
    const key = data.key;
    return { sel, data, children, text, elm };
  }

  // packages/runtime-core/src/h.ts
  function h(sel, data, c) {
    if (arguments.length !== 3) {
      throw new Error("\u4F4E\u914D\u7248h\u51FD\u6570");
    }
    if (typeof c === "string" || typeof c === "number") {
      return createVnode(sel, data, void 0, c, void 0);
    }
  }

  // packages/runtime-dom/src/index.ts
  var renderOptions = Object.assign(nodeOps, { patchProp });
  console.log(renderOptions);
  function render(vnode, container) {
    console.log("createRenderer-----", createRenderer(renderOptions));
    createRenderer(renderOptions).render(vnode, container);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
