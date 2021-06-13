const fs = require("fs-extra");
const path = require("path");

const websiteAbsolutePath = path.join(__dirname, "../../oasis-engine-io/playground");
const demoListPath = path.join(__dirname, "../demos/.demoList.json");
const demoSrcPath = path.join(__dirname, "../demos");

if (!fs.existsSync(websiteAbsolutePath)) {
  throw "path error, plase input correct website relative url";
}

// clear
fs.removeSync(websiteAbsolutePath);

const demoListJSON = fs.readJSONSync(demoListPath);

demoListJSON.forEach((group) => {
  const groupName = group.group;
  if (groupName) {
    const groupSrc = group.src;
    group.demos.forEach(async (demo) => {
      const { src, label } = demo;
      const prefix = `/**
 * @title ${label}
 * @category ${groupName}
 */
`;
      const demoStr = await fs.readFile(path.join(demoSrcPath, groupSrc, src, "index.ts"), "utf8");
      const combinedDemoStr = prefix + demoStr;
      const outputFile = path.join(websiteAbsolutePath, src + ".ts");
      await fs.outputFile(outputFile, combinedDemoStr);
      console.log(`success: ${outputFile}`);
    });
  } else {
    throw "please use secondary directory";
  }
});
