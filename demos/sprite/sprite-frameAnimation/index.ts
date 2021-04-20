import {OrbitControl} from "@oasis-engine/controls";
import {Entity} from "oasis-engine";
import {Vector2} from "oasis-engine";
import {Rect} from "oasis-engine";
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

function parseFrameAnimation(frameInfo, sizeInfo): Array < any > {
  return Object.values(frameInfo).map(function (frameInfo : any) {
      frameInfo.frame.x /= sizeInfo.w;
      frameInfo.frame.y /= sizeInfo.h;
      frameInfo.frame.w /= sizeInfo.w;
      frameInfo.frame.h /= sizeInfo.h;
      return frameInfo;
  })
}

// Script for sprite
class FrameSpriteScrip extends Script {
    // FrameAniamtion renderer
    private _renderer : SpriteRenderer;
    // total frames
    private _totalFrames = 0;
    // frame interval time
    private _frameInterval;
    // group of animations
    private _frameArr : Array < any >;
    // play this group of animations at 100ms intervals
    play(frameArr : any[], interval = 100) {
        if (frameArr && frameArr.length > 0) {
            this._renderer = this._entity.getComponent(SpriteRenderer);
            this._frameArr = frameArr;
            this._totalFrames = frameArr.length;
            this._frameInterval = interval;
            this.frameIndex = 0;
        } else {
            this._totalFrames = 0;
        }
    }

    private _cumulativeTime = 0;
    onUpdate(deltaTime : number) {
        if (this._totalFrames<= 0) {
            return;
        }
        const {_frameInterval: _interval} = this;
        this._cumulativeTime += deltaTime;
        if (this._cumulativeTime >= _interval) { 
            // need update frameIndex
            var addTimes = Math.floor(this._cumulativeTime / _interval);
            this._cumulativeTime -= addTimes * _interval;
            this.frameIndex = (this._frameIndex + addTimes) % this._totalFrames;
        } else { 
            // no change
        }
    }

    private _frameIndex : number;
    private reuseRect = new Rect(0, 0, 0, 0);
    private reuseVec2 = new Vector2(0, 0);
    // update sprite‘s region and pivot
    private set frameIndex(frameIndex : number) {
        if (this._frameIndex != frameIndex) {
            this._frameIndex = frameIndex;
            const frameInfo = this._frameArr[frameIndex];
            const {sprite} = this._renderer;
            sprite.region = this.reuseRect.setValue(frameInfo.frame.x, frameInfo.frame.y, frameInfo.frame.w, frameInfo.frame.h);
            sprite.pivot = this.reuseVec2.setValue(frameInfo.pivot.x, frameInfo.pivot.y);
        }
    }
}

// load animations
engine.resourceManager.load([{
        url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*5l7FRagIZO0AAAAAAAAAAAAAARQnAQ",
        type: AssetType.Texture2D
    }, "https://gw.alipayobjects.com/os/bmw-prod/c5072f0c-85fe-468f-84a3-3d7d68289413.json"]).then((res) => { // Create sprite renderer
    const spriteRenderer = spriteEntity.addComponent(SpriteRenderer);
    const sprite: Sprite = new Sprite(engine, res[0]);
    spriteRenderer.sprite = sprite;
    // add and play FrameAnimation
    spriteEntity.addComponent(FrameSpriteScrip).play(parseFrameAnimation(res[1].frames, res[1].meta.size));
});

engine.run();