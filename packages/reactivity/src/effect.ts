export function effect(fn) {
  const _effect = new ReactiveEffect(fn);
  _effect.run(); //默认先执行一次
}

export let activeEffect = undefined;
//创建响应式的Effect 副作用函数
class ReactiveEffect {
  public active = true; //默认激活状态
  constructor(public fn) {
    if (!this.active) {
      //如果不是非激活状态只需要执行函数，不进行依赖收集
      this.fn();
    }
    //这里开始依赖收集,将当前的effect和稍后渲染的属性关联在一起
    try {
      activeEffect = this;
      return this.fn();
    } finally {
      activeEffect = undefined;
    }
  }
  run() {}
}
