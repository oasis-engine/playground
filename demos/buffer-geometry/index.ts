import {
  AmbientLight,
  BlinnPhongMaterial,
  Buffer,
  BufferBindFlag,
  BufferGeometry,
  BufferUsage,
  Camera,
  Color,
  DirectLight,
  Engine,
  GeometryRenderer,
  IndexFormat,
  SystemInfo,
  Vector3,
  Vector4,
  VertexElement,
  VertexElementFormat,
  WebGLEngine
} from "oasis-engine";

/**
 * to create custom cube geometry.
 */
class CustomCubeGeometry {
  /**
   * create cube geometry with custom BufferGeometry.
   * @param size - cube size
   */
  static create(engine: Engine, size: number): BufferGeometry {
    const geometry = new BufferGeometry(engine, "CustomCubeGeometry");

    // prettier-ignore
    // create vertices data.
    const vertices: Float32Array = new Float32Array([
    	// up
    	-size, size, -size, 0, 1, 0, size, size, -size, 0, 1, 0, size, size, size, 0, 1, 0, -size, size, size, 0, 1, 0,
    	// down
    	-size, -size, -size, 0, -1, 0, size, -size, -size, 0, -1, 0, size, -size, size, 0, -1, 0, -size, -size, size, 0, -1, 0,
    	// left
    	-size, size, -size, -1, 0, 0, -size, size, size, -1, 0, 0, -size, -size, size, -1, 0, 0, -size, -size, -size, -1, 0, 0,
    	// right
    	size, size, -size, 1, 0, 0, size, size, size, 1, 0, 0, size, -size, size, 1, 0, 0, size, -size, -size, 1, 0, 0,
    	// front
    	-size, size, size, 0, 0, 1, size, size, size, 0, 0, 1, size, -size, size, 0, 0, 1, -size, -size, size, 0, 0, 1,
    	// back
    	-size, size, -size, 0, 0, -1, size, size, -size, 0, 0, -1, size, -size, -size, 0, 0, -1, -size, -size, -size, 0, 0, -1]);

    // prettier-ignore
    // create indices data.
    const indices: Uint16Array = new Uint16Array([
    	// up
    	0, 2, 1, 2, 0, 3,
    	// down
    	4, 6, 7, 6, 4, 5,
    	// left
    	8, 10, 9, 10, 8, 11,
    	// right
    	12, 14, 15, 14, 12, 13,
    	// front
    	16, 18, 17, 18, 16, 19,
    	// back
    	20, 22, 23, 22, 20, 21]);

    // create gpu vertex buffer and index buffer.
    const vertexBuffer = new Buffer(engine, BufferBindFlag.VertexBuffer, vertices, BufferUsage.Static);
    const indexBuffer = new Buffer(engine, BufferBindFlag.IndexBuffer, indices, BufferUsage.Static);

    // bind buffer
    geometry.setVertexBufferBinding(vertexBuffer, 24);
    geometry.setIndexBufferBinding(indexBuffer, IndexFormat.UInt16);

    // add vertexElement
    geometry.setVertexElements([
      new VertexElement("POSITION", 0, VertexElementFormat.Vector3, 0),
      new VertexElement("NORMAL", 12, VertexElementFormat.Vector3, 0)
    ]);

    // add one sub geometry.
    geometry.addSubGeometry(0, indices.length);
    return geometry;
  }
}

// create engine and get root entity.
const engine = new WebGLEngine("o3-demo");
const canvas = engine.canvas;
const rootEntity = engine.sceneManager.activeScene.createRootEntity("Root");
canvas.width = window.innerWidth * SystemInfo.devicePixelRatio;
canvas.height = window.innerHeight * SystemInfo.devicePixelRatio;

// create light.
const lightEntity = rootEntity.createChild("DirectLight");
const ambient = lightEntity.addComponent(AmbientLight);
const directLight = lightEntity.addComponent(DirectLight);
ambient.color = new Color(0.2, 0.2, 0.2);
directLight.color = new Color(0.3, 0.4, 0.4);

// create camera.
const cameraEntity = rootEntity.createChild("Camera");
cameraEntity.transform.setPosition(0, 6, 10);
cameraEntity.transform.lookAt(new Vector3(0, 0, 0));
cameraEntity.addComponent(Camera);

// create custom cube.
// use CustomCubeGeometry.create() to create cube geometry.
const cubeEntity = rootEntity.createChild("Cube");
const cubeRenderer = cubeEntity.addComponent(GeometryRenderer);
const cubeGeometry = CustomCubeGeometry.create(engine, 1.0);
const material = new BlinnPhongMaterial(engine);
cubeEntity.transform.rotateXYZ(0, 60, 0);
material.ambientColor = new Color(1, 1, 1, 1);
cubeRenderer.geometry = cubeGeometry;
cubeRenderer.material = material;

// run engine.
engine.run();
