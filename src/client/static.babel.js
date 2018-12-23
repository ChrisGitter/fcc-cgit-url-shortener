module.exports = {
  presets: [
    "@babel/preset-typescript",
    [
      "@babel/preset-env",
      {
        targets: "> 90%, not dead"
      }
    ]
  ]
};
