### VUE3 与VUE2 区别
- VUE3 注重模块上的拆分。不用引入整个VUE，可以单独引入模块，耦合度降低，模块可以单独使用
- VUE2 方法挂载在实例上，即时没有使用到，也会打包进来，VUE3 通过tree-shaking机制按需引入，减少打包体积
- VUE3 允许自定义渲染器，扩展能力强，不用像vue2通过改造源码渲染方式。扩展更方便

### 使用Monorepo管理项目
- 管理项目代码的方式。一个项目仓库管理多个包，
- 方便版本管理和依赖管理，模块之前的引用，调用
- pnpm i vue 直接在根目录安装vue会报错，无法指明 每个单独的包是否共用vue，所以加-w 放在根目录工作空间。使每个包共用引用。 pnpm i vue -w
- 下载后所有包放在.pnpm中，多个模块共享
-  幽灵依赖 例子express模块用到connect，开发的时候可以使用不需要安装，称为幽灵依赖。假如后期express不再使用connect模块，项目将缺少，
- npm yarn 扁平化管理。包平铺开，减少了嵌套依赖，节省磁盘，解决 windows 260字符路径限制问题，。但正因为平铺开了，引入了幽灵依赖的问题，并且同名的包只会提升一个版本的，其余的版本依然会复制多次。
- pnpm 一个包全局只保存一份，剩下的都是软硬连接，节省磁盘空间。因为通过链接的方式而不是复制，自然会快。

### 安装
- pnpm i typescript minimist esbuild -w -D
``` 
"buildOptions":{
"name":"VueReactivity",//打包之后的名称
"formats":[
"global",//在浏览器中使用
"cjs",//commonjs语法在node中使用
"esm-bundler"//在es6模块下使用

]
}, 
```
- rm -rf node_modules
- pnpm tsc --init 生成ts配置文件
- // "dev": "node scripts/dev.js reactivity -f global"// //指定打包入口路径，指定哪个模块，指定格式

