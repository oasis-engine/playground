import { OrbitControl } from "@oasis-engine/controls";
import {
  BufferBindFlag,
  BufferMesh,
  Camera,
  Material,
  MeshRenderer,
  PBRBaseMaterial,
  PBRMaterial,
  PrimitiveMesh,
  RenderColorTexture,
  RenderTarget,
  Script,
  Shader,
  Texture2D,
  TextureFormat,
  UnlitMaterial,
  Vector3,
  WebGLEngine,
  Buffer,
  VertexBufferBinding,
  VertexElement,
  VertexElementFormat,
  Vector2,
  MeshTopology,
  Logger
} from "oasis-engine";
Logger.enable();

// Create engine object
const engine = new WebGLEngine("o3-demo");
engine.canvas.resizeByClientSize();

const scene = engine.sceneManager.activeScene;
const rootEntity = scene.createRootEntity();

// Create camera
const cameraEntity = rootEntity.createChild("Camera");
cameraEntity.transform.setPosition(0, 0, 50);
const camera = cameraEntity.addComponent(Camera);
cameraEntity.addComponent(OrbitControl);

const width = 512;
const height = 512;

// Create Texture
const texture = new Texture2D(engine, 512, 512, TextureFormat.R32G32B32A32);
const buffer = new Float32Array(512 * 512 * 4);

for (let i = 0; i < 512; i++) {
  for (let j = 0; j < 512; j++) {
    const k = (i * 512 + j) * 4;
    buffer[k] = (Math.random() - 0.5) * 800.6125;
    buffer[k + 1] = (Math.random() - 0.5) * 800.6125;
    buffer[k + 2] = (Math.random() - 0.5) * 800.6125;
    buffer[k + 3] = 1;
  }
}

texture.setPixelBuffer(buffer);

// Create Plane
Shader.create(
  "logic",
  `attribute vec3 POSITION;
  attribute vec2 TEXCOORD_0;
  varying vec2 v_uv;
  void main(){
      gl_Position = vec4( POSITION , 1.0);
      v_uv = TEXCOORD_0;
  }`,
  `
  uniform sampler2D uState;
  varying vec2 v_uv;
  uniform float uTime;
  const vec3 OFFSET = vec3(2399.24849823098, 3299.9028381, 389.09338327);
  const float SPEED = 2.0;

  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }
  
  vec4 permute(vec4 x) {
       return mod289(((x*34.0)+1.0)*x);
  }
  
  vec4 taylorInvSqrt(vec4 r)
  {
    return 1.79284291400159 - 0.85373472095314 * r;
  }
  
  float snoise(vec3 v)
    {
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
  
  // First corner
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 =   v - i + dot(i, C.xxx) ;
  
  // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
  
    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
    //   x1 = x0 - i1  + 1.0 * C.xxx;
    //   x2 = x0 - i2  + 2.0 * C.xxx;
    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
  
  // Permutations
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  
  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
    float n_ = 0.142857142857; // 1.0/7.0
    vec3  ns = n_ * D.wyz - D.xzx;
  
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
  
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
  
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
  
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
  
    //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
    //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
  
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
  
  //Normalise gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
  
  // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                  dot(p2,x2), dot(p3,x3) ) );
    }

  void main() {
    vec3 sampled = texture2D(uState, gl_FragCoord.xy / vec2(512.0)).rgb;
    vec2 nextPosition = sampled.xy;

    float t = uTime * 0.013849829389;

    nextPosition += vec2(
      snoise(vec3(nextPosition * 0.005, 9280.03992092039 + t + gl_FragCoord.x / 110.0) + OFFSET),
      snoise(vec3(nextPosition * 0.005, 3870.73392092039 - t - gl_FragCoord.y / 110.0) + OFFSET)
    ) * SPEED;

    float radius = length(nextPosition);
    float rad = 0.00002 * radius;
    nextPosition = vec2(
        nextPosition.x * cos(rad) - nextPosition.y * sin(rad)
      , nextPosition.y * cos(rad) + nextPosition.x * sin(rad)
    );

    nextPosition *= 0.9999;

    gl_FragColor = vec4(vec3(nextPosition, 1.0), 1.0);
    // gl_FragColor = texture2D(uState, v_uv);
  }
`
);
const planeMaterial = new Material(engine, Shader.find("logic"));
const planeEntity = rootEntity.createChild();
const planeRenderer = planeEntity.addComponent(MeshRenderer);
const planeShaderData = planeMaterial.shaderData;
planeShaderData.setTexture("uState", texture);
planeRenderer.mesh = PrimitiveMesh.createPlane(engine, 2, 2);
planeRenderer.setMaterial(planeMaterial);

// Create Particles
Shader.create(
  "render",
  `
attribute vec2 aIndex;

uniform vec2 uScreen;
uniform sampler2D uState;

varying vec2 vIndex;

void main() {
  vIndex = aIndex;
  gl_PointSize = 1.0;
  gl_Position = vec4(texture2D(uState, aIndex).xy / uScreen, 1.0, 1.0);
  // gl_Position = vec4(texture2D(uState, aIndex).xy / vec2(0.1, 0.1), 1.0, 1.0);
  // gl_Position = vec4(aIndex,0,1);
}
`,
  `
uniform sampler2D uTexture;
varying vec2 vIndex;

uniform sampler2D uState;
uniform vec2 uScreen;

void main() {
  // gl_FragColor = vec4(
  //   1.0
  //   , 0
  //   , 0
  //   , 1.0
  // );
  // gl_FragColor = vec4(texture2D(uState, vIndex).xy / uScreen, 1.0, 1.0);

  gl_FragColor = vec4(
      sin(vIndex.x * 10.0)
    , 0.5
    , 1.0 - vIndex.y
    , 1.0
  ) * 0.165;
}
`
);
const vertexCount = 512 * 512;
const particleEntity = rootEntity.createChild("particle");
const renderer = particleEntity.addComponent(MeshRenderer);
const mesh = new BufferMesh(engine);
const positions = new Float32Array(vertexCount * 2);

let i = 0;
for (let x = 0; x < 512; x++) {
  for (let y = 0; y < 512; y++) {
    positions[i++] = x / 512;
    positions[i++] = y / 512;
  }
}

const positionBuffer = new Buffer(engine, BufferBindFlag.VertexBuffer, positions);
mesh.setVertexBufferBindings([new VertexBufferBinding(positionBuffer, 8)]);
mesh.setVertexElements([new VertexElement("aIndex", 0, VertexElementFormat.Vector2, 0)]);
const submesh = mesh.addSubMesh(0, vertexCount);
submesh.topology = MeshTopology.Points;
renderer.mesh = mesh;

const particleMaterial = new Material(engine, Shader.find("render"));
const particleShaderData = particleMaterial.shaderData;
renderer.setMaterial(particleMaterial);

// render Target
let nextState = new RenderTarget(engine, width, height, new RenderColorTexture(engine, width, height));

let preState = new RenderTarget(engine, width, height, new RenderColorTexture(engine, width, height));

camera.enableFrustumCulling = false;

particleEntity.isActive = false;
camera.renderTarget = nextState;
camera.render();
camera.renderTarget = preState;
camera.render();
particleShaderData.setVector2("uScreen", new Vector2(512, 512));

class ParticleExcess extends Script {
  private t: number = 0;
  onAwake() {}

  onBeginRender(camera) {
    particleEntity.isActive = false;
    planeEntity.isActive = true;

    camera.renderTarget = nextState;

    planeShaderData.setTexture("uState", preState.getColorTexture());
    planeShaderData.setFloat("uTime", this.t++);
    camera.render();

    particleEntity.isActive = true;
    planeEntity.isActive = false;
    camera.renderTarget = null;
    particleShaderData.setTexture("uState", nextState.getColorTexture());

    // Switch
    var tmp = preState;
    preState = nextState;
    nextState = tmp;
    // particleEntity.isActive = true;
    // particleShaderData.setTexture('uState', texture);
  }
  onUpdate() {}
}

cameraEntity.addComponent(ParticleExcess);
engine.run();
