import { OrbitControl } from "@oasis-engine/controls";
import {
  AssetType,
  Camera,
  Script,
  Sprite,
  SpriteRenderer,
  SystemInfo,
  Texture2D,
  Vector3,
  WebGLEngine
} from "oasis-engine";

//-- script for sprite
class SpriteController extends Script {
  static _curRotation: number = 0;
  private _curRadian: number;
  private _radius: number;
  private _scale: number;
  private _scaleFlag: boolean;

  onAwake() {
    this._curRadian = 0;
    this._radius = 15;
    this._scale = 1.0;
    this._scaleFlag = true;
  }

  onUpdate() {
    // Update position.
    this._curRadian += 0.01;
    const { _radius, _curRadian, entity } = this;
    const { transform } = entity;
    const posX = Math.cos(_curRadian) * _radius;
    const posY = Math.sin(_curRadian) * _radius;
    transform.setPosition(posX, posY, 0);

    // Update scale.
    this._scale += this._scaleFlag ? 0.01 : -0.01;
    const { _scale } = this;
    transform.setScale(_scale, _scale, _scale);
    if (this._scale >= 1.5) {
      this._scaleFlag = false;
    } else if (this._scale <= 0.5) {
      this._scaleFlag = true;
    }

    // Update rotation.
    SpriteController._curRotation += 0.1;
    const { _curRotation } = SpriteController;
    transform.setRotation(0, 0, _curRotation);
  }
}

//-- create engine object
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

//-- create camera
const cameraEntity = rootEntity.createChild("camera_entity");
cameraEntity.transform.setPosition(0, 0, 50);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

//-- create sprite renderer
engine.resourceManager
  .load<Texture2D>({
    url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*d3N9RYpcKncAAAAAAAAAAAAAARQnAQ",
    type: AssetType.Texture2D
  })
  .then((resource) => {
    for (let i = 0; i < 10; ++i) {
      setTimeout(() => {
        const spriteEntity = rootEntity.createChild(`sprite_${i}`);
        spriteEntity.transform.position = new Vector3(0, 0, 0);
        const spriteComponent = spriteEntity.addComponent(SpriteRenderer);
        const sprite = new Sprite(engine, resource);
        spriteComponent.sprite = sprite;
        // spriteComponent.flipX = true;
        // spriteComponent.flipY = true;
        const rect = spriteComponent.sprite.rect;
        const scaleX = 100.0 / rect.width;
        const scaleY = 100.0 / rect.height;
        spriteEntity.transform.setScale(scaleX, scaleY, 1);
        spriteEntity.addComponent(SpriteController);
      }, 1000 * i);
    }
  });

engine.run();
