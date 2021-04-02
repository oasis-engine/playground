#! /usr/bin/env node

"use strict";
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const copydir = require("copy-dir");
const regExp = /^([a-z-])+$/g;

/**
 * 询问新建 demo 名称
 * @returns {PromiseLike<T | never> | Promise<T | never> | *}
 */
function inquirerDemo() {
  function checkIsKebabCase(name) {
    return !!regExp.test(name);
  }

  function isDemoExist(name) {
    const modulePath = path.join(__dirname, "../demos", name);
    return fs.existsSync(modulePath);
  }

  return inquirer
    .prompt([
      {
        type: "input",
        name: "srcName",
        message: "新建 demo 文件名"
      },
      {
        type: "input",
        name: "labelName",
        message: "新建 demo 中文名（最终展示的名字）"
      }
    ])
    .then((answers) => {
      const { srcName, labelName } = answers;
      if (!checkIsKebabCase(srcName)) {
        throw new Error(
          `为了统一规范，demo 命名格式请设置为 kebab-case，例如: skeleton-animation 而不是 skeletonAnimation`
        );
      }
      if (isDemoExist(srcName)) {
        throw new Error(`demo ${srcName} 已经存在`);
      }
      return {
        srcName,
        labelName
      };
    });
}

/**
 * 拷贝模板
 * @param name
 */
function copyTemplates(name) {
  const from = path.join(__dirname, "../demo-template");
  const to = path.join(__dirname, "../demos", name);
  copydir.sync(from, to, {
    utimes: true, // keep add time and modify time
    mode: true, // keep file mode
    cover: false // cover file when exists, default is true
  });
}

/**
 * 追加 demo 列表
 * @param srcName  - 文件名
 * @param labelName - 展示中文名
 */
function addDemoList(srcName, labelName) {
  const file = path.join(__dirname, "../demos/.demoList.json");
  const demoList = fs.readJsonSync(file);

  demoList.push({
    label: labelName,
    src: srcName
  });
  fs.outputJsonSync(file, demoList);
}

async function main() {
  try {
    const { srcName, labelName } = await inquirerDemo();
    copyTemplates(srcName);
    addDemoList(srcName, labelName);
  } catch (e) {
    console.log(chalk.redBright(e.message));
  }
}

main();
