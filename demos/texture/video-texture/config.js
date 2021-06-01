import transform from "../../transform";

export default async () => {
  const [htmlCode, jsCode, cssCode] = await Promise.all([
    import("!raw-loader!./index.html"),
    import("!raw-loader!./index.ts"),
    import("!raw-loader!../../../template.css")
  ]);

  return {
    javascript: {
      code: jsCode, // JavaScript 代码
      transformer: "typescript", // Typescript transformer
      transform,
      visible: true // 是否显示编辑器
    },
    html: {
      code: htmlCode, // HTML 代码
      transformer: "html",
      visible: true
    },
    css: {
      code: cssCode, // CSS 代码
      transformer: "css",
      visible: true
    }
  };
};
