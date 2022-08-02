let target = {
  name: "name",
  get alias() {
    return this.name;
  },
};
const proxy = new Proxy(target, {
  get(target, key, receiver) {},
  set(target, key, value, receiver) {},
});
