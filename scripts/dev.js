const args = require("minimist")(process.argv.slice(2));
console.log(args);
const { resolve } = require("path");
const { build } = require("esbuild");

// { _: [ 'reactivity' ], f: 'global' }
const target = args._[0] || "reactivity";
//指定打包格式
const format = args.f || "global";

//需要打包的包的路径
const pkg = require(resolve(__dirname, `../packages/${target}/package.json`));

// iife 立即执行函数
// cjs node中的模块
// esm 浏览器中的esmodule模块
const outputFormat = format.startsWith("global")
  ? "iife"
  : format === "cjs"
  ? "cjs"
  : "esm";

const outfile = resolve(
  __dirname,
  `../packages/${target}/dist/${target}.${format},js`
);

//esbulid 打包配置
build({
  entryPoints: [resolve(__dirname, `../packages/${target}/src/index.ts`)],
  outfile,
  bundle: true, //把所有包打包在一起
  sourcemap: true,
  format: outputFormat,
  globalName: pkg.buildOptions.name, //打包的全局名称
  platform: format === "cjs" ? "node" : "browser", //平台
  watch: {
    onRebuild(error) {
      if (!error) console.log("rebuild 监控文件变化");
    },
  },
}).then(() => {
  console.log("watching-------------");
});
