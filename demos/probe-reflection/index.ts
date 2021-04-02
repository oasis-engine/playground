import { OrbitControl } from "@oasis-engine/controls";
import * as dat from "dat.gui";
import {
  AmbientLight,
  AssetType,
  BlinnPhongMaterial,
  Camera,
  Color,
  CubeProbe,
  DirectLight,
  EnvironmentMapLight,
  GLTFResource,
  Layer,
  MeshRenderer,
  PrimitiveMesh,
  Script,
  SkyBox,
  SystemInfo,
  TextureCubeMap,
  Vector3,
  WebGLEngine
} from "oasis-engine";

//-- create engine object
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

const gui = new dat.GUI();
gui.domElement.style = "position:absolute;top:0px;left:50vw";

const envLightNode = rootEntity.createChild("env_light");
const envLight = envLightNode.addComponent(EnvironmentMapLight);

const directLightNode = rootEntity.createChild("dir_light");
const directLight = directLightNode.addComponent(DirectLight);

const ambient = rootEntity.addComponent(AmbientLight);
ambient.color = new Color(0.2, 0.2, 0.2);

//-- create camera
const cameraEntity = rootEntity.createChild("camera_node");
cameraEntity.transform.position = new Vector3(0, 0, 5);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

const skybox = rootEntity.addComponent(SkyBox);

async function loadModel() {
  return Promise.all([
    engine.resourceManager
      .load<GLTFResource>("https://gw.alipayobjects.com/os/bmw-prod/83219f61-7d20-4704-890a-60eb92aa6159.gltf")
      .then((gltf) => {
        rootEntity.addChild(gltf.defaultSceneRoot);
        console.log(gltf);
      }),
    engine.resourceManager
      .load<TextureCubeMap>({
        urls: [
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*Bk5FQKGOir4AAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_cPhR7JMDjkAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*trqjQp1nOMQAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_RXwRqwMK3EAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*q4Q6TroyuXcAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*DP5QTbTSAYgAAAAAAAAAAAAAARQnAQ"
        ],
        type: AssetType.TextureCube
      })
      .then((cubeMap) => {
        envLight.diffuseTexture = cubeMap;
      }),
    engine.resourceManager
      .load<TextureCubeMap>({
        urls: [
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*5w6_Rr6ML6IAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*TiT2TbN5cG4AAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*8GF6Q4LZefUAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*D5pdRqUHC3IAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_FooTIp6pNIAAAAAAAAAAAAAARQnAQ",
          "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*CYGZR7ogZfoAAAAAAAAAAAAAARQnAQ"
        ],
        type: AssetType.TextureCube
      })
      .then((cubeMap) => {
        envLight.specularTexture = cubeMap;
        skybox.skyBoxMap = cubeMap;
      })
  ]).then(() => {});
}

function createSphere(material) {
  const sphereEntity = rootEntity.createChild("sphere");
  const sphereRender = sphereEntity.addComponent(MeshRenderer);
  const geometry = PrimitiveMesh.createSphere(engine, 1, 64);
  sphereRender.mesh = geometry;
  sphereRender.setMaterial(material);
  return sphereEntity;
}

function reflectionDemo() {
  const sphere1Mat = new BlinnPhongMaterial(engine);
  sphere1Mat.baseColor = new Color(1, 0, 0, 1);
  const sphere2Mat = new BlinnPhongMaterial(engine);
  sphere2Mat.baseColor = new Color(0, 1, 0, 1);
  const sphere3Mat = new BlinnPhongMaterial(engine);
  sphere3Mat.baseColor = new Color(0, 0, 1, 1);

  const sphere1 = createSphere(sphere1Mat);
  const sphere2 = createSphere(sphere2Mat);
  const sphere3 = createSphere(sphere3Mat);
  const aMove1 = sphere1.addComponent(MoveScript);
  aMove1.radius = 4;
  aMove1.onX = () => 0;
  const aMove2 = sphere2.addComponent(MoveScript);
  aMove2.radius = 3;
  aMove2.onY = () => 0;
  const aMove3 = sphere3.addComponent(MoveScript);
  aMove3.onX = (time) => Math.sin(time + 2) * 5;
  aMove3.onY = (time) => Math.cos(time + 2) * 5;
  aMove3.onZ = () => 0;

  let probe = null;

  // debug
  const state = {
    enableAnimate: true,
    enableProbe: true,
    size: 1024,
    samples: 1
  };

  probe = cameraEntity.addComponent(CubeProbe);
  probe.probeLayer = Layer.Layer30;
  sphere1.layer = Layer.Layer30;
  sphere2.layer = Layer.Layer30;
  sphere3.layer = Layer.Layer30;
  rootEntity.layer = Layer.Layer30;

  probe.onTextureChange = (texture) => {
    envLight.specularTexture = texture;
  };
  gui
    .add(state, "enableAnimate")
    .onChange((v) => {
      aMove1.enabled = v;
      aMove2.enabled = v;
      aMove3.enabled = v;
    })
    .name("动画开关");
  gui
    .add(state, "enableProbe")
    .onChange((v) => {
      probe.enabled = v;
    })
    .name("环境反射开关");
  gui
    .add(state, "size", 1, 2048)
    .onChange((size) => {
      probe.width = probe.height = size;
    })
    .name("分辨率");

  const rhi = engine._hardwareRenderer;
  if (rhi.isWebGL2) {
    const max = rhi.capability.maxAntiAliasing;
    gui
      .add(state, "samples", 0, max, 1)
      .name("MSAA")
      .onChange((samples) => {
        probe.antiAliasing = samples;
      });
  }
}

/**
 * 旋转移动脚本
 */
class MoveScript extends Script {
  time = 0;
  radius = 5;
  onX;
  onY;
  onZ;

  constructor(node) {
    super(node);
    this.onX = (time) => {
      return Math.cos(time) * this.radius;
    };
    this.onY = (time) => {
      return Math.cos(time) * this.radius;
    };
    this.onZ = (time) => {
      return Math.sin(time) * this.radius;
    };
  }

  onUpdate(deltaTime) {
    this.time += deltaTime / 1000;
    let x = this.onX(this.time);
    let y = this.onY(this.time);
    let z = this.onZ(this.time);
    this.entity.transform.setPosition(x, y, z);
  }
}

loadModel().then(() => {
  engine.run();
  reflectionDemo();
});
