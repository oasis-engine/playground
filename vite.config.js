const demoList = require("./demos/.demoList.json")
const path = require("path");
const fs = require("fs-extra");
const OUT_PATH = "mpa";
const templateStr = fs.readFileSync("homepage/iframe.ejs", "utf8");

// 替换 ejs 模版格式的字符串，如 <%= title %>: templateStr.replaceEJS("title","replaced title");
String.prototype.replaceEJS = function (regStr, replaceStr) {
  return this.replace(new RegExp(`<%=\\s*${regStr}\\s*%>`, "g"), replaceStr);
};

// clear mpa
fs.emptyDirSync(path.resolve(__dirname, OUT_PATH));

demoList.forEach((item) => {
  if (item.group) {
    const groupSrc = item.src;

    item.demos.forEach((demo) => {
      const demoSrc = demo.src;
      const ejs = templateStr.replaceEJS("title", demoSrc).replaceEJS("url", `./${demoSrc}.js`);

      fs.outputFileSync(
        path.resolve(__dirname, OUT_PATH, groupSrc, demoSrc + ".js"),
        `import "../../demos/${groupSrc}/${demoSrc}"`
      );
      fs.outputFileSync(path.resolve(__dirname, OUT_PATH, groupSrc, demoSrc + ".html"), ejs);
    });
  } else {
    const { src } = item;
    const ejs = templateStr.replaceEJS("title", src).replaceEJS("url", `./${src}.js`);

    fs.outputFileSync(path.resolve(__dirname, OUT_PATH, src + ".js"), `import "../demos/${src}"`);
    fs.outputFileSync(path.resolve(__dirname, OUT_PATH, src + ".html"), ejs);
  }
});

module.exports = {
  open: true,
  optimizeDeps: {
    exclude: ["oasis-engine"]
  }
};
