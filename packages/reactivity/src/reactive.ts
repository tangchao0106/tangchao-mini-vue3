import { isObject } from "@vue/shared";
import { activeEffect, track, trigger } from "./effect";
// 使用弱引用增加缓存，防止被代理多次
const reactiveMap = new WeakMap(); //key 只能是对象

const enum ReactiveFlag {
  IS_REACTIVE = "v_isReactive",
}

export function isReactive(value) {
  return !!value && value[ReactiveFlag.IS_REACTIVE];
}

export function reactive(target) {
  if (!isObject) return;
  //防止同一个对象被代理多次，增加缓存解决
  let existProxy = reactiveMap.get(target);
  if (existProxy) return existProxy;

  //第一次普通对象代理，会代理一次，下一次如果把proxy再次代理，先判断是不是已经代理过了，通过访问proxy的有没有get方法
  if (target[ReactiveFlag.IS_REACTIVE]) {
    return target;
  }

  //需要搭配Reflect使用，改变this指向问题
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === ReactiveFlag.IS_REACTIVE) {
        return true;
      }
      track(target, "get", key);

      return Reflect.get(target, key, reactive);
    },
    set(target, key, value, receiver) {
      let oldValue = target[key];
      let result = Reflect.set(target, key, value, receiver);
      if (oldValue != result) {
        trigger(target, "set", key, value, oldValue);
      }
      return result;
    },
  });
  reactiveMap.set(target, proxy);
  return proxy;
  // let target = {
  //   name: "name",
  //   get alias() {
  //     return this.name;
  //   },
  // };
}
