import { isFunction, isObject } from "@vue/shared";
import { ReactiveEffect, trackEffect, triggerEffect } from "./effect";
import { isReactive } from "./reactive";

export function traversal(value, set = new Set()) {
  if (!isObject(value)) return value;
  if (set.has(value)) {
    return value;
  }
  set.add(value);
  for (const key in value) {
    traversal(value[key], set);
  }
}

export function watch(souce, cb) {
  let getter;

  if (isReactive(souce)) {
    getter = () => traversal(souce); //访问属性的时候会收集
  } else if (isFunction) {
    getter = souce;
  }
  let oldValue;
  let cleanup;
  const oncleanUp = (fn) => {
    cleanup = fn;
  };
  const job = () => {
    if (cleanup) cleanup(); //下一次watch开始触发的时候，上一次的清理，永远后一次比前一次优先级高
    const newValue = effect.run();
    cb(newValue, oldValue);
    oldValue = newValue;
  };

  const effect = new ReactiveEffect(getter, job);
  oldValue = effect.run();
}
