import { OrbitControl } from "@oasis-engine/controls";
import {
  Animator,
  Camera,
  DirectLight,
  EnvironmentMapLight,
  Logger,
  SystemInfo,
  Vector3,
  WebGLEngine,
  AnimatorController,
  AnimatorControllerLayer,
  AnimatorStateMachine,
  AnimatorLayerBlendingMode,
  AnimationClip,
  AnimatorState
} from "oasis-engine";

Logger.enable();

const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;
const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// camera
const cameraEntity = rootEntity.createChild("camera_node");
cameraEntity.transform.position = new Vector3(0, 1, 5);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl).target = new Vector3(0, 1, 0);

const lightNode = rootEntity.createChild("light_node");
rootEntity.addComponent(EnvironmentMapLight);
lightNode.addComponent(DirectLight).intensity = 0.6;
lightNode.transform.lookAt(new Vector3(0, 0, 1));
lightNode.transform.rotate(new Vector3(0, 90, 0));

engine.resourceManager
  .load("https://gw.alipayobjects.com/os/basement_prod/aa318303-d7c9-4cb8-8c5a-9cf3855fd1e6.gltf")
  .then((asset) => {
    const { animations, defaultSceneRoot } = asset;
    const animator = defaultSceneRoot.addComponent(Animator);
    const animatorController = new AnimatorController();
    const layer = new AnimatorControllerLayer("layer");
    const animatorStateMachine = new AnimatorStateMachine();
    animatorController.addLayer(layer);
    animator.animatorController = animatorController;
    layer.stateMachine = animatorStateMachine;
    if (animations) {
      animations.forEach((clip: AnimationClip) => {
        const animatorState = animatorStateMachine.addState(clip.name);
        animatorState.clip = clip;
      });
    }
    rootEntity.addChild(defaultSceneRoot);
    animator.play();
  });

engine.run();
