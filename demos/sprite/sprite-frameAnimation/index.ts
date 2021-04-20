import { OrbitControl } from "@oasis-engine/controls";
import { Entity } from "oasis-engine";
import { Vector2 } from "oasis-engine";
import { Rect } from "oasis-engine";
import { AssetType, Camera, Script, Sprite, SpriteRenderer, SystemInfo, Texture2D, WebGLEngine } from "oasis-engine";

// Create engine object
const engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

// Create rootEntity
const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// Create spriteEntity
const spriteEntity = new Entity(engine);
rootEntity.addChild(spriteEntity);
spriteEntity.transform.setScale(10, 10, 10);

// Create camera
const cameraEntity: Entity = rootEntity.createChild("camera_entity");
cameraEntity.transform.setPosition(0, 0, 50);
cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

// Load Texture2D
engine.resourceManager
  .load({
    url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*zcZVTKry5R4AAAAAAAAAAAAAARQnAQ",
    type: AssetType.Texture2D
  })
  .then((texture: Texture2D): void => {
    // add spriteRenderer
    spriteEntity.addComponent(SpriteRenderer).sprite = new Sprite(engine, texture);
    spriteEntity.addComponent(FrameSpriteScrip);
  });

engine.run();

// Script for sprite
class FrameSpriteScrip extends Script {
  // FrameAniamtion renderer
  private _renderer: SpriteRenderer;
  // Group of region
  private _regions: Vector2[];
  // Reciprocal Of SliceWidth
  private _reciprocalOfSliceWidth: number;
  // Reciprocal Of SliceHeight
  private _reciprocalOfSliceHeight: number;
  // Total frames
  private _totalFrames: number = 16;
  // Frame interval time
  private _frameInterval: number = 100;
  // Now index of frames
  private _frameIndex: number;
  private _reuseRect: Rect = new Rect(0, 0, 0, 0);
  private _cumulativeTime: number = 0;

  onAwake(): void {
    this._renderer = this._entity.getComponent(SpriteRenderer);
    const row = 4,
      line = 4,
      reciprocalOfSliceWidth = 1 / row,
      reciprocalOfSliceHeight = 1 / line;
    const regions: Vector2[] = [];
    for (let j = 0; j < line; j++) {
      let tempY = j * reciprocalOfSliceHeight;
      for (let i = 0; i < row; i++) {
        regions.push(new Vector2(i * reciprocalOfSliceWidth, tempY));
      }
    }
    this._regions = regions;
    this._reciprocalOfSliceWidth = reciprocalOfSliceWidth;
    this._reciprocalOfSliceHeight = reciprocalOfSliceHeight;
    this._setFrameIndex(0);
  }

  onUpdate(deltaTime: number): void {
    if (this._totalFrames <= 0) {
      return;
    }
    const { _frameInterval } = this;
    this._cumulativeTime += deltaTime;

    if (this._cumulativeTime >= _frameInterval) {
      // need update frameIndex
      const addTimes = Math.floor(this._cumulativeTime / _frameInterval);
      this._cumulativeTime -= addTimes * _frameInterval;
      this._setFrameIndex((this._frameIndex + addTimes) % this._totalFrames);
    }
  }

  // Index of frames
  private _setFrameIndex(frameIndex: number) {
    if (this._frameIndex != frameIndex) {
      console.log(frameIndex);
      this._frameIndex = frameIndex;
      const frameInfo = this._regions[frameIndex];
      this._renderer.sprite.region = this._reuseRect.setValue(
        frameInfo.x,
        frameInfo.y,
        this._reciprocalOfSliceWidth,
        this._reciprocalOfSliceHeight
      );
    }
  }
}
