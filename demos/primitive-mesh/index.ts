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
  WebGLEngine
} from "oasis-engine";

// Create engine
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

// Create root entity
const rootEntity = engine.sceneManager.activeScene.createRootEntity();

// Create camera
const cameraEntity = rootEntity.createChild("Camera");
cameraEntity.transform.setPosition(0, 0, 20);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

// Create direct light
const lightEntity = rootEntity.createChild("DirectLight");
const light = lightEntity.addComponent(DirectLight);
light.intensity = 0.3;

engine.resourceManager
  .load<Texture2D>({
    url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*ArCHTbfVPXUAAAAAAAAAAAAAARQnAQ",
    type: AssetType.Texture2D
  })
  .then((texture) => {
    const distanceX = 2.5;
    const distanceY = 2.5;
    const position = new Vector3();

    // Create material
    const material = new BlinnPhongMaterial(engine);
    material.emissiveTexture = texture;
    material.emissiveColor.setValue(1, 1, 1, 1);

    for (let i = 0; i < 3; i++) {
      const posX = (i - 1) * distanceX;

      // Create cuboid
      position.setValue(posX, distanceY * 2.5, 0);
      generatePrimitiveEntity("cuboid", position, material, PrimitiveMesh.createCuboid(engine));

      // Create sphere
      position.setValue(posX, distanceY * 1.5, 0);
      generatePrimitiveEntity("sphere", position, material, PrimitiveMesh.createSphere(engine));

      // Create plane
      position.setValue(posX, distanceY * 0.5, 0);
      generatePrimitiveEntity("plane", position, material, PrimitiveMesh.createPlane(engine));

      // Create cylinder
      position.setValue(posX, -distanceY * 0.5, 0);
      generatePrimitiveEntity("cylinder", position, material, PrimitiveMesh.createCylinder(engine));

      // Create cone
      position.setValue(posX, -distanceY * 1.5, 0);
      generatePrimitiveEntity("cone", position, material, PrimitiveMesh.createCone(engine));

      // Create turos
      position.setValue(posX, -distanceY * 2.5, 0);
      generatePrimitiveEntity("torus", position, material, PrimitiveMesh.createTorus(engine));
    }
  });

// Run engine
engine.run();

function generatePrimitiveEntity(name: string, position: Vector3, material: Material, mesh: ModelMesh): Entity {
  const entity = rootEntity.createChild(name);
  entity.transform.setPosition(position.x, position.y, position.z);
  entity.addComponent(RotateScript);
  const renderer = entity.addComponent(MeshRenderer);
  renderer.mesh = mesh;
  renderer.setMaterial(material);

  return entity;
}

class RotateScript extends Script {
  onUpdate() {
    this.entity.transform.rotate(0.5, 0.6, 0);
  }
}
