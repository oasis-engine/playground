const path = require("path");
const fs = require("fs-extra");
const SRC_PATH = "demos";
const OUT_PATH = "mpa";
const templateStr = fs.readFileSync("homepage/iframe.ejs", "utf8");

// 替换 ejs 模版格式的字符串，如 <%= title %>: templateStr.replaceEJS("title","replaced title");
String.prototype.replaceEJS = function (regStr, replaceStr) {
  return this.replace(new RegExp(`<%=\\s*${regStr}\\s*%>`, "g"), replaceStr);
};

// clear mpa
fs.emptyDirSync(path.resolve(__dirname, OUT_PATH));

// filter index
const pages = fs
  .readdirSync(path.resolve(__dirname, SRC_PATH))
  .filter((pageName) => {
    const pagePath = path.resolve(__dirname, SRC_PATH, pageName);
    const stats = fs.statSync(pagePath);
    if (stats.isDirectory()) {
      const files = fs.readdirSync(pagePath);
      const haveIndex = files.some((fileName) => fileName === "index.ts");
      if (haveIndex) return true;
    }
  })
  // generate mpa/*
  .map((pageName) => {
    const pagePath = path.resolve(__dirname, SRC_PATH, pageName);
    const files = fs.readdirSync(pagePath);
    let img = null;
    let intro = "";
    let codeUrl = "";

    fs.outputFileSync(path.resolve(__dirname, OUT_PATH, pageName + ".js"), `import "../demos/${pageName}"`);

    // avatar.jpg
    files.some((fileName) => {
      if (/^(avatar\.(jpg|png))$/.test(fileName)) {
        img = RegExp.$1;
        return true;
      }
    });

    // README.md
    files.some((fileName) => {
      if (/^README\.md$/.test(fileName)) {
        intro = fs.readFileSync(path.resolve(pagePath, "README.md"), "utf-8");
        return true;
      }
    });

    // code.json
    files.some((fileName) => {
      if (/^code\.json$/.test(fileName)) {
        const code = fs.readFileSync(path.resolve(pagePath, "code.json"), "utf-8");
        const codeJSON = JSON.parse(code);
        codeUrl = codeJSON.riddle;
        return true;
      }
    });

    const ejs = templateStr.replaceEJS("title", pageName).replaceEJS("url", `./${pageName}.js`);

    fs.outputFileSync(path.resolve(__dirname, OUT_PATH, pageName + ".html"), ejs);
    return {
      img,
      intro,
      name: pageName
    };
  });

// generate page.json
fs.outputFileSync(path.resolve(__dirname, "homepage/page.json"), JSON.stringify(pages));

module.exports = {
  open: true,
  optimizeDeps: {
    exclude: ["oasis-engine"]
  }
};
