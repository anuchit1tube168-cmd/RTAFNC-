(() => {
  "use strict";

  const currentScript = document.currentScript;
  if (!currentScript?.src) {
    throw new Error("AGIS pixel asset loader must be loaded from a script URL.");
  }

  const baseUrl = new URL(".", currentScript.src);

  const assets = {
    characters: {
      title: "Pixel Character Sprite Sheet",
      category: "characters",
      mime: "image/avif",
      width: 800,
      height: 600,
      sourceWidth: 1448,
      sourceHeight: 1086,
      sha256: "e1033727802b94a6380d7f43e2f36a228b78c2f7f85e5df8ac3bd655915f84b6",
      parts: [
        "data/characters-preview.part-00.b64",
        "data/characters-preview.part-01.b64"
      ]
    },
    equipment: {
      title: "Equipment & Props Sheet",
      category: "equipment-props",
      mime: "image/avif",
      width: 800,
      height: 600,
      sourceWidth: 1448,
      sourceHeight: 1086,
      sha256: "d96412376d8f39e06ede3d8855636f2b8ae24a9c0f7c34df7683aae19cd78e81",
      parts: [
        "data/equipment-props-preview.part-00.b64",
        "data/equipment-props-preview.part-01.b64",
        "data/equipment-props-preview.part-02.b64"
      ]
    },
    tileset: {
      title: "Tileset & Environment Sheet",
      category: "tileset-environment",
      mime: "image/avif",
      width: 800,
      height: 600,
      sourceWidth: 1448,
      sourceHeight: 1086,
      sha256: "664072d522642c6f7aee0391eb695ec599be16d6bdece1156bd3c15e6eae6281",
      parts: [
        "data/tileset-environment-preview.part-00.b64",
        "data/tileset-environment-preview.part-01.b64"
      ]
    },
    worldMap: {
      title: "AGIS World Map Sheet",
      category: "world-map",
      mime: "image/avif",
      width: 800,
      height: 600,
      sourceWidth: 1448,
      sourceHeight: 1086,
      sha256: "d3a42b8e3f571552ba9461151847bf7788713835d7c17cd5f879bc08a2bc10a5",
      parts: [
        "data/world-map-preview.part-00.b64",
        "data/world-map-preview.part-01a.b64",
        "data/world-map-preview.part-01b.b64",
        "data/world-map-preview.part-01c.b64"
      ]
    }
  };

  const cache = new Map();

  async function loadText(path) {
    const response = await fetch(new URL(path, baseUrl), { cache: "force-cache" });
    if (!response.ok) {
      throw new Error(`Failed to load ${path}: HTTP ${response.status}`);
    }
    return response.text();
  }

  async function loadAgisPixelAsset(key) {
    if (cache.has(key)) return cache.get(key);

    const asset = assets[key];
    if (!asset) throw new Error(`Unknown AGIS pixel asset: ${key}`);

    const promise = Promise.all(asset.parts.map(loadText)).then((chunks) => {
      const base64 = chunks.join("").replace(/\s+/g, "");
      return `data:${asset.mime};base64,${base64}`;
    });

    cache.set(key, promise);
    return promise;
  }

  async function downloadAgisPixelAsset(key, filename) {
    const src = await loadAgisPixelAsset(key);
    const link = document.createElement("a");
    link.href = src;
    link.download = filename || `${assets[key].category}.avif`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  window.AGIS_PIXEL_ASSETS = Object.freeze(assets);
  window.loadAgisPixelAsset = loadAgisPixelAsset;
  window.downloadAgisPixelAsset = downloadAgisPixelAsset;
})();
