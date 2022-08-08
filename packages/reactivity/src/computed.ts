import { isFunction } from "@vue/shared";
import { ReactiveEffect, trackEffect, triggerEffect } from "./effect";

export const computed = (getterOrOptions) => {
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

class ComputedRefImpl {
  public effect;
  public _v_isReadonly = true;
  public _v_isRef = true;
  public _dirty = true; //默认true，
  public _value; //操作的是同一个值
  public dep;
  constructor(public getter, public setter) {
    //将用户传入的getter传入effect。里面的属性就会被effect收集
    this.effect = new ReactiveEffect(getter, () => {
      //2属性有变化后，会执行回调函数
      if (!this._dirty) {
        this._dirty = true;
        triggerEffect(this.dep);
      }
    });
  }
  get value() {
    trackEffect(this.dep || (this.dep = new Set())); //收集依赖

    if (this._dirty) {
      //触发get取值的时候，才执行
      this._dirty = false;
      this._value = this.effect.run();
    }
    return this._value;
  }
  set value(newValue) {
    this.setter(newValue);
  }
}
