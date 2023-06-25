const webpack = require("webpack")

const DFXWebPackConfig = require("./dfx.webpack.config")
DFXWebPackConfig.initCanisterIds()
const devServer = DFXWebPackConfig.initDevServerProxyPort();

// Make DFX_NETWORK available to Web Browser with default "local" if DFX_NETWORK is undefined
const EnvPlugin = new webpack.EnvironmentPlugin({
  DFX_NETWORK: "local"
})

module.exports = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Plugin
    config.plugins.push(EnvPlugin)

    // Important: return the modified config
    return config
  },
  devServer: devServer,
  swcMinify: false,
}
console.log("module.exports.devServer.proxy: ", JSON.stringify(module.exports.devServer.proxy));