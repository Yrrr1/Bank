const { defineConfig } = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  // 基础配置
  transpileDependencies: true, // 需要转译的依赖

  // 开发服务器配置
  devServer: {
    port: 8080, // 开发服务器端口
    open: true, // 自动打开浏览器
    proxy: {
      // 代理配置示例
      "/api": {
        target: "http://localhost:8081", // 后端地址
        changeOrigin: true,
        pathRewrite: { "^/api": "" }, // 路径重写
      },
    },
  },

  // 生产环境配置
  publicPath:
    process.env.NODE_ENV === "production" ? "/production-sub-path/" : "/",

  // Webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        components: "@/components",
      },
    },
  },

  // CSS相关配置
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "~@/styles/variables.scss";`,
      },
      less: {
        lessOptions: {
          modifyVars: {
            "primary-color": "#1890ff",
          },
          javascriptEnabled: true,
        },
      },
    },
  },

  // 插件配置
  pluginOptions: {
    // 示例：自动导入组件
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "src/styles/_variables.scss")],
    },
  },
});
