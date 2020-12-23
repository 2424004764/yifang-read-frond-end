const Config = require('./util/config.js')

module.exports = {
  devServer: {
	"historyApiFallback": true,
	"host": "0.0.0.0",
	"disableHostCheck": true,
	"noInfo": true,
    proxy: {
      '/yifang-read-api': {
        target: Config['baseUrl'],
        pathRewrite: {
          '^/yifang-read-api': ''
        }
      }
    },
  }
}