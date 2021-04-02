import { OrbitControl } from "@oasis-engine/controls";
import * as dat from "dat.gui";
import {
  Animation,
  Camera,
  Color,
  DirectLight,
  GLTFResource,
  PBRMaterial,
  SystemInfo,
  Vector3,
  WebGLEngine
} from "oasis-engine";

const gui = new dat.GUI();

//-- create engine object
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();
const lightEntity = rootEntity.createChild("light");
lightEntity.transform.rotate(0, 180, 0);
lightEntity.addComponent(DirectLight);

//-- create camera
const cameraEntity = rootEntity.createChild("camera_entity");
cameraEntity.transform.position = new Vector3(0, 0, -10);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

engine.run();

engine.resourceManager
  .load<GLTFResource>(
    "https://gw.alipayobjects.com/os/OasisHub/e190227d-d527-4a8d-9981-b4bf2da3dc2c/110000216/0.9421391626744058.gltf"
  )
  .then((asset) => {
    const { animations, defaultSceneRoot, materials } = asset;
    const animationNameList = animations.map(({ name }) => name);

    materials.forEach((material) => {
      (<PBRMaterial>material).baseColor = new Color(1, 1, 1, 1);
    });

    rootEntity.addChild(defaultSceneRoot);

    const animator = defaultSceneRoot.getComponent(Animation);
    animator.playAnimationClip(animationNameList[0]);

    const debugInfo = {
      animation: animationNameList[0],
      crossFade: true,
      crossTime: 1000
    };

    gui.add(debugInfo, "animation", animationNameList).onChange((v) => {
      const { crossFade, crossTime } = debugInfo;

      if (crossFade) {
        animator.crossFade(v, crossTime);
      } else {
        animator.playAnimationClip(v);
      }
    });

    gui.add(debugInfo, "crossFade");
    gui.add(debugInfo, "crossTime", 0, 5000).name("过渡时间(毫秒)");
  });
