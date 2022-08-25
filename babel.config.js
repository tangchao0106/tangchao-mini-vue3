// 在项目的根目录下创建 babel.config.js ，通过配置 Babel 使其能够兼容当前的 Node 版本。

module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
};
