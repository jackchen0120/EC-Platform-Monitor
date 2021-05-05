module.exports = {
    devServer: {
        port: 8999, // 端口号配置
        // open: true // 自动打开浏览器
    },
    productionSourceMap: false, // 生产环境是否生成 sourceMap 文件
    configureWebpack: (config) => {
        if (process.env.NODE_ENV === 'production') { // 为生产环境修改配置...
            config.mode = 'production';
            config["performance"] = { //打包文件大小配置
                "maxEntrypointSize": 10000000,
                "maxAssetSize": 30000000
            }
        }
    }
}