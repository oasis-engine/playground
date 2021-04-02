const fs = require("fs-extra");
const path = require("path");
const { build } = require("./rollup");

const cwd = process.cwd();

const root = path.join(cwd, "demos");

const targetRoot = path.join(cwd, "oasis-playground-mini/pages/playground/dist-miniprogram");
const appJsonPath = path.join(cwd, "oasis-playground-mini/app.json");

fs.rmdirSync(targetRoot, { recursive: true });

/**
 * 递归遍历文件夹
 * @param {*} dir 文件夹目录
 * @param {*} callback 回调
 */
const walkSync = (dir, callback) => {
  const files = fs.readdirSync(dir);
  const appJson = require(appJsonPath);
  appJson.subPackages[0].pages = [];
  const pages = appJson.subPackages[0].pages;

  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i];
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      const inputFile = path.join(filepath, "index.ts");
      if (fs.existsSync(inputFile)) {
        pages.push(path.join(file, "index"));
        callback(filepath);
      }
    }
  }
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2), { encoding: "utf-8" });
};

walkSync(root, async (filepath) => {
  // 源 ts 脚本
  const relativePath = path.relative(root, filepath);
  // 生成目标文件夹
  const targetDirPath = path.join(targetRoot, relativePath);
  // 生成目标的 js 文件
  const targetFilePath = path.join(targetDirPath, "index.js");
  try {
    // 生成最终的代码
    const code = await build(filepath);
    await fs.ensureFile(targetFilePath);
    fs.writeFile(targetFilePath, code, { encoding: "utf-8" });
    fs.copyFile(path.join(__dirname, "./index.acss"), path.join(targetDirPath, "./index.acss"));
    fs.copyFile(path.join(__dirname, "./index.axml"), path.join(targetDirPath, "./index.axml"));
    fs.copyFile(path.join(__dirname, "./index.json"), path.join(targetDirPath, "./index.json"));
  } catch (e) {
    console.log("error", filepath);
    console.log(e.message);
  }
});
