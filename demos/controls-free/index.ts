/**
 * 本示例展示如何使用几何体渲染器功能、如何创建几何体资源对象、如何创建材质对象
 */
import { FreeControl } from "@oasis-engine/controls";
import {
  Camera,
  BlinnPhongMaterial,
  MeshRenderer,
  MeshTopology,
  WebGLEngine,
  Color,
  PrimitiveMesh,
  AssetType,
  Texture2D,
  AmbientLight,
  DirectLight
} from "oasis-engine";

const engine = new WebGLEngine("o3-demo");
engine.canvas.resizeByClientSize();
const scene = engine.sceneManager.activeScene;
const rootNode = scene.createRootEntity("root");

engine.resourceManager
  .load([
    {
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*_4RHQYi4PfcAAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    },
    {
      url: "https://gw.alipayobjects.com/mdn/rms_7c464e/afts/img/A*FO6lRbeTVi4AAAAAAAAAAAAAARQnAQ",
      type: AssetType.Texture2D
    }
  ])
  .then((texture) => {
    // 在场景中创建相机节点、配置位置和目标方向
    const cameraNode = rootNode.createChild("camera_node");
    cameraNode.transform.setPosition(0, 0, 50);

    const camera = cameraNode.addComponent(Camera);
    camera.farClipPlane = 2000;

    const controler = cameraNode.addComponent(FreeControl);
    controler.movementSpeed = 100;
    controler.rotateSpeed = 1;

    const lightEntity = rootNode.createChild("LightEntity");
    // const ambient = lightEntity.addComponent(AmbientLight);
    const directLight = lightEntity.addComponent(DirectLight);
    // ambient.color = new Color(0.5, 0.5, 0.5);
    directLight.color = new Color(0.5, 0.5, 0.5);

    const cuboid = PrimitiveMesh.createCuboid(engine, 10, 10, 10);

    const material = new BlinnPhongMaterial(engine);
    material.baseTexture = <Texture2D>texture[0];

    const material1 = new BlinnPhongMaterial(engine);
    material1.baseTexture = <Texture2D>texture[1];

    // const groundGeometry = PrimitiveMesh.createPlane(engine, 2000, 2000, 100, 100);
    // groundGeometry.subMesh.topology = MeshTopology.LineStrip;
    // const groundMaterial = new BlinnPhongMaterial(engine);
    // groundMaterial.emissiveColor = new Color(1, 1, 1, 1);

    // create meshes in scene
    let cube = rootNode.createChild("cube");
    const cubeRenderer = cube.addComponent(MeshRenderer);
    cubeRenderer.mesh = cuboid;
    cubeRenderer.setMaterial(material);

    let cube1 = rootNode.createChild("cube1");
    cube1.transform.setPosition(-15, 0, 0);
    const cubeRenderer1 = cube1.addComponent(MeshRenderer);
    cubeRenderer1.mesh = cuboid;
    cubeRenderer1.setMaterial(material1);

    // // Ground
    // const ground = rootNode.createChild("ground");
    // ground.transform.setPosition(0, -25, 0);
    // ground.transform.rotate(-90, 0, 0);
    // const groundRender = ground.addComponent(MeshRenderer);
    // groundRender.mesh = groundGeometry;
    // groundRender.setMaterial(groundMaterial);

    // Run engine
    engine.run();
  });
