import { OrbitControl } from "@oasis-engine/controls";
import {
  Camera,
  PrimitiveMesh,
  MeshRenderer,
  SystemInfo,
  WebGLEngine,
  Script,
  Entity,
  BlinnPhongMaterial,
  Texture2D,
  AssetType,
  DirectLight
} from "oasis-engine";

class RotateScript extends Script {
  constructor(entity: Entity) {
    super(entity);
  }

  onUpdate() {
    this.entity.transform.rotate(0.5, 0.6, 0);
  }
}

// Create engine object
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// Create camera
const cameraEntity = rootEntity.createChild("Camera");
cameraEntity.transform.setPosition(0, 0, 50);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

// Create direct light
const lightEntity = rootEntity.createChild("DirectLight");
const light = lightEntity.addComponent(DirectLight);
light.color.setValue(1, 1, 1, 1);
light.intensity = 0.3;

const distanceX = 8;
const distanceY = 8;

engine.resourceManager
  .load<Texture2D>({
    url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*ArCHTbfVPXUAAAAAAAAAAAAAARQnAQ",
    type: AssetType.Texture2D
  })
  .then((texture) => {
    const material = new BlinnPhongMaterial(engine);
    material.emissiveTexture = texture;
    material.emissiveColor.setValue(1, 1, 1, 1);

    for (let i = 0; i < 3; ++i) {
      const posX = (i - 1) * distanceX;

      // Create cuboid
      const cuboidEntity = rootEntity.createChild("cuboid");
      const cuboidTransform = cuboidEntity.transform;
      cuboidTransform.setPosition(posX, distanceY * 1.5, 0);
      cuboidTransform.setScale(3, 3, 3);
      cuboidEntity.addComponent(RotateScript);
      const cuboidRenderer = cuboidEntity.addComponent(MeshRenderer);
      cuboidRenderer.mesh = PrimitiveMesh.createCuboid(engine);
      cuboidRenderer.setMaterial(material);

      // Create sphere
      const sphereEntity = rootEntity.createChild("sphere");
      const sphereTransform = sphereEntity.transform;
      sphereTransform.setPosition(posX, distanceY * 0.5, 0);
      sphereTransform.setScale(3, 3, 3);
      sphereEntity.addComponent(RotateScript);
      const sphereRenderer = sphereEntity.addComponent(MeshRenderer);
      sphereRenderer.mesh = PrimitiveMesh.createSphere(engine, 0.5, (i + 1) * 6);
      sphereRenderer.setMaterial(material);

      // Create plane
      const planeEntity = rootEntity.createChild("plane");
      const planeTransform = planeEntity.transform;
      planeTransform.setPosition(posX, -distanceY * 0.5, 0);
      planeTransform.setScale(3, 3, 3);
      planeEntity.addComponent(RotateScript);
      const planeRenderer = planeEntity.addComponent(MeshRenderer);
      planeRenderer.mesh = PrimitiveMesh.createPlane(engine);
      planeRenderer.setMaterial(material);

      // Create cylinder
      const cylinderEntity = rootEntity.createChild("cylinder");
      const cylinderTransform = cylinderEntity.transform;
      cylinderTransform.setPosition(posX, -distanceY * 1.5, 0);
      cylinderTransform.setScale(3, 3, 3);
      cylinderEntity.addComponent(RotateScript);
      const cylinderRenderer = cylinderEntity.addComponent(MeshRenderer);
      cylinderRenderer.mesh = PrimitiveMesh.createCylinder(engine, 0.5, 2, (i + 1) * 6, 1);
      cylinderRenderer.setMaterial(material);
    }
  });

engine.run();
