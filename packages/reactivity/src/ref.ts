import { isArray, isObject } from "@vue/shared";
import { reactive } from "./reactive";
import { trackEffect, triggerEffect } from "./effect";

export function ref(value) {
  return new RefImpl(value);
}
function toReactive(rawValue) {
  return isObject(rawValue) && reactive(rawValue);
}

class RefImpl {
  public _value;
  public dep = [];
  public _v_isRef = true;
  constructor(public rawValue) {
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
}

class ObjectRefImpl {
  constructor(public object, public key) {}
  get value() {
    return this.object[this.key];
  }
  set valuse(newValue) {
    this.object[this.key] = newValue;
  }
}

export function toRef(object, key) {
  return new ObjectRefImpl(object, key);
}
export function toRefs(object) {
  const result = isArray(object) ? new Array(object.length) : [];

  for (const key in object) {
    result[key] = toRef(object, key);
  }
  return result;
}

export function proxyRefs(object) {
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
    },
  });
}
