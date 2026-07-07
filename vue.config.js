const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: ["vuetify"],
  chainWebpack: (config) => {
    // vue-cli inlines the whole `process.env` object as a literal via
    // DefinePlugin. That turns a wholesale assignment such as
    // `process.env = previousEnv` (used by cohere-ai's aws-utils.js) into
    // `({...}) = previousEnv`, an "Invalid left-hand side in assignment"
    // syntax error that breaks bundling. Redefine `process.env` per key so a
    // bare `process.env` stays a real, assignable runtime reference while the
    // individual `process.env.X` lookups are still inlined.
    config.plugin("define").tap((args) => {
      const def = args[0];
      const env = def["process.env"];
      if (env && typeof env === "object") {
        // Values are already DefinePlugin code strings (e.g. '"development"').
        delete def["process.env"];
        for (const [key, value] of Object.entries(env)) {
          def[`process.env.${key}`] = value;
        }
      }
      return args;
    });
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        // options placed here will be merged with default configuration and passed to electron-builder
        appId: "ai.chatall",
        productName: "ChatALL",
        artifactName: "${productName}-${version}-${os}-${arch}.${ext}",
        directories: {
          buildResources: "src/assets",
        },
        compression: "maximum",
        mac: {
          category: "public.app-category.utilities",
          target: "default",
          icon: "src/assets/icon.icns",
          hardenedRuntime: true,
          notarize: {
            teamId: "M4934264PN",
          },
        },
        win: {
          target: [
            {
              target: "nsis",
              arch: ["x64"],
            },
          ],
          icon: "src/assets/icon.ico",
        },
        linux: {
          target: ["AppImage", "deb"],
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
        },
      },
      /**
       * work around to fix this issue: https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/1647#issuecomment-1019400838
       * some resources is defined by url in css file can't be loaded on production build (urls start with app:///)
       * docs of package related to this issue: https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/configuration.html#changing-the-file-loading-protocol
       * */
      customFileProtocol: "./",
    },
  },
});
