**在线示例**： [Oasis Playground](https://oasis-engine.github.io/0.1/playground/index.html)

### 1. 安装

#### 1.1 初始化

```
npm install
```

#### 1.2 link

```
npm run link
```

### 2. 本地开发

#### 2.1 线上版本开发

> 该方式适用于线上效果开发。如果需要联调引擎源码，请使用 vite 开发

```
npm run dev
```

#### 2.2 vite 开发

> 保留了原来的 vite 开发流程，方便 link Oasis 仓库进行源码调试

```
npm run dev:vite
```

如果需要调试 Oasis 引擎源码，请先 link 再进行调试，即：

```
npm run link
```

如果需要监听引擎源码的变化，即同时调试引擎和游乐场，可以在**引擎**的仓库里面运行 watch：

```
npm run watch
```

> 注意： 默认 Oasis 引擎仓库在 ../engine，若不是，请自行修改 script#link

#### 2.3 新建 demo

```
npm run add-demo
```
按照提示输入完英文名字和中文名字后，即可在`/demos/*****/index.ts` 进行开发

### 3. 发布

```
npm run build
```

### 4. 配置

#### 4.1 全局配置

- 在 `/.demosrc.js` 下进行全局配置，具体参考 [demosify](http://www.demosify.com/#/zh-cn/basic?id=demosrc)

- 依赖包全部以 umd 包 CDN 打入，如有新增包依赖，在 `demosrc.js/globalPackages` 中追加即可。

#### 4.2 目录配置

在 `/demos/.demoList.json` 中进行分目录配置，具体参考 [demosify](http://www.demosify.com/#/zh-cn/basic?id=demolist)

#### 4.3 具体 demo 配置

在 `/demos/***/config.js` 中针对单个 demo 进行配置，具体参考 [demosify](http://www.demosify.com/#/zh-cn/basic?id=configjs)

#### 4.4 transform 配置

为了方便本地开发+发布使用同一套 ESM 代码,游乐场的 ts 代码实际经过了 `/demos/transform.js` 的转换：

- typescript -> js
- esm -> window

转换前：

```
import { OrbitControl } from "@oasis-engine/controls";
import { FramebufferPicker } from "@oasis-engine/framebuffer-picker";
import {
  AssetType,
  Camera,
  EnvironmentMapLight,
  Logger,
  MeshRenderer,
  SystemInfo,
  Vector3,
  Vector4,
  WebGLEngine
} from "oasis-engine";
```

转换后：

```
const { OrbitControl } = window["o3Controls"];
const { FramebufferPicker } = window["o3FramebufferPicker"];
const {
  AssetType,
  Camera,
  EnvironmentMapLight,
  Logger,
  MeshRenderer,
  SystemInfo,
  Vector3,
  Vector4,
  WebGLEngine
} = window["o3"];
```

module 名字映射以及转换规则可以在`transform.js/modules` 和`transform.js/replace` 进行配置

### 5. 资源

#### 5.1 线下

如果使用 vite 本地开发调试，可以直接将资源放在`/public/static`中 ,代码中使用`/static/***`使用即可

#### 5.2 线上

线上版本需要使用 cdn 资源。即代码使用 `https://***` 格式。 **推荐**：可以将优秀的模型、纹理等资源集中到 [Basement- Oasis Hub](https://yuyan-base.antfin-inc.com/OasisHub/file/detail/5fab5817c3dc8a0547aa9325?page=1&type=others) 进行统一管理
