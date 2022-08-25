export function patchEvent(el, eventName, nextValue) {
  //先remove旧的事件再添加绑定新的额
  let invokers = el._vei || (el._vei = {});
  let exits = invokers[eventName];

  if (exits && nextValue) {
    //如果有缓存已经绑定了事件
    exits.value = nextValue;
  } else {
    // onClick--click
    let event = eventName.slice(2).toLowerCase();
    console.log("event==", event);
    if (nextValue) {
      const invoker = (invokers[eventName] = createInvoker(nextValue));
      el.addEventListener(event, invoker);
    } else if (exits) {
      el.removeEventListener(event, exits);
      invokers[eventName] = undefined;
    }
  }
}
function createInvoker(callback) {
  const invoker = (e) => invoker.value(e);
  invoker.value = callback;
  return invoker;
}
