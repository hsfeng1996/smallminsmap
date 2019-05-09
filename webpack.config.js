module.exports = {
  entry:  __dirname + "/src/index.js",//已多次提及的唯一入口文件
  output: {
    path: __dirname + "/lib",//打包后的文件存放的地方
    filename: "index.js"//打包后输出文件的文件名
  },
  //mode: 'development',
  //devtool: 'eval-source-map',
  devServer: {
    contentBase: "./lib",//本地服务器所加载的页面所在的目录
    historyApiFallback: true,//不跳转
    inline: true,//实时刷新
    proxy: {
      '/neo4j': {
        target: 'http://127.0.0.1:8080/',
        secure: false
      }
    }
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  performance: {
    // false | "error" | "warning" // 不显示性能提示 | 以错误形式提示 | 以警告...
    hints: "warning",
    // 开发环境设置较大防止警告
    // 根据入口起点的最大体积，控制webpack何时生成性能提示,整数类型,以字节为单位
    maxEntrypointSize: 5000000, 
    // 最大单个资源体积，默认250000 (bytes)
    maxAssetSize: 3000000
  }
}