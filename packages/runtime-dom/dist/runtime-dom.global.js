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
    computed: () => computed,
    createApp: () => createApp,
    createElementVNode: () => createVNode,
    createRenderer: () => createRenderer,
    createTextVNode: () => createTextVNode,
    effect: () => effect,
    h: () => h,
    nextTick: () => nextTick,
    proxyRefs: () => proxyRefs,
    reactive: () => reactive,
    ref: () => ref,
    toDisplayString: () => toDisplayString,
    toRefs: () => toRefs,
    watch: () => watch
  });

  // packages/runtime-core/src/vnode.ts
  var Fragment = Symbol("Fragment");
  var Text = Symbol("Text");
  function createVNode(type, props, children) {
    const vnode = {
      type,
      props,
      children,
      component: null,
      key: props && props.key,
      shapeFlag: getShapeFlag(type),
      el: null
    };
    if (typeof children === "string") {
      vnode.shapeFlag |= 4 /* TEXT_CHILDREN */;
    } else if (Array.isArray(children)) {
      vnode.shapeFlag |= 8 /* ARRAY_CHILDREN */;
    }
    if (vnode.shapeFlag & 2 /* STATEFUL_COMPONENT */) {
      if (typeof children === "object") {
        vnode.shapeFlag |= 16 /* SLOT_CHILDREN */;
      }
    }
    return vnode;
  }
  function createTextVNode(text) {
    return createVNode(Text, {}, text);
  }
  function getShapeFlag(type) {
    return typeof type === "string" ? 1 /* ELEMENT */ : 2 /* STATEFUL_COMPONENT */;
  }

  // packages/runtime-core/src/h.ts
  function h(type, props, children) {
    return createVNode(type, props, children);
  }

  // packages/reactivity/src/effect.ts
  function effect(fn, options = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    const runner = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
  }
  var activeEffect = void 0;
  var ReactiveEffect = class {
    constructor(fn, scheduler) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.parent = null;
      this.deps = [];
    }
    run() {
      if (!this.active) {
        this.fn();
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        cleanupEffect(this);
        return this.fn();
      } finally {
        activeEffect = this.parent;
      }
    }
    stop() {
      if (this.active) {
        this.active = false;
        cleanupEffect(this);
      }
    }
  };
  function cleanupEffect(effect2) {
    const { deps } = effect2;
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    effect2.deps.length = 0;
  }
  var targetMap = /* @__PURE__ */ new WeakMap();
  function track(target, trpe, key) {
    if (!activeEffect)
      return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    debugger;
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    trackEffect(dep);
  }
  function trackEffect(dep) {
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);
    }
    activeEffect.deps.push(dep);
  }
  function trigger(target, type, key, value, oldValue) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
      return;
    let effects = depsMap.get(key);
    if (effects) {
      triggerEffect(effect);
    }
  }
  function triggerEffect(effects) {
    effects = new Set(effects);
    effects.forEach((effect2) => {
      if (effect2 !== activeEffect) {
        if (effect2.scheduler) {
          effect2.scheduler();
        } else {
          effect2.run();
        }
      }
    });
  }

  // packages/shared/src/index.ts
  var isObject = (value) => {
    return typeof value === "object" && value !== null;
  };
  var isFunction = (value) => {
    return typeof value === "function" && value != null;
  };
  var isArray = Array.isArray;
  function toDisplayString(value) {
    return String(value);
  }
  var EMPTY_OBJ = {};
  var hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);
  var camelize = (str) => {
    return str.replace(/-(\w)/g, (_, c) => {
      return c ? c.toUpperCase() : "";
    });
  };
  var capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  var toHandlerKey = (str) => {
    return str ? "on" + capitalize(str) : "";
  };

  // packages/reactivity/src/reactive.ts
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function isReactive(value) {
    return !!value && value["v_isReactive" /* IS_REACTIVE */];
  }
  function reactive(target) {
    if (!isObject)
      return;
    let existProxy = reactiveMap.get(target);
    if (existProxy)
      return existProxy;
    if (target["v_isReactive" /* IS_REACTIVE */]) {
      return target;
    }
    const proxy = new Proxy(target, {
      get(target2, key, receiver) {
        if (key === "v_isReactive" /* IS_REACTIVE */) {
          return true;
        }
        track(target2, "get", key);
        return Reflect.get(target2, key, reactive);
      },
      set(target2, key, value, receiver) {
        let oldValue = target2[key];
        let result = Reflect.set(target2, key, value, receiver);
        if (oldValue != result) {
          trigger(target2, "set", key, value, oldValue);
        }
        return result;
      }
    });
    reactiveMap.set(target, proxy);
    return proxy;
  }
  function shallowReadonly(value) {
    return value;
  }

  // packages/runtime-core/src/componentEmit.ts
  function emit(instance, event, ...args) {
    const { props } = instance;
    const handlerName = toHandlerKey(camelize(event));
    const handler = props[handlerName];
    handler && handler(...args);
  }

  // packages/runtime-core/src/componentProps.ts
  function initProps(instance, rawProps) {
    instance.props = rawProps || {};
  }

  // packages/runtime-core/src/componentPublicInstance.ts
  var publicPropertiesMap = {
    $el: (i) => i.vnode.el,
    $slots: (i) => i.slots,
    $props: (i) => i.props
  };
  var PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      const { setupState, props } = instance;
      if (hasOwn(setupState, key)) {
        return setupState[key];
      } else if (hasOwn(props, key)) {
        return props[key];
      }
      const publicGetter = publicPropertiesMap[key];
      if (publicGetter) {
        return publicGetter(instance);
      }
    }
  };

  // packages/runtime-core/src/componentSlots.ts
  function initSlots(instance, children) {
    const { vnode } = instance;
    if (vnode.shapeFlag & 16 /* SLOT_CHILDREN */) {
      normalizeObjectSlots(children, instance.slots);
    }
  }
  function normalizeObjectSlots(children, slots) {
    for (const key in children) {
      const value = children[key];
      slots[key] = (props) => normalizeSlotValue(value(props));
    }
  }
  function normalizeSlotValue(value) {
    return Array.isArray(value) ? value : [value];
  }

  // packages/runtime-core/src/component.ts
  function createComponentInstance(vnode, parent) {
    const component = {
      vnode,
      type: vnode.type,
      next: null,
      setupState: {},
      props: {},
      slots: {},
      provides: parent ? parent.provides : {},
      parent,
      isMounted: false,
      subTree: {},
      emit: () => {
      }
    };
    component.emit = emit.bind(null, component);
    return component;
  }
  function setupComponent(instance) {
    initProps(instance, instance.vnode.props);
    initSlots(instance, instance.vnode.children);
    setupStatefulComponent(instance);
  }
  function setupStatefulComponent(instance) {
    const Component = instance.type;
    instance.proxy = new Proxy({ _: instance }, PublicInstanceProxyHandlers);
    const { setup } = Component;
    if (setup) {
      setCurrentInstance(instance);
      const setupResult = setup(shallowReadonly(instance.props), {
        emit: instance.emit
      });
      setCurrentInstance(null);
      handleSetupResult(instance, setupResult);
    }
  }
  function handleSetupResult(instance, setupResult) {
    finishComponentSetup(instance);
  }
  function finishComponentSetup(instance) {
    const Component = instance.type;
    if (compiler && !Component.render) {
      if (Component.template) {
        Component.render = compiler(Component.template);
      }
    }
    instance.render = Component.render;
  }
  var currentInstance = null;
  function setCurrentInstance(instance) {
    currentInstance = instance;
  }
  var compiler;

  // packages/runtime-core/src/componentUpdateUtils.ts
  function shouldUpdateComponent(prevVNode, nextVNode) {
    const { props: prevProps } = prevVNode;
    const { props: nextProps } = nextVNode;
    for (const key in nextProps) {
      if (nextProps[key] !== prevProps[key]) {
        return true;
      }
    }
    return false;
  }

  // packages/runtime-core/src/createApp.ts
  function createAppAPI(render) {
    return function createApp2(rootComponent) {
      return {
        mount(rootContainer) {
          const vnode = createVNode(rootComponent);
          render(vnode, rootContainer);
        }
      };
    };
  }

  // packages/runtime-core/src/scheduler.ts
  var queue = [];
  var p = Promise.resolve();
  var isFlushPending = false;
  function nextTick(fn) {
    return fn ? p.then(fn) : p;
  }
  function queueJobs(job) {
    if (!queue.includes(job)) {
      queue.push(job);
    }
    queueFlush();
  }
  function queueFlush() {
    if (isFlushPending)
      return;
    isFlushPending = true;
    nextTick(flushJobs);
  }
  function flushJobs() {
    isFlushPending = false;
    let job;
    while (job = queue.shift()) {
      job && job();
    }
  }

  // packages/runtime-core/src/renderer.ts
  function createRenderer(options) {
    const {
      createElement: hostCreateElement,
      patchProp: hostPatchProp,
      insert: hostInsert,
      remove: hostRemove,
      setElementText: hostSetElementText
    } = options;
    function render(vnode, container) {
      patch(null, vnode, container, null, null);
    }
    function patch(n1, n2, container, parentComponent, anchor) {
      const { type, shapeFlag } = n2;
      console.log(`patch===type===${type}  shapeFlag=${shapeFlag}`);
      switch (type) {
        case Fragment:
          processFragment(n1, n2, container, parentComponent, anchor);
          break;
        case Text:
          processText(n1, n2, container);
          break;
        default:
          if (shapeFlag & 1 /* ELEMENT */) {
            processElement(n1, n2, container, parentComponent, anchor);
          } else if (shapeFlag & 2 /* STATEFUL_COMPONENT */) {
            processComponent(n1, n2, container, parentComponent, anchor);
          }
          break;
      }
    }
    function processText(n1, n2, container) {
      const { children } = n2;
      const textNode = n2.el = document.createTextNode(children);
      container.append(textNode);
    }
    function processFragment(n1, n2, container, parentComponent, anchor) {
      mountChildren(n2.children, container, parentComponent, anchor);
    }
    function processElement(n1, n2, container, parentComponent, anchor) {
      if (!n1) {
        mountElement(n2, container, parentComponent, anchor);
      } else {
        patchElement(n1, n2, container, parentComponent, anchor);
      }
    }
    function patchElement(n1, n2, container, parentComponent, anchor) {
      console.log("patchElement");
      console.log("n1", n1);
      console.log("n2", n2);
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      const el = n2.el = n1.el;
      patchChildren(n1, n2, el, parentComponent, anchor);
      patchProps(el, oldProps, newProps);
    }
    function patchChildren(n1, n2, container, parentComponent, anchor) {
      const prevShapeFlag = n1.shapeFlag;
      const c1 = n1.children;
      const { shapeFlag } = n2;
      const c2 = n2.children;
      if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        if (prevShapeFlag & 8 /* ARRAY_CHILDREN */) {
          unmountChildren(n1.children);
        }
        if (c1 !== c2) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 4 /* TEXT_CHILDREN */) {
          hostSetElementText(container, "");
          mountChildren(c2, container, parentComponent, anchor);
        } else {
          patchKeyedChildren(c1, c2, container, parentComponent, anchor);
        }
      }
    }
    function patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor) {
      const l2 = c2.length;
      let i = 0;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      function isSomeVNodeType(n1, n2) {
        return n1.type === n2.type && n1.key === n2.key;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[i];
        const n2 = c2[i];
        if (isSomeVNodeType(n1, n2)) {
          patch(n1, n2, container, parentComponent, parentAnchor);
        } else {
          break;
        }
        i++;
      }
      while (i <= e1 && i <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2];
        if (isSomeVNodeType(n1, n2)) {
          patch(n1, n2, container, parentComponent, parentAnchor);
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i > e1) {
        if (i <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : null;
          while (i <= e2) {
            patch(null, c2[i], container, parentComponent, anchor);
            i++;
          }
        }
      } else if (i > e2) {
        while (i <= e1) {
          hostRemove(c1[i].el);
          i++;
        }
      } else {
        let s1 = i;
        let s2 = i;
        const toBePatched = e2 - s2 + 1;
        let patched = 0;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        const newIndexToOldIndexMap = new Array(toBePatched);
        let moved = false;
        let maxNewIndexSoFar = 0;
        for (let i2 = 0; i2 < toBePatched; i2++)
          newIndexToOldIndexMap[i2] = 0;
        for (let i2 = s2; i2 <= e2; i2++) {
          const nextChild = c2[i2];
          keyToNewIndexMap.set(nextChild.key, i2);
        }
        for (let i2 = s1; i2 <= e1; i2++) {
          const prevChild = c1[i2];
          if (patched >= toBePatched) {
            hostRemove(prevChild.el);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (let j2 = s2; j2 <= e2; j2++) {
              if (isSomeVNodeType(prevChild, c2[j2])) {
                newIndex = j2;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            hostRemove(prevChild.el);
          } else {
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            newIndexToOldIndexMap[newIndex - s2] = i2 + 1;
            patch(prevChild, c2[newIndex], container, parentComponent, null);
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
        let j = increasingNewIndexSequence.length - 1;
        for (let i2 = toBePatched - 1; i2 >= 0; i2--) {
          const nextIndex = i2 + s2;
          const nextChild = c2[nextIndex];
          const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null;
          if (newIndexToOldIndexMap[i2] === 0) {
            patch(null, nextChild, container, parentComponent, anchor);
          } else if (moved) {
            if (j < 0 || i2 !== increasingNewIndexSequence[j]) {
              hostInsert(nextChild.el, container, anchor);
            } else {
              j--;
            }
          }
        }
      }
    }
    function unmountChildren(children) {
      for (let i = 0; i < children.length; i++) {
        const el = children[i].el;
        hostRemove(el);
      }
    }
    function patchProps(el, oldProps, newProps) {
      if (oldProps !== newProps) {
        for (const key in newProps) {
          const prevProp = oldProps[key];
          const nextProp = newProps[key];
          if (prevProp !== nextProp) {
            hostPatchProp(el, key, prevProp, nextProp);
          }
        }
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!(key in newProps)) {
              hostPatchProp(el, key, oldProps[key], null);
            }
          }
        }
      }
    }
    function mountElement(vnode, container, parentComponent, anchor) {
      const el = vnode.el = hostCreateElement(vnode.type);
      console.log("mountElement======", el);
      const { children, shapeFlag } = vnode;
      if (shapeFlag & 4 /* TEXT_CHILDREN */) {
        el.textContent = children;
      } else if (shapeFlag & 8 /* ARRAY_CHILDREN */) {
        mountChildren(vnode.children, el, parentComponent, anchor);
      }
      const { props } = vnode;
      for (const key in props) {
        const val = props[key];
        hostPatchProp(el, key, null, val);
      }
      hostInsert(el, container, anchor);
    }
    function mountChildren(children, container, parentComponent, anchor) {
      children.forEach((v) => {
        patch(null, v, container, parentComponent, anchor);
      });
    }
    function processComponent(n1, n2, container, parentComponent, anchor) {
      console.log("processComponent====");
      if (!n1) {
        mountComponent(n2, container, parentComponent, anchor);
      } else {
        updateComponent(n1, n2);
      }
    }
    function updateComponent(n1, n2) {
      console.log("updateComponent======");
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2)) {
        instance.next = n2;
        instance.update();
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    }
    function mountComponent(initialVNode, container, parentComponent, anchor) {
      console.log("mountComponent====");
      const instance = initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent
      );
      console.log("mountComponent====", instance);
      setupComponent(instance);
      setupRenderEffect(instance, initialVNode, container, anchor);
    }
    function setupRenderEffect(instance, initialVNode, container, anchor) {
      instance.update = effect(
        () => {
          if (!instance.isMounted) {
            console.log("init");
            const { proxy } = instance;
            const subTree = instance.subTree = instance.render.call(
              proxy,
              proxy
            );
            patch(null, subTree, container, instance, anchor);
            initialVNode.el = subTree.el;
            instance.isMounted = true;
          } else {
            console.log("update");
            const { next, vnode } = instance;
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next);
            }
            const { proxy } = instance;
            const subTree = instance.render.call(proxy, proxy);
            const prevSubTree = instance.subTree;
            instance.subTree = subTree;
            patch(prevSubTree, subTree, container, instance, anchor);
          }
        },
        {
          scheduler() {
            queueJobs(instance.update);
          }
        }
      );
    }
    return {
      createApp: createAppAPI(render)
    };
  }
  function updateComponentPreRender(instance, nextVNode) {
    instance.vnode = nextVNode;
    instance.next = null;
    instance.props = nextVNode.props;
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [0];
    let i, j, u, v, c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
      const arrI = arr[i];
      if (arrI !== 0) {
        j = result[result.length - 1];
        if (arr[j] < arrI) {
          p2[i] = j;
          result.push(i);
          continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
          c = u + v >> 1;
          if (arr[result[c]] < arrI) {
            u = c + 1;
          } else {
            v = c;
          }
        }
        if (arrI < arr[result[u]]) {
          if (u > 0) {
            p2[i] = result[u - 1];
          }
          result[u] = i;
        }
      }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
      result[u] = v;
      v = p2[v];
    }
    return result;
  }

  // packages/reactivity/src/computed.ts
  var computed = (getterOrOptions) => {
    let onlyGetter = isFunction(getterOrOptions);
    let getter;
    let setter;
    if (onlyGetter) {
      getter = getterOrOptions;
      setter = () => console.log("noset");
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    return new ComputedRefImpl(getter, setter);
  };
  var ComputedRefImpl = class {
    constructor(getter, setter) {
      this.getter = getter;
      this.setter = setter;
      this._v_isReadonly = true;
      this._v_isRef = true;
      this._dirty = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerEffect(this.dep);
        }
      });
    }
    get value() {
      trackEffect(this.dep || (this.dep = /* @__PURE__ */ new Set()));
      if (this._dirty) {
        this._dirty = false;
        this._value = this.effect.run();
      }
      return this._value;
    }
    set value(newValue) {
      this.setter(newValue);
    }
  };

  // packages/reactivity/src/watch.ts
  function traversal(value, set = /* @__PURE__ */ new Set()) {
    if (!isObject(value))
      return value;
    if (set.has(value)) {
      return value;
    }
    set.add(value);
    for (const key in value) {
      traversal(value[key], set);
    }
  }
  function watch(souce, cb) {
    let getter;
    if (isReactive(souce)) {
      getter = () => traversal(souce);
    } else if (isFunction) {
      getter = souce;
    }
    let oldValue;
    let cleanup;
    const oncleanUp = (fn) => {
      cleanup = fn;
    };
    const job = () => {
      if (cleanup)
        cleanup();
      const newValue = effect2.run();
      cb(newValue, oldValue);
      oldValue = newValue;
    };
    const effect2 = new ReactiveEffect(getter, job);
    oldValue = effect2.run();
  }

  // packages/reactivity/src/ref.ts
  function ref(value) {
    return new RefImpl(value);
  }
  function toReactive(rawValue) {
    return isObject(rawValue) && reactive(rawValue);
  }
  var RefImpl = class {
    constructor(rawValue) {
      this.rawValue = rawValue;
      this.dep = [];
      this._v_isRef = true;
      this._value = toReactive(rawValue);
    }
    get value() {
      trackEffect(this.dep);
      return this._value;
    }
    set value(newValue) {
      if (newValue != this._value) {
        this._value = toReactive(newValue);
        this.rawValue = newValue;
      }
    }
  };
  var ObjectRefImpl = class {
    constructor(object, key) {
      this.object = object;
      this.key = key;
    }
    get value() {
      return this.object[this.key];
    }
    set valuse(newValue) {
      this.object[this.key] = newValue;
    }
  };
  function toRef(object, key) {
    return new ObjectRefImpl(object, key);
  }
  function toRefs(object) {
    const result = isArray(object) ? new Array(object.length) : [];
    for (const key in object) {
      result[key] = toRef(object, key);
    }
    return result;
  }
  function proxyRefs(object) {
    return new Proxy(object, {
      get(target, key, recevier) {
        let r = Reflect.get(target, key, recevier);
        return r._v_isRef ? r.value : r;
      },
      set(target, key, value, recevier) {
        let oldValue = target[key];
        if (oldValue._v_isRef) {
          oldValue.value = value;
          return true;
        } else {
          return Reflect.set(target, key, value, recevier);
        }
      }
    });
  }

  // packages/runtime-dom/src/index.ts
  function createElement(type) {
    return document.createElement(type);
  }
  function patchProp(el, key, prevVal, nextVal) {
    const isOn = (key2) => /^on[A-Z]/.test(key2);
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, nextVal);
    } else {
      if (nextVal === void 0 || nextVal === null) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, nextVal);
      }
    }
  }
  function insert(child, parent, anchor) {
    console.log(`insert==child=${child}  parent=${parent} anchor=${anchor}`);
    parent.insertBefore(child, anchor || null);
  }
  function remove(child) {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  }
  function setElementText(el, text) {
    el.textContent = text;
  }
  var renderer = createRenderer({
    createElement,
    patchProp,
    insert,
    remove,
    setElementText
  });
  function createApp(...args) {
    return renderer.createApp(...args);
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=runtime-dom.global.js.map
