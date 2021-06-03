#! /usr/bin/env node

"use strict";
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const prettier = require("prettier");
const regExp = /^([a-z0-9-])+$/g;

const file = path.join(__dirname, "../demos/.demoList.json");
const demoList = fs.readJsonSync(file);

/**
 * 询问新建 demo 名称
 * @returns {PromiseLike<T | never> | Promise<T | never> | *}
 */
function inquirerDemo() {
  let groupSrcName = "",
    groupLabelName = "";

  function checkIsKebabCase(name) {
    regExp.lastIndex = 0;
    return !!regExp.test(name);
  }

  function isDemoExist(group = "", name = "") {
    const modulePath = path.join(__dirname, "../demos", group, name);
    return fs.existsSync(modulePath);
  }

  return inquirer
    .prompt([
      {
        type: "list",
        name: "needGroup",
        message: "Do you need secondary directory?",
        choices: [
          {
            name: "Yes",
            value: true
          },
          {
            name: "No",
            value: false
          }
        ]
      },
      {
        type: "list",
        name: "groupSrcName",
        message: "Select a group already existing",
        when: ({ needGroup }) => needGroup && demoList.some((d) => d.group),
        choices: [
          ...demoList.filter((d) => d.group).map((d) => d.src),
          new inquirer.Separator(),
          {
            name: "No wanted? Add new group",
            value: "",
            short: " "
          },
          new inquirer.Separator()
        ]
      },
      {
        type: "input",
        name: "groupSrcNameNew",
        message: "group's file name",
        when: ({ needGroup, groupSrcName }) => {
          return needGroup && !groupSrcName;
        },
        validate: (name) => {
          if (!checkIsKebabCase(name)) {
            return `To unify the standard, please set the group naming format with kebab-case, for example: use "skeleton-animation" instead of "skeletonAnimation"`;
          }
          if (isDemoExist(name)) {
            return `group ${name} already exists`;
          }
          return true;
        }
      },
      {
        type: "input",
        name: "groupLabelName",
        message: "group's displayed name",
        when: ({ needGroup, groupSrcName, groupSrcNameNew }) =>
          needGroup && !demoList.some((d) => d.group && (d.src === groupSrcName || d.src === groupSrcNameNew)),
        validate: (name) => {
          if (name) {
            return true;
          }
          return "display name can't be empty";
        }
      },
      {
        type: "input",
        name: "srcName",
        message: "file name",
        when: (answer) => {
          groupSrcName = answer.groupSrcName || answer.groupSrcNameNew;
          groupLabelName = answer.groupLabelName;
          return true;
        },
        validate: (name) => {
          if (!checkIsKebabCase(name)) {
            return `To unify the standard, please set the demo naming format with kebab-case, for example: use "skeleton-animation" instead of "skeletonAnimation"`;
          }
          if (isDemoExist(groupSrcName, name)) {
            return `demo ${name} already exists`;
          }
          return true;
        }
      },
      {
        type: "input",
        name: "labelName",
        message: "displayed name",
        validate: (name) => {
          if (name) {
            return true;
          }
          return "display name can't be empty";
        }
      }
    ])
    .then((answers) => {
      const { needGroup, srcName, labelName } = answers;

      return {
        needGroup,
        groupSrcName,
        groupLabelName,
        srcName,
        labelName
      };
    });
}

/**
 * 拷贝模板
 * @param name
 */
function copyTemplate(name) {
  const from = path.join(__dirname, "../demo-template");
  const to = path.join(__dirname, "../demos", name);
  fs.copy(from, to);
}

/**
 * 拷贝二级模板
 * @param group
 * @param name
 */
function copyGroupTemplate(group, name) {
  const from = path.join(__dirname, "../demo-group-template");
  const to = path.join(__dirname, "../demos", group, name);
  fs.copy(from, to);
}

/**
 * 追加 demo
 * @param srcName  - 文件名
 * @param labelName - 展示中文名
 */
function addDemo(srcName, labelName) {
  demoList.push({
    src: srcName,
    label: labelName
  });
  prettier.resolveConfig(path.join(__dirname, "../.prertttierrc.yml")).then((config) => {
    fs.outputFile(
      file,
      prettier.format(JSON.stringify(demoList), {
        ...config,
        parser: "json"
      })
    );
  });
}

/**
 * 追加 group
 * @param groupSrcName  - 组文件名
 * @param groupLabelName  - 组展示名
 * @param srcName  - 文件名
 * @param labelName - 展示中文名
 */
function addGroupDemo(groupSrcName, groupLabelName, srcName, labelName) {
  const demo = {
    src: srcName,
    label: labelName
  };
  const groupFind = demoList.find((d) => d.src === groupSrcName);
  if (groupFind) {
    groupFind.demos.push(demo);
  } else {
    demoList.push({
      group: groupLabelName,
      src: groupSrcName,
      demos: [demo]
    });
  }
  prettier.resolveConfig(path.join(__dirname, "../.prertttierrc.yml")).then((config) => {
    fs.outputFile(
      file,
      prettier.format(JSON.stringify(demoList), {
        ...config,
        parser: "json"
      })
    );
  });
}

async function main() {
  try {
    const { needGroup, groupSrcName, groupLabelName, srcName, labelName } = await inquirerDemo();

    if (needGroup) {
      copyGroupTemplate(groupSrcName, srcName);
      addGroupDemo(groupSrcName, groupLabelName, srcName, labelName);
    } else {
      copyTemplate(srcName);
      addDemo(srcName, labelName);
    }
  } catch (e) {
    console.log(chalk.redBright(e.message));
  }
}

main();
