import { Camera, Vector3, WebGLEngine, Logger } from "oasis-engine";
import { createCube } from "./cube";
import { createPlane } from "./plane";

// Create engine
const engine = new WebGLEngine("o3-demo");
engine.canvas.resizeByClientSize();

// Create root entity
const rootEntity = engine.sceneManager.activeScene.createRootEntity();

// Create camera
const cameraEntity = rootEntity.createChild("Camera");
cameraEntity.transform.setPosition(0, 10000, 10000);
cameraEntity.transform.lookAt(new Vector3(0, 8000, 0));
const camera = cameraEntity.addComponent(Camera);
camera.farClipPlane = 400000;
camera.fieldOfView = 55;

// createCube(engine, rootEntity);
createPlane(engine, rootEntity);
engine.run();
Logger.enable();
