const rollup = require("rollup");
const pkg = require("../package.json");
const path = require("path");
const resolve = require("@rollup/plugin-node-resolve").default;
const { parse } = require("@babel/parser");
const babel = require("@rollup/plugin-babel").default;
const { astToCode } = require("./transform");
const fs = require("fs-extra");

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const template = fs.readFileSync(path.join(__dirname, "./template.txt"), { encoding: "utf-8" });

async function build(input) {
  const templateAst = parse(template, { sourceType: "module", sourcemap: false });

  const bundle = await rollup.rollup({
    input: input,
    plugins: [
      resolve({ extensions }),
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-typescript"],
        plugins: [["@babel/plugin-proposal-class-properties", { loose: true }]],
        extensions
      })
    ],

    external: Object.keys(pkg.dependencies)
  });
  const res = await bundle.generate({ format: "es", sourcemap: false });
  const [code] = res.output.map(({ code }) => {
    const codeAst = parse(code, {
      sourceType: "module",
      sourcemap: false
    });
    const result = astToCode(codeAst, templateAst);
    return result.code;
  });
  return code;
}

module.exports = {
  build
};
