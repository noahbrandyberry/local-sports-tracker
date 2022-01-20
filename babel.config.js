module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["."],
        extensions: [
          ".ios.ts",
          ".android.ts",
          ".ts",
          ".ios.tsx",
          ".android.tsx",
          ".tsx",
          ".jsx",
          ".js",
          ".json",
        ],
        alias: {
          assets: "./src/assets",
          components: "./src/components",
          config: "./src/config",
          hooks: "./src/hooks",
          models: "./src/models",
          schools: "./src/scenes/Schools",
          services: "./src/services",
          store: "./src/store",
          teams: "./src/scenes/Teams",
          utils: "./src/utils",
        },
      },
    ],
    [
      "babel-plugin-inline-import",
      {
        extensions: [".svg"],
      },
    ],
  ],
};
