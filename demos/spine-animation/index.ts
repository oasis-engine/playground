import { Camera, Logger, SystemInfo, Vector3, WebGLEngine, Entity } from "oasis-engine";
import { SpineAnimation } from "@oasis-engine/engine-spine";

Logger.enable();

const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;
const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// camera
const cameraEntity = rootEntity.createChild("camera_node");
const camera = cameraEntity.addComponent(Camera);
camera.farClipPlane = 2000000;
camera.nearClipPlane = 0.001;
cameraEntity.transform.position = new Vector3(0, 0, 12);

engine.resourceManager
  .load({
    // @ts-ignore
    urls: [
      "https://gw.alipayobjects.com/os/OasisHub/dfad57bd-b6ae-4c73-9a77-d74d66ab8757/1617361412465.json",
      "https://gw.alipayobjects.com/os/OasisHub/bb62c664-59ff-437a-88a8-6c8a42c8bbd7/1617361412468.atlas",
      "https://gw.alipayobjects.com/zos/OasisHub/72300d5b-d2b0-407d-9f9b-1b0e4f80e935/1617361412468.png"
    ],
    // @ts-ignore
    type: "spine"
  })
  .then((spineEntity: Entity) => {
    rootEntity.addChild(spineEntity);
    const spineAnimation = spineEntity.getComponent(SpineAnimation);
    spineAnimation.state.setAnimation(0, "animation", true);
    spineAnimation.skeleton.scaleX = 0.007;
    spineAnimation.skeleton.scaleY = 0.007;
  });

engine.run();
