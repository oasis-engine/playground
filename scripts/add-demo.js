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
        message: "file name"
      },
      {
        type: "input",
        name: "labelName",
        message: "displayed name"
      }
    ])
    .then((answers) => {
      const { srcName, labelName } = answers;
      if (!checkIsKebabCase(srcName)) {
        throw new Error(
          `To unify the standard, please set the demo naming format with kebab-case, for example: use "skeleton-animation" instead of "skeletonAnimation"`
        );
      }
      if (isDemoExist(srcName)) {
        throw new Error(`demo ${srcName} already exists`);
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
