const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const env = process.env.NODE_ENV !== 'prod'; // 判断运行环境
const dest = "dist";

const temp = require("./config/template")

let plugins = [],
  entry = {};

if (!env) {
  plugins.push(new CleanWebpackPlugin())
}

temp.forEach(item => {
  plugins.push(new HtmlWebpackPlugin({
    filename: path.resolve(__dirname, `${dest}/views/${item.name.split("/").join(".")}.html`),
    template: path.resolve(__dirname, `src/views/${item.name}.html`),
    minify: false,
    inject: 'body', //脚本在body后面引入
    chunks: [item.name],
    chunksSortMode: 'manual',
    hash: false   //引入文件加hash值参数
  }))
  entry[item.name] = `./src/js/${item.name}.js`;
})

module.exports = {
  mode: "none",
  entry: entry,
  output: {
    filename: 'js/[name].[hash:5].min.js',
    path: path.resolve(__dirname, dest)
  },
  resolve: {
    extensions: [
      ".js",
      ".jsx",
      ".tsx",
      ".less",
      ".css"
    ]
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({}),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../"
          }
        }, 'css-loader']
      },
      {
        test: /\.less$/,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../"
          }
        }, 'css-loader', 'less-loader']
      },
      {
        test: /\.(eot|woff2?|ttf|svg)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              name: "[name]-[hash:5].min.[ext]",
              limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
              publicPath: "../fonts",
              outputPath: "fonts/"
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|jpeg|svg)$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 1024,
            esModule: false,
            name: 'img/[name]-[hash:6].[ext]',
            publicPath: "../"
          }
        }]
      },
      {
        test: /\.html$/,
        use: [{
          loader: 'html-loader'
        }]
      }
    ]
  },
  plugins: [
    ...plugins,
    new CopyWebpackPlugin([   //复制资源文件
      {
        from: "./src/lib",
        to: "lib",
        ignore: ["*.md"]
      },
      {
        from: "./src/public",
        to: "",
        ignore: ["*.md"]
      }
    ]),
    new MiniCssExtractPlugin({  // 分离css
      moduleFilename: ({ name }) => `style/${name.split("/").join(".")}.[hash:5].min.css`
    })
  ],
  devServer: {
    contentBase: `${dest}`,
    host: '0.0.0.0',
    proxy: {
      '/c-api': {
        target: 'https://*****/',
        changeOrigin: true
      }
    }
  }
};