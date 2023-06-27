const path = require("path")
const fs = require('fs');

let localCanisters, prodCanisters, canisters

function initCanisterIds() {
  try {
    localCanisters = require(path.resolve(".dfx", "local", "canister_ids.json"))
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production")
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"))
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local")
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local")


  // let envFileName = '.env.production'
  // if (network !== 'ic') {
  //   envFileName = '.env.development'
  // }

  canisters = network === "local" ? localCanisters : prodCanisters

  for (const canister in canisters) {
    process.env[`NEXT_PUBLIC_${canister.toUpperCase()}_CANISTER_ID`] =
      canisters[canister][network]
  }
  console.info(`initCanisterIds: network=${network}`)
  console.info(`initCanisterIds: DFX_NETWORK=${process.env.DFX_NETWORK}`)
}

function initDevServerProxyPort() {
  console.log("start initDevServerProxyPort ==========>")
  // proxy /api to port 4943 during development.
  // if you edit dfx.json to define a project-specific local network, change the port to match.
  const staticDirectory = "out";
  const frontendDirectory = "src";
  try {
    const dfxData = require(path.resolve("dfx.json"));
    const devServer = {
      proxy: {
        "/api": {
          target: dfxData.networks.local.bind ? "http://" + dfxData.networks.local.bind : "http://127.0.0.1:4943",
          changeOrigin: true,
          pathRewrite: {
            "^/api": "/api",
          },
        },
      },
      static: path.resolve(__dirname, staticDirectory),
      hot: true,
      watchFiles: [path.resolve(__dirname, frontendDirectory)],
      liveReload: true,
    };
    return devServer;
  } catch (error) {
    console.log("Not Found dfx.json");
  }
}

module.exports = {
  initCanisterIds: initCanisterIds,
  initDevServerProxyPort: initDevServerProxyPort,
}
