const pkg = require("./package.json");

module.exports = {
  output: {
    dir: "dist", // 配置构建部署时输出的目录，默认dist目录
    publicUrl: `/0.3/playground/` // 配置构建输出的资源根目录，默认是'/'
  },
  name: "Oasis Playground",
  version: `v${pkg.version}`,
  homePage: "https://oasis-engine.github.io",
  boxTheme: "monokai", // 配置代码编辑器的主题
  // 可选主题: active4d, allHallowsEve, amy, blackboard, brillianceBlack,
  // brillianceDull, chromeDevtools, cloudsMidnight, clouds, cobalt,
  // dawn, dreamweaver, eiffel, espressoLibre, github, idle, katzenmilch,
  // kuroirTheme, lazy, magicwbAmiga, merbivoreSoft, merbivore, monokai,
  // pastelsOnDark, slushAndPoppies, solarizedDark, solarizedLight,
  // spacecadet, sunburst, textmateMacClassic, tomorrowNightBlue,
  // tomorrowNightBright, tomorrowNightEighties, tomorrowNight, tomorrow,
  // twilight, vibrantInk, zenburnesque, iplastic, idlefingers, krtheme,
  // monoindustrial,
  globalPackages: {
    js: [
      "https://cdn.jsdelivr.net/npm/dat.gui@0.7.7/build/dat.gui.min.js",
      "https://gw.alipayobjects.com/os/lib/oasis-engine/0.3.0-beta.2/dist/browser.min.js",
      "https://gw.alipayobjects.com/os/lib/oasis-engine/controls/0.3.0-beta.2/dist/browser.min.js",
      "https://gw.alipayobjects.com/os/lib/oasis-engine/framebuffer-picker/0.3.0-beta.2/dist/browser.min.js"
      // "http://localhost:5000/packages/oasis-engine/dist/browser.min.js",
      // "http://localhost:5000/packages/controls/dist/browser.min.js",
      // "http://localhost:5000/packages/framebuffer-picker/dist/browser.min.js"
    ]
  }
};
