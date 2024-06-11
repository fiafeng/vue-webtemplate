const {defineConfig} = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8081,
    proxy: {
      '/api': { // url识别符
        target: 'http://localhost:7000/', // server地址
        changOrigin: true, // 允许跨域
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  }
})
