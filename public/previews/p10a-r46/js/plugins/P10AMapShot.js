(() => {
  "use strict";

  const params = new URLSearchParams(window.location.search);
  if (params.get("mapshot") !== "1") return;

  const world = window.P10A_WORLD;
  const mapId = Number(params.get("map") || 0);
  const raw = params.get("raw") === "1";
  const route = world?.routes?.find(item => item.mapId === mapId);
  if (!route) {
    console.error(`P10-A mapshot route not found: ${mapId}`);
    return;
  }

  const tileSize = 48;
  const mapWidth = route.width * tileSize;
  const mapHeight = route.height * tileSize;
  const titleHeight = 64;

  function createChrome() {
    if (document.getElementById("p10a-mapshot-label")) return;
    document.body.classList.add("p10a-mapshot-mode");
    document.body.dataset.mapshotReady = "0";

    const style = document.createElement("style");
    style.textContent = `
      html, body.p10a-mapshot-mode {
        width: ${mapWidth}px !important;
        min-width: ${mapWidth}px !important;
        height: ${raw ? mapHeight : mapHeight + titleHeight}px !important;
        min-height: ${raw ? mapHeight : mapHeight + titleHeight}px !important;
        margin: 0 !important;
        overflow: hidden !important;
        background: #0b0b09 !important;
      }
      body.p10a-mapshot-mode canvas {
        position: absolute !important;
        left: 0 !important;
        top: ${raw ? 0 : titleHeight}px !important;
        width: ${mapWidth}px !important;
        height: ${mapHeight}px !important;
        margin: 0 !important;
        transform: none !important;
        image-rendering: pixelated !important;
        box-shadow: none !important;
      }
      body.p10a-mapshot-mode #p10a-world-ui,
      body.p10a-mapshot-mode #p10a-route-hint,
      body.p10a-mapshot-mode #p10a-guide,
      body.p10a-mapshot-mode #p10a-toast,
      body.p10a-mapshot-mode #fpsCounterBox,
      body.p10a-mapshot-mode #loadingSpinner {
        display: none !important;
      }
      #p10a-mapshot-label {
        position: absolute;
        z-index: 5000;
        left: 0;
        top: 0;
        width: ${mapWidth}px;
        height: ${titleHeight}px;
        box-sizing: border-box;
        display: ${raw ? "none" : "flex"};
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        padding: 0 18px;
        border-bottom: 4px solid #b68a45;
        background: #201b14;
        color: #f2e3bd;
        font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
      }
      #p10a-mapshot-label strong { font-size: 24px; letter-spacing: .04em; }
      #p10a-mapshot-label span { color: #c8b78e; font-size: 15px; white-space: nowrap; }
    `;
    document.head.appendChild(style);

    const label = document.createElement("div");
    label.id = "p10a-mapshot-label";
    label.dataset.ready = "0";
    const kind = route.primary ? "主场景" : "子场景";
    label.innerHTML = `<strong>${route.label}</strong><span>${route.pack} · ${kind} · Map${route.mapId} · ${route.width}×${route.height} 格</span>`;
    document.body.appendChild(label);
    document.title = `${route.label} · P10-A 地图标注底图`;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createChrome, { once: true });
  } else {
    createChrome();
  }

  Graphics._updateRealScale = function() {
    this._realScale = 1;
  };

  Scene_Boot.prototype.startNormalGame = function() {
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    $gamePlayer.reserveTransfer(route.mapId, route.x, route.y, 2, 0);
    SceneManager.goto(Scene_Map);
  };

  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
    Graphics.resize(mapWidth, mapHeight);
    Graphics.boxWidth = mapWidth;
    Graphics.boxHeight = mapHeight;
    $gamePlayer.setTransparent(true);
    _Scene_Map_onMapLoaded.call(this);
    $gamePlayer.setTransparent(true);
    $gameMap.setDisplayPos(0, 0);
  };

  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    $gameSystem.disableMenu();
    this.hideMenuButton();
    $gamePlayer.setTransparent(true);
    $gameMap.setDisplayPos(0, 0);
    PluginManager.callCommand(this, "ScreenOverlayMZ", "hide", {});
    const markReady = () => {
      const label = document.getElementById("p10a-mapshot-label");
      if (label) label.dataset.ready = "1";
      document.body.dataset.mapshotReady = "1";
    };
    setTimeout(markReady, 1000);
  };

  Scene_Map.prototype.updateMenuButton = function() {
    if (this._menuButton) this._menuButton.visible = false;
  };
})();
