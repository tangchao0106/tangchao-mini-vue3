export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run(); //默认先执行一次

  const runner = _effect.run.bind(_effect); //绑定this指向
  runner.effect = _effect; //将_effect 挂载到runner函数上
  return runner;
}

export let activeEffect = undefined;
//创建响应式的Effect 副作用函数
class ReactiveEffect {
  public active = true; //默认激活状态
  public parent = null;
  public deps = [];

  constructor(public fn, public scheduler) {}
  run() {
    if (!this.active) {
      //如果不是非激活状态只需要执行函数，不进行依赖收集
      this.fn();
    }
    //这里开始依赖收集,将当前的effect和稍后渲染的属性关联在一起
    try {
      this.parent = activeEffect;
      activeEffect = this;

      //在执行用户函数之前将之前的收集依赖内容清空，此时要防止又删除又添加的死循环情况
      cleanupEffect(this);
      return this.fn();
    } finally {
      activeEffect = this.parent;
    }
  }
  stop() {
    if (this.active) {
      this.active = false; //激活设置fasle，并且清空所有依赖

      cleanupEffect(this);
    }
  }
}
//重新清空
function cleanupEffect(effect) {
  const { deps } = effect;
  for (let i = 0; i < deps.length; i++) {
    deps[i].delete(effect);
  }
  effect.deps.length = 0;
}

const targetMap = new WeakMap();
// track 收集依赖(get操作)
export function track(target, trpe, key) {
  if (!activeEffect) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    //第一次没有就新增
    targetMap.set(target, (depsMap = new Map()));
  }
  debugger;
  let dep = depsMap.get(key);

  if (!dep) {
    depsMap.set(key, (dep = new Set()));
    // 存放的是name:new Set()
  }
  let shouldTrack = !dep.has(activeEffect); //去重
  if (shouldTrack) {
    dep.add(activeEffect);
  }
  activeEffect.deps.push(dep); //让effect记住对应的dep。清理时候使用
}

// trigger 触发依赖
export function trigger(target, type, key, value, oldValue) {
  // targetMap 依赖管理中心，用于收集依赖和触发依赖
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  let effects = depsMap.get(key); //找到对应的effect

  // 在执行前，先拷贝一份，不要关联引用，否则出现死循环，又删除又添加的情况】】
  if (effects) {
    effects = new Set(effects);

    effects.forEach((effect) => {
      //在执行effect的时候，又要执行自己，需要先屏蔽，不用无限调用
      if (effect !== activeEffect) {
        if (effect.scheduler) {
          //如果有调度属性，则执行调度里面的方法，
          effect.scheduler();
        } else {
          effect.run(); //否则默认刷新视图
        }
      }
    });
  }
}
