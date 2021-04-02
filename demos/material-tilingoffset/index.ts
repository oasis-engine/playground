import { OrbitControl } from "@oasis-engine/controls";
import * as dat from "dat.gui";
import {
  AssetType,
  BlinnPhongMaterial,
  Camera,
  MeshRenderer,
  PrimitiveMesh,
  RenderFace,
  Script,
  SystemInfo,
  Texture2D,
  Vector3,
  WebGLEngine
} from "oasis-engine";

// Create engine object
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// Create camera
const cameraEntity = rootEntity.createChild("Camera");
cameraEntity.transform.position = new Vector3(0, 0, 20);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

engine.run();

// Create plane
const mesh = PrimitiveMesh.createPlane(engine, 10, 10);
const entity = rootEntity.createChild();
const renderer = entity.addComponent(MeshRenderer);
const material = new BlinnPhongMaterial(engine);
material.renderFace = RenderFace.Double;

renderer.mesh = mesh;
renderer.setMaterial(material);

// Load texture
engine.resourceManager
  .load<Texture2D>({
    url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*g8r4S51En90AAAAAAAAAAAAAARQnAQ",
    type: AssetType.Texture2D
  })
  .then((texture) => {
    texture.anisoLevel = 16;
    material.emissiveTexture = texture;
    material.emissiveColor.setValue(1, 1, 1, 1);
  });

// Debug material
const gui = new dat.GUI();
const guiDebug = {
  tilingX: 1,
  tilingY: 1,
  offsetX: 0,
  offsetY: 0,
  reset: function () {
    guiDebug.tilingX = 1;
    guiDebug.tilingY = 1;
    guiDebug.offsetX = 0;
    guiDebug.offsetY = 0;
    material.tilingOffset.setValue(1, 1, 0, 0);
  },
  pause: function () {
    animationScript.enabled = false;
  },
  resume: function () {
    animationScript.enabled = true;
  }
};

gui
  .add(guiDebug, "tilingX", 0, 10)
  .onChange((value: number) => {
    material.tilingOffset.x = value;
  })
  .listen();
gui
  .add(guiDebug, "tilingY", 0, 10)
  .onChange((value: number) => {
    material.tilingOffset.y = value;
  })
  .listen();
gui
  .add(guiDebug, "offsetX", 0, 1)
  .onChange((value: number) => {
    material.tilingOffset.z = value;
  })
  .listen();
gui
  .add(guiDebug, "offsetY", 0, 1)
  .onChange((value: number) => {
    material.tilingOffset.w = value;
  })
  .listen();
gui.add(guiDebug, "reset").name("重置");
gui.add(guiDebug, "pause").name("暂停动画");
gui.add(guiDebug, "resume").name("继续动画");

class AnimateScript extends Script {
  onUpdate(delta) {
    material.tilingOffset.x = guiDebug.tilingX = ((guiDebug.tilingX - 1 + delta * 0.001) % 9) + 1;
    material.tilingOffset.y = guiDebug.tilingY = ((guiDebug.tilingY - 1 + delta * 0.001) % 9) + 1;
  }
}
const animationScript = rootEntity.addComponent(AnimateScript);
