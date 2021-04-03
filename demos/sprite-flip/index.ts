import { OrbitControl } from "@oasis-engine/controls";
import {
  AssetType,
  Camera,
  Entity,
  Sprite,
  SpriteRenderer,
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
cameraEntity.transform.position = new Vector3(0, 0, 50);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

engine.resourceManager
  .load<Texture2D>({
    url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*KjnzTpE8LdAAAAAAAAAAAAAAARQnAQ",
    type: AssetType.Texture2D
  })
  .then((texture) => {
    // Display normal
    const spriteEntity = rootEntity.createChild("spriteFlip");
    spriteEntity.transform.setPosition(-15, 0, 0);
    const spriteRenderer = spriteEntity.addComponent(SpriteRenderer);
    spriteRenderer.sprite = new Sprite(engine, texture);

    // Display flip x
    showFlipEntity(spriteEntity, -5, true, false);
    // Display flip y
    showFlipEntity(spriteEntity, 5, false, true);
    // Display flip x and y
    showFlipEntity(spriteEntity, 15, true, true);
  });

engine.run();

function showFlipEntity(entity: Entity, posX: number, flipX: boolean, flipY: boolean): void {
  const flipEntity = entity.clone();
  rootEntity.addChild(flipEntity);
  flipEntity.transform.setPosition(posX, 0, 0);
  const flipRenderer = flipEntity.getComponent(SpriteRenderer);
  flipRenderer.flipX = flipX;
  flipRenderer.flipY = flipY;
}
