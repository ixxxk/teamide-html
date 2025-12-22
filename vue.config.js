const path = require('path')
const fs = require('fs')

// 默认后端为 http（避免 https 自签证书导致 EPROTO / TLS handshake unknown certificate）
// 可通过环境变量覆盖，例如：
// - TEAMIDE_API_TARGET=http://127.0.0.1:21080/teamide/
// - TEAMIDE_API_TARGET=https://127.0.0.1:21080/teamide/
const apiTarget = process.env.TEAMIDE_API_TARGET || 'http://127.0.0.1:21080/teamide/'
const apiTargetIsHttps = /^https:/i.test(apiTarget)

module.exports = {
  assetsDir: process.env.assetsDir,
  publicPath: process.env.publicPath,
  devServer: {
    port: 21081,
    proxy: {
      "/api": {
        ws: true,
        target: apiTarget,
        changeOrigin: true,
        // https 目标允许自签证书（本地开发），http 不需要
        secure: apiTargetIsHttps ? false : true
      },
    },
    // 默认使用 http 启动前端；如需 https：设置 TEAMIDE_HTML_HTTPS=1
    ...(process.env.TEAMIDE_HTML_HTTPS === '1'
      ? {
          https: {
            cert: fs.readFileSync(path.join(__dirname, './server.crt')),
            key: fs.readFileSync(path.join(__dirname, './server.key')),
          },
        }
      : {}),
  },
  productionSourceMap: false,
  transpileDependencies: [
    "vuetify"
  ],
  runtimeCompiler: true,
}
