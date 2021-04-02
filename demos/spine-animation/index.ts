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
    url: "http://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/bakery/Fish.json",
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
