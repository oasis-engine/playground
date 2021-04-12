import * as o3 from "oasis-engine";
import { OrbitControl } from "@oasis-engine/controls";
import { MeshTopology } from "oasis-engine";

const engine = new o3.WebGLEngine("o3-demo");
engine.canvas.resizeByClientSize();
const rootEntity = engine.sceneManager.activeScene.createRootEntity();

// init camera
const cameraEntity = rootEntity.createChild("camera");
cameraEntity.addComponent(o3.Camera);
cameraEntity.addComponent(OrbitControl);
const pos = cameraEntity.transform.position;
pos.setValue(0.5, 0.5, 0.5);
cameraEntity.transform.position = pos;
cameraEntity.transform.lookAt(new o3.Vector3(0, 0, 0));

// init light
const light = rootEntity.addComponent(o3.AmbientLight);
light.intensity = 1.2;

fetch("https://gw.alipayobjects.com/os/bmw-prod/b885a803-5315-44f0-af54-6787ec47ed1b.obj")
  .then((res) => res.text())
  .then((objText) => {
    const lines = objText.split(/\n/);
    const positions = [];
    const indices: number[] = [];
    lines
      .map((lineText) => lineText.split(" "))
      .forEach((parseTexts) => {
        if (parseTexts[0] === "v") {
          positions.push(
            new o3.Vector3(parseFloat(parseTexts[1]), parseFloat(parseTexts[2]), parseFloat(parseTexts[3]))
          );
        } else if (parseTexts[0] === "f") {
          indices.push(parseInt(parseTexts[1]) - 1, parseInt(parseTexts[2]) - 1, parseInt(parseTexts[3]) - 1);
        }
      });

    const mesh = new o3.ModelMesh(engine);
    mesh.setPositions(positions);
    mesh.setIndices(Uint16Array.from(indices));
    mesh.addSubMesh(0, indices.length, MeshTopology.Triangles);
    mesh.uploadData(false);

    // init cube
    const cubeEntity = rootEntity.createChild("cube");
    const renderer = cubeEntity.addComponent(o3.MeshRenderer);
    renderer.mesh = mesh;
    const material = new o3.BlinnPhongMaterial(engine);
    material.baseColor = new o3.Color(1, 0.25, 0.25, 1);
    renderer.setMaterial(material);
  });

engine.run();
