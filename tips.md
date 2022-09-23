
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
-sudo -i  npm install ts-node -g 插件code-runner

