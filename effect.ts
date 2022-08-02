export let activeEffect = undefined;
class ReactiveEffect {
  //默认激活状态 在实例上新增属性
  public active = true;

  constructor(public fn) {}
  run() {
    if (!this.active) {
      return this.fn();
    }
    try {
      activeEffect = this;
      return this.fn(); //
    } finally {
      activeEffect = undefined;
    }
  }
}

//fn 根据状态变化，重新执行
export function effect(fn) {
  //创建响应式的effect
  const _effect = new ReactiveEffect(fn);
  _effect.run();
}
