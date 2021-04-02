import {
  AssetType,
  Color,
  Engine,
  Entity,
  Material,
  MeshRenderer,
  PrimitiveMesh,
  Shader,
  Texture2D
} from "oasis-engine";

export function createCube(engine: Engine, rootEntity: Entity) {
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
      mtl.shaderData.setTexture("u_baseColor", tex);
      meshRenderer.setMaterial(mtl);
    });
}
