# ht_web_h

嗨探中国项目Web端p端分支项目，分享页面


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

## 说明

本项目采用webpack4+ 构建打包，实现项目工程化

#### 配置说明

### webpack配置文件

webpack.config.js

打包时清除包组件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');  

打包拷贝lib
const CopyWebpackPlugin = require("copy-webpack-plugin");

html模板配置
const HtmlWebpackPlugin = require("html-webpack-plugin");

css分离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

css压缩
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

#### 问题
1. less 需要在入口js引入
2. js文件定义的方法会找不到
```
  function test() {

  }
  =>
  window.test = function() {

  }
  webpack打包会将函数变成内部函数，在html中是调用不到的；
```


#### 缺少说明

暂时没有考虑图片的处理；