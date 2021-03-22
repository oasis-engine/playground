import { OrbitControl } from "@oasis-engine/controls";
import {
  AssetType,
  BlinnPhongMaterial,
  Camera,
  DirectLight,
  Entity,
  Material,
  MeshRenderer,
  ModelMesh,
  PrimitiveMesh,
  Script,
  SystemInfo,
  Texture2D,
  Vector3,
  Shader,
  WebGLEngine,
  Logger,
  Color
} from "oasis-engine";
import { createCube } from "./cube";

// Create engine
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

// Create root entity
const rootEntity = engine.sceneManager.activeScene.createRootEntity();

// Create camera
const cameraEntity = rootEntity.createChild("Camera");
cameraEntity.transform.setPosition(5, 5, 5);
cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
const camera = cameraEntity.addComponent(Camera);
camera.fieldOfView = 60;

createCube(engine, rootEntity);

engine.run();

Logger.enable();
