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

const cubeMesh = PrimitiveMesh.createCuboid(engine, undefined, undefined, undefined, false);
const cubeEntity = rootEntity.createChild("cube");

const colors = new Array(24);
for (let i = 0; i < 24; i++) {
  colors[i] = new Color((i % 3) / 3, ((i + 1) % 3) / 3, ((i + 2) % 3) / 3, 1);
}
cubeMesh.setColors(colors);
cubeMesh.uploadData(false);

const meshRenderer = cubeEntity.addComponent(MeshRenderer);
meshRenderer.mesh = cubeMesh;

const shader = Shader.create(
  "test-modelMesh",
  `uniform mat4 u_MVPMat;
attribute vec3 POSITION;
attribute vec2 TEXCOORD_0;
attribute vec4 COLOR_0;

varying vec2 v_uv;
varying vec4 v_color;

void main() {
  v_uv = TEXCOORD_0;
  v_color = COLOR_0;
  gl_Position = u_MVPMat * vec4(POSITION, 1.0);
}`,

  `
uniform sampler2D u_baseColor;

varying vec2 v_uv;
varying vec4 v_color;

void main() {
  vec4 color = texture2D(u_baseColor, v_uv);
  gl_FragColor = color * v_color;
}
`
);

engine.resourceManager
  .load<Texture2D>({
    url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*5w6_Rr6ML6IAAAAAAAAAAAAAARQnAQ",
    type: AssetType.Texture2D
  })
  .then((tex) => {
    const mtl = new Material(engine, shader);
    meshRenderer.setMaterial(mtl);
    mtl.shaderData.setTexture("u_baseColor", tex);
    engine.run();
  });

Logger.enable();
