import { OrbitControl } from "@oasis-engine/controls";
import * as dat from "dat.gui";
import {
  AssetType,
  Camera,
  Color,
  DirectLight,
  GLTFResource,
  PBRMaterial,
  SkyBox,
  SystemInfo,
  Texture2D,
  TextureCubeMap,
  Vector3,
  WebGLEngine,
  DiffuseMode
} from "oasis-engine";

//-- create engine object
let engine = new WebGLEngine("o3-demo");
engine.canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
engine.canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

let scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

const color2glColor = (color) => new Color(color[0] / 255, color[1] / 255, color[2] / 255);
const glColor2Color = (color) => new Color(color[0] * 255, color[1] * 255, color[2] * 255);
const gui = new dat.GUI();
gui.domElement.style = "position:absolute;top:0px;left:50vw";

let ambientLight = scene.ambientLight;
let envFolder = gui.addFolder("EnvironmentMapLight");
envFolder.add(ambientLight, "specularIntensity", 0, 1);
envFolder.add(ambientLight, "diffuseIntensity", 0, 1);

let directLightColor = { color: [255, 255, 255] };
let directLightNode = rootEntity.createChild("dir_light");
let directLight = directLightNode.addComponent(DirectLight);
let dirFolder = gui.addFolder("DirectionalLight1");
dirFolder.add(directLight, "enabled");
dirFolder.addColor(directLightColor, "color").onChange((v) => (directLight.color = color2glColor(v)));
dirFolder.add(directLight, "intensity", 0, 1);

//-- create camera
let cameraNode = rootEntity.createChild("camera_node");
cameraNode.transform.position = new Vector3(0, 0, 5);
cameraNode.addComponent(Camera);
cameraNode.addComponent(OrbitControl);

Promise.all([
  engine.resourceManager
    .load<GLTFResource>("https://gw.alipayobjects.com/os/bmw-prod/83219f61-7d20-4704-890a-60eb92aa6159.gltf")
    .then((gltf) => {
      rootEntity.addChild(gltf.defaultSceneRoot);
      const material = gltf.materials[0];
      const video = document.getElementById("video") as HTMLVideoElement;
      const texture = new Texture2D(engine, 960, 540, undefined, false);

      function setImage() {
        texture.setImageSource(video);
        requestAnimationFrame(setImage);
      }
      setImage();

      (<PBRMaterial>material).baseTexture = texture;
    }),
  engine.resourceManager
    .load<TextureCubeMap>({
      urls: [
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*Bk5FQKGOir4AAAAAAAAAAAAAARQnAQ",
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_cPhR7JMDjkAAAAAAAAAAAAAARQnAQ",
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*trqjQp1nOMQAAAAAAAAAAAAAARQnAQ",
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_RXwRqwMK3EAAAAAAAAAAAAAARQnAQ",
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*q4Q6TroyuXcAAAAAAAAAAAAAARQnAQ",
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*DP5QTbTSAYgAAAAAAAAAAAAAARQnAQ"
      ],
      type: AssetType.TextureCube
    })
    .then((cubeMap) => {
      ambientLight.diffuseMode = DiffuseMode.Texture;
      ambientLight.diffuseTexture = cubeMap;
    }),
  engine.resourceManager
    .load<TextureCubeMap>({
      urls: [
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*5w6_Rr6ML6IAAAAAAAAAAAAAARQnAQ",
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*TiT2TbN5cG4AAAAAAAAAAAAAARQnAQ",
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*8GF6Q4LZefUAAAAAAAAAAAAAARQnAQ",
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*D5pdRqUHC3IAAAAAAAAAAAAAARQnAQ",
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_FooTIp6pNIAAAAAAAAAAAAAARQnAQ",
        "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*CYGZR7ogZfoAAAAAAAAAAAAAARQnAQ"
      ],
      type: AssetType.TextureCube
    })
    .then((cubeMap) => {
      ambientLight.specularTexture = cubeMap;
      rootEntity.addComponent(SkyBox).skyBoxMap = cubeMap;
    })
]).then(() => {
  engine.run();
});
