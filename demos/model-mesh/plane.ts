import {
  AssetType,
  Color,
  Engine,
  Entity,
  Material,
  MeshRenderer,
  ModelMesh,
  PrimitiveMesh,
  Script,
  Shader,
  Texture2D,
  TextureWrapMode
} from "oasis-engine";

const shader = Shader.create(
  "test-plane",
  `uniform mat4 u_MVPMat;
attribute vec4 POSITION;
attribute vec2 TEXCOORD_0;

uniform mat4 u_MVMat;

varying vec2 v_uv;
varying vec3 v_position;

void main() {
  v_uv = TEXCOORD_0;
  v_position = (u_MVMat * POSITION).xyz;
  gl_Position = u_MVPMat * POSITION;
}`,

  `
uniform sampler2D u_baseColor;
uniform vec4 u_color;
uniform vec4 u_fogColor;
uniform float u_fogDensity;

varying vec2 v_uv;
varying vec3 v_position;

void main() {
  vec4 color = texture2D(u_baseColor, v_uv) * u_color;
  float fogDistance = length(v_position);
  float fogAmount = 1. - exp2(-u_fogDensity * u_fogDensity * fogDistance * fogDistance * 1.442695);
  fogAmount = clamp(fogAmount, 0., 1.);
  gl_FragColor = mix(color, u_fogColor, fogAmount); 
}
`
);

class PlaneAnimation extends Script {
  private planeMesh: ModelMesh;
  private initZ = null;

  onAwake() {
    const renderer = this.entity.getComponent(MeshRenderer);
    const mesh = (this.planeMesh = renderer.mesh as ModelMesh);
    const { vertexCount } = mesh;
    const initZ = new Array(vertexCount);

    const positions = mesh.getPositions();
    for (var i = 0; i < vertexCount; i++) {
      positions[i].z += Math.random() * 100 - 100;
      initZ[i] = positions[i].z;
    }
    this.initZ = initZ;
  }

  private count = 0;

  onUpdate(dt: number) {
    const mesh = this.planeMesh;
    let { count, initZ } = this;
    const positions = mesh.getPositions();
    for (var i = 0, len = positions.length; i < len; i++) {
      const position = positions[i];
      position.z = Math.sin(i + count * 0.00002) * (initZ[i] - initZ[i] * 0.6);
      count += 0.1;
    }
    mesh.setPositions(positions);
    mesh.uploadData(false);
    this.count = count;
  }
}

export function createPlane(engine: Engine, entity: Entity) {
  const planeEntity = entity.createChild("plane");
  planeEntity.transform.setRotation(-90, 0, 0);
  const meshRenderer = planeEntity.addComponent(MeshRenderer);
  const plane = PrimitiveMesh.createPlane(engine, 12450, 12450, 100, 100, false);
  meshRenderer.mesh = plane;
  planeEntity.addComponent(PlaneAnimation);

  engine.resourceManager
    .load<Texture2D>({
      url: "https://gw.alipayobjects.com/mdn/rms_2e421e/afts/img/A*fRtNTKrsq3YAAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    })
    .then((texture) => {
      const mtl = new Material(engine, shader);
      const { shaderData } = mtl;
      shaderData.setTexture("u_baseColor", texture);
      shaderData.setColor("u_fogColor", new Color(0.25, 0.25, 0.25, 1));
      shaderData.setFloat("u_fogDensity", 0.0004);
      shaderData.setColor("u_color", new Color(86 / 255, 182 / 255, 194 / 255, 1));
      texture.wrapModeU = TextureWrapMode.Repeat;
      texture.wrapModeV = TextureWrapMode.Repeat;
      texture.anisoLevel = 8;
      meshRenderer.setMaterial(mtl);
    });
}
