/*:
 * @target MZ
 * @plugindesc P10-A-R4.6 已确认传送点与书院门修订
 * @author Codex
 * @help
 * 仅用于本地私有的 B.B.Bits 原生地图体验工程。
 */

(() => {
  "use strict";

  const WORLD = window.P10A_WORLD;
  if (!WORLD) throw new Error("P10AWorldData must load before P10AWorldTour");

  const QA_MODE = new URLSearchParams(window.location.search).get("qa") === "1";
  const UI = { root: null, title: null, modal: null, grid: null, toast: null, routeHint: null, routeButton: null, guideLabel: null, guideMapId: 0, toastTimer: 0 };

  function routeForMap(mapId) {
    return WORLD.routes.find(route => route.mapId === Number(mapId)) || null;
  }

  function currentRoute() {
    return window.$gameMap ? routeForMap($gameMap.mapId()) : null;
  }

  function currentPrimaryRoute() {
    const route = currentRoute();
    if (!route) return null;
    return WORLD.primaryRoutes.find(item => item.pack === route.pack) || route;
  }

  function stopEvent(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function showToast(text, duration = 2200) {
    if (!UI.toast) return;
    UI.toast.textContent = text;
    UI.toast.classList.add("is-visible");
    clearTimeout(UI.toastTimer);
    UI.toastTimer = setTimeout(() => UI.toast?.classList.remove("is-visible"), duration);
  }

  function discoveredPacks() {
    if (!window.$gameSystem) return [];
    if (!Array.isArray($gameSystem._p10aDiscoveredPacks)) $gameSystem._p10aDiscoveredPacks = [];
    return $gameSystem._p10aDiscoveredPacks;
  }

  function discoverCurrent() {
    const route = currentRoute();
    if (!route) return;
    const discovered = discoveredPacks();
    if (!discovered.includes(route.pack)) discovered.push(route.pack);
  }

  function canTravel() {
    if (!window.$gamePlayer || !window.$gameMap) return false;
    if (window.$gameMessage?.isBusy()) {
      showToast("请先结束当前对话");
      return false;
    }
    return true;
  }

  function travel(route) {
    if (!route || !canTravel()) return;
    closeGuide();
    $gamePlayer.reserveTransfer(route.mapId, route.x, route.y, 2, 0);
  }

  function makeButton(label, className, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    button.addEventListener("pointerdown", event => event.stopPropagation());
    button.addEventListener("click", event => {
      stopEvent(event);
      onClick();
    });
    return button;
  }

  function updateStageChrome() {
    if (!window.Graphics?._canvas || !UI.root) return;
    const rect = Graphics._canvas.getBoundingClientRect();
    const top = Math.max(6, rect.top - 46);
    UI.root.style.left = `${Math.round(rect.left)}px`;
    UI.root.style.top = `${Math.round(top)}px`;
    UI.root.style.width = `${Math.round(rect.width)}px`;
    if (UI.routeHint) {
      UI.routeHint.style.left = `${Math.round(rect.left + rect.width / 2)}px`;
      UI.routeHint.style.top = `${Math.round(rect.bottom - 48)}px`;
    }
  }

  function updateRouteHint() {
    if (!UI.routeHint || !window.$gameMap || !window.$gamePlayer) return;
    const exits = $gameMap.events()
      .map(event => ({ event, meta: exitMeta(event.event()) }))
      .filter(item => item.meta)
      .map(item => ({ ...item, distance: Math.abs($gamePlayer.x - item.event.x) + Math.abs($gamePlayer.y - item.event.y) }))
      .sort((a, b) => a.distance - b.distance || a.event.eventId() - b.event.eventId());
    const selected = exits.find(item => item.meta.label === UI.guideLabel);
    UI.routeHint.style.display = selected && selected.distance > 5 ? "block" : "none";
    if (selected && selected.distance > 5) {
      UI.routeHint.textContent = guideText(selected);
    } else {
      UI.routeHint.textContent = "";
    }
  }

  function guideText(item) {
    return `${directionArrow(item.event.x - $gamePlayer.x, item.event.y - $gamePlayer.y)} ${landmarkText(item.meta.label)}`;
  }

  function landmarkText(label) {
    const text = String(label || "")
      .replace(/^此处/, "")
      .replace(/^推门/, "")
      .replace(/^通往/, "前往")
      .replace(/^进入/, "前往");
    if (text.includes("返回")) return `返回${text.split("返回").pop()}`;
    return `此处前往${text.replace(/^前往/, "")}`;
  }

  function directionArrow(dx, dy) {
    if (dx === 0 && dy === 0) return "·";
    if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? "→" : "←";
    return dy > 0 ? "↓" : "↑";
  }

  function currentExitItems() {
    if (!window.$gameMap || !window.$gamePlayer) return [];
    const unique = new Map();
    for (const event of $gameMap.events()) {
      const meta = exitMeta(event.event());
      if (!meta) continue;
      const item = { event, meta, distance: Math.abs($gamePlayer.x - event.x) + Math.abs($gamePlayer.y - event.y) };
      const previous = unique.get(meta.label);
      if (!previous || item.distance < previous.distance) unique.set(meta.label, item);
    }
    return [...unique.values()].sort((a, b) => a.event.eventId() - b.event.eventId());
  }

  function cycleLocalRoute() {
    const exits = currentExitItems();
    if (!exits.length) {
      showToast("当前地点没有其他出口");
      return;
    }
    let index = exits.findIndex(item => item.meta.label === UI.guideLabel);
    if (index < 0) {
      index = exits.findIndex(item => item.distance > 5);
      if (index < 0) index = 0;
    } else {
      index = (index + 1) % exits.length;
    }
    UI.guideLabel = exits[index].meta.label;
    if (UI.routeButton) UI.routeButton.textContent = `去向 ${index + 1}/${exits.length}`;
      showToast(`已标记：${landmarkText(UI.guideLabel)}`);
    updateRouteHint();
  }

  function updateHeader() {
    if (!UI.root || !UI.title) return;
    const route = currentRoute();
    UI.root.style.display = SceneManager._scene instanceof Scene_Map ? "flex" : "none";
    UI.title.textContent = route ? route.label : WORLD.title;
    if (route && UI.guideMapId !== route.mapId) {
      UI.guideMapId = route.mapId;
      UI.guideLabel = null;
      if (UI.routeButton) UI.routeButton.textContent = "去向";
    }
    if (UI.routeButton) UI.routeButton.style.display = currentExitItems().length > 1 ? "inline-block" : "none";
    updateStageChrome();
  }

  function guideRoutes() {
    if (QA_MODE) return WORLD.routes;
    const discovered = new Set(discoveredPacks());
    return WORLD.primaryRoutes.filter(route => discovered.has(route.pack));
  }

  function buildGuideContents() {
    if (!UI.grid) return;
    UI.grid.replaceChildren();
    const routes = guideRoutes();
    if (!routes.length) {
      const empty = document.createElement("p");
      empty.className = "p10a-empty";
      empty.textContent = "沿道路探索后，已到达地点会记录在这里。";
      UI.grid.appendChild(empty);
      return;
    }
    for (const route of routes) {
      const button = makeButton(route.label, "p10a-place", () => travel(route));
      button.classList.toggle("is-current", route.mapId === currentPrimaryRoute()?.mapId);
      UI.grid.appendChild(button);
    }
  }

  function openGuide() {
    if (!UI.modal) return;
    buildGuideContents();
    UI.modal.classList.add("is-open");
  }

  function closeGuide() {
    UI.modal?.classList.remove("is-open");
  }

  function toggleGuide() {
    UI.modal?.classList.contains("is-open") ? closeGuide() : openGuide();
  }

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
      setTimeout(refreshScale, 60);
    } catch (_error) {
      showToast("当前浏览器未允许全屏，可使用浏览器全屏功能");
    }
  }

  function refreshScale() {
    if (!window.Graphics) return;
    Graphics._stretchEnabled = false;
    Graphics._updateAllElements?.();
    updateStageChrome();
  }

  const _Graphics_updateRealScale = Graphics._updateRealScale;
  Graphics._updateRealScale = function() {
    const padding = 24;
    const fit = Math.min(
      Math.max(1, window.innerWidth - padding) / this._width,
      Math.max(1, window.innerHeight - padding) / this._height,
    );
    this._realScale = Math.max(0.35, Math.min(1.6, fit));
  };

  function createUi() {
    if (document.getElementById("p10a-world-ui")) return;
    const style = document.createElement("style");
    style.textContent = `
      :root { --p10-ink: #f2e3bd; --p10-line: #b68a45; --p10-bg: rgba(24,20,15,.94); }
      #p10a-world-ui { position: fixed; z-index: 1000; display: none; align-items: center; justify-content: space-between; gap: 8px; pointer-events: none; box-sizing: border-box; font-family: "Microsoft YaHei", "PingFang SC", sans-serif; color: var(--p10-ink); }
      .p10a-location { min-width: 0; max-width: 55%; padding: 7px 12px; border: 2px solid var(--p10-line); border-radius: 4px; background: var(--p10-bg); box-shadow: 0 3px 0 rgba(0,0,0,.35); font-size: 15px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .p10a-actions { display: flex; gap: 6px; pointer-events: auto; }
      .p10a-action, .p10a-close, .p10a-place { appearance: none; border: 2px solid var(--p10-line); border-radius: 4px; background: #30271c; color: var(--p10-ink); font: inherit; cursor: pointer; }
      .p10a-action { min-width: 58px; min-height: 38px; padding: 5px 10px; font-size: 14px; font-weight: 700; }
      .p10a-action:hover, .p10a-action:focus-visible, .p10a-place:hover, .p10a-place:focus-visible { background: #554329; outline: 2px solid #f1d895; outline-offset: 1px; }
      #p10a-guide { position: fixed; inset: 0; z-index: 1100; display: none; align-items: center; justify-content: center; padding: max(18px, env(safe-area-inset-top)) max(18px, env(safe-area-inset-right)) max(18px, env(safe-area-inset-bottom)) max(18px, env(safe-area-inset-left)); background: rgba(3,5,4,.82); font-family: "Microsoft YaHei", "PingFang SC", sans-serif; color: var(--p10-ink); }
      #p10a-guide.is-open { display: flex; }
      .p10a-guide-panel { width: min(720px, 92vw); max-height: min(620px, 86vh); overflow: hidden; display: flex; flex-direction: column; border: 3px solid var(--p10-line); border-radius: 6px; background: #171611; box-shadow: 0 18px 50px rgba(0,0,0,.65); }
      .p10a-guide-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px 15px; border-bottom: 2px solid #6f5836; background: #2b251b; }
      .p10a-guide-head h1 { margin: 0; font-size: 21px; }
      .p10a-guide-head p { margin: 3px 0 0; color: #cbbd9b; font-size: 13px; }
      .p10a-close { width: 42px; height: 38px; font-size: 22px; }
      #p10a-guide-grid { min-height: 120px; overflow: auto; padding: 14px; display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: 8px; }
      .p10a-place { min-height: 40px; padding: 7px 9px; text-align: left; font-size: 14px; }
      .p10a-place.is-current { border-color: #b9d47b; background: #445633; color: #fff5d2; }
      .p10a-empty { grid-column: 1 / -1; margin: 26px 10px; text-align: center; color: #cbbd9b; }
      #p10a-toast { position: fixed; z-index: 1200; left: 50%; bottom: 56px; max-width: min(560px,86vw); transform: translate(-50%,12px); padding: 8px 13px; border: 2px solid var(--p10-line); border-radius: 4px; background: rgba(20,17,13,.96); color: var(--p10-ink); font: 14px/1.4 "Microsoft YaHei", sans-serif; opacity: 0; pointer-events: none; transition: opacity .16s ease, transform .16s ease; }
      #p10a-toast.is-visible { opacity: 1; transform: translate(-50%,0); }
      #p10a-route-hint { position: fixed; z-index: 1050; display: none; transform: translate(-50%,-100%); max-width: min(440px,78vw); padding: 5px 9px; border: 2px solid var(--p10-line); border-radius: 4px; background: rgba(24,20,15,.94); color: var(--p10-ink); box-shadow: 0 3px 0 rgba(0,0,0,.35); font: 700 11px/1.3 "Microsoft YaHei", "PingFang SC", sans-serif; text-align: center; pointer-events: none; }
      @media (max-width: 760px), (max-height: 430px) {
        .p10a-location { max-width: 46%; padding: 5px 7px; font-size: 12px; }
        .p10a-action { min-width: 46px; min-height: 32px; padding: 3px 7px; font-size: 12px; }
        #p10a-guide { padding: 7px; align-items: stretch; }
        .p10a-guide-panel { width: 100%; max-height: 100%; }
        .p10a-guide-head { padding: 8px 10px; }
        .p10a-guide-head h1 { font-size: 18px; }
        .p10a-guide-head p { display: none; }
        #p10a-guide-grid { grid-template-columns: repeat(2, minmax(0,1fr)); gap: 6px; padding: 8px; }
        .p10a-place { min-height: 34px; font-size: 12px; }
      }
    `;
    document.head.appendChild(style);

    UI.root = document.createElement("div");
    UI.root.id = "p10a-world-ui";
    UI.title = document.createElement("div");
    UI.title.className = "p10a-location";
    const actions = document.createElement("div");
    actions.className = "p10a-actions";
    UI.routeButton = makeButton("去向", "p10a-action", cycleLocalRoute);
    actions.append(
      UI.routeButton,
      makeButton(QA_MODE ? "地图QA" : "旅图", "p10a-action", toggleGuide),
      makeButton("全屏", "p10a-action", toggleFullscreen),
    );
    UI.root.append(UI.title, actions);
    document.body.appendChild(UI.root);

    UI.routeHint = document.createElement("div");
    UI.routeHint.id = "p10a-route-hint";
    document.body.appendChild(UI.routeHint);

    UI.modal = document.createElement("div");
    UI.modal.id = "p10a-guide";
    UI.modal.addEventListener("pointerdown", event => {
      if (event.target !== UI.modal) return;
      stopEvent(event);
      closeGuide();
    });
    const panel = document.createElement("div");
    panel.className = "p10a-guide-panel";
    const head = document.createElement("div");
    head.className = "p10a-guide-head";
    const titleWrap = document.createElement("div");
    const title = document.createElement("h1");
    title.textContent = QA_MODE ? "地图 QA 目录" : "已发现地点";
    const subtitle = document.createElement("p");
    subtitle.textContent = QA_MODE ? "开发检查入口：显示全部原作者样例地图。" : "沿道路到达过的区域可以在这里快速返回。";
    titleWrap.append(title, subtitle);
    head.append(titleWrap, makeButton("×", "p10a-close", closeGuide));
    UI.grid = document.createElement("div");
    UI.grid.id = "p10a-guide-grid";
    panel.append(head, UI.grid);
    UI.modal.appendChild(panel);
    document.body.appendChild(UI.modal);

    UI.toast = document.createElement("div");
    UI.toast.id = "p10a-toast";
    document.body.appendChild(UI.toast);
  }

  function exitMeta(eventData) {
    const note = String(eventData?.note || "");
    const label = note.match(/<P10Exit:([^>]+)>/)?.[1]?.replace(/^·\s*/, "");
    const mode = note.match(/<P10Mode:([^>]+)>/)?.[1] || "road";
    const portal = WORLD.portals.find(item => item.from === Number($gameMap?.mapId()) && item.eventId === Number(eventData?.id));
    return label ? { label, mode, labelOffsetPx: portal?.labelOffsetPx || null } : null;
  }

  class Sprite_P10ExitLabel extends Sprite {
    constructor(character, meta) {
      const label = landmarkText(meta.label);
      const width = Math.min(210, Math.max(88, label.length * 12 + 18));
      super(new Bitmap(width, 28));
      this._character = character;
      this._meta = meta;
      this.anchor.set(0.5, 1);
      this.z = 99;
      this.bitmap.fillRect(1, 1, width - 2, 25, "rgba(25,21,15,0.88)");
      this.bitmap.fillRect(1, 24, width - 2, 2, "#b68a45");
      this.bitmap.fontFace = $gameSystem?.mainFontFace?.() || "sans-serif";
      this.bitmap.fontSize = 11;
      this.bitmap.textColor = "#f2e3bd";
      this.bitmap.outlineColor = "rgba(0,0,0,.85)";
      this.bitmap.outlineWidth = 2;
      this.bitmap.drawText(label, 4, 0, width - 8, 24, "center");
    }

    update() {
      super.update();
      const halfWidth = this.bitmap.width / 2;
      const canvasRect = Graphics._canvas?.getBoundingClientRect?.();
      const scaleX = canvasRect?.width ? canvasRect.width / Graphics.width : 1;
      const scaleY = canvasRect?.height ? canvasRect.height / Graphics.height : 1;
      const offsetX = Number(this._meta.labelOffsetPx?.x || 0) / Math.max(scaleX, 0.01);
      const offsetY = Number(this._meta.labelOffsetPx?.y || 0) / Math.max(scaleY, 0.01);
      this.x = Math.max(halfWidth + 6, Math.min(Graphics.width - halfWidth - 6, this._character.screenX() + offsetX));
      this.y = this._character.screenY() - 22 + offsetY;
      const distance = window.$gamePlayer
        ? Math.abs($gamePlayer.x - this._character.x) + Math.abs($gamePlayer.y - this._character.y)
        : 99;
      this.visible = distance <= 7 || UI.guideLabel === this._meta.label;
      this.opacity = distance <= 3 ? 255 : 220;
    }
  }

  const _Spriteset_Map_createCharacters = Spriteset_Map.prototype.createCharacters;
  Spriteset_Map.prototype.createCharacters = function() {
    _Spriteset_Map_createCharacters.call(this);
    this._p10aExitLabels = [];
    for (const event of $gameMap.events()) {
      const meta = exitMeta(event.event());
      if (!meta) continue;
      const sprite = new Sprite_P10ExitLabel(event, meta);
      this._p10aExitLabels.push(sprite);
      this._tilemap.addChild(sprite);
    }
  };

  const _Game_System_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    _Game_System_initialize.call(this);
    this._p10aDiscoveredPacks = [];
  };

  Scene_Boot.prototype.startNormalGame = function() {
    this.checkPlayerLocation();
    DataManager.setupNewGame();
    SceneManager.goto(Scene_Map);
  };

  const _SceneManager_initialize = SceneManager.initialize;
  SceneManager.initialize = function() {
    _SceneManager_initialize.call(this);
    createUi();
    refreshScale();
  };

  const _Scene_Map_start = Scene_Map.prototype.start;
  Scene_Map.prototype.start = function() {
    _Scene_Map_start.call(this);
    createUi();
    discoverCurrent();
    updateHeader();
    refreshScale();
    if (!sessionStorage.getItem("p10a-r3-onboarding")) {
      sessionStorage.setItem("p10a-r3-onboarding", "1");
      setTimeout(() => showToast("地图路标会直接写明去向；迷路时点击右上角“去向”逐个定位出口", 4200), 300);
    }
  };

  const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
  Scene_Map.prototype.onMapLoaded = function() {
    _Scene_Map_onMapLoaded.call(this);
    discoverCurrent();
    updateHeader();
    const route = currentRoute();
    if (route && $gamePlayer.isTransferring()) setTimeout(() => showToast(`抵达：${route.label}`), 120);
  };

  const _Scene_Map_update = Scene_Map.prototype.update;
  Scene_Map.prototype.update = function() {
    _Scene_Map_update.call(this);
    updateRouteHint();
  };

  const _Scene_Map_terminate = Scene_Map.prototype.terminate;
  Scene_Map.prototype.terminate = function() {
    _Scene_Map_terminate.call(this);
    if (UI.root) UI.root.style.display = "none";
    if (UI.routeHint) UI.routeHint.style.display = "none";
  };

  Scene_Map.prototype.callMenu = function() {
    toggleGuide();
  };

  window.addEventListener("resize", () => setTimeout(refreshScale, 30));
  document.addEventListener("fullscreenchange", () => setTimeout(refreshScale, 30));
  document.addEventListener("keydown", event => {
    if (event.key === "Tab") {
      stopEvent(event);
      toggleGuide();
    } else if (event.key === "Escape" && UI.modal?.classList.contains("is-open")) {
      stopEvent(event);
      closeGuide();
    }
  }, true);

  window.P10A = {
    world: WORLD,
    openGuide,
    closeGuide,
    travelTo(mapId) { travel(routeForMap(mapId)); },
    currentRoute,
    exitLabels() {
      return $gameMap.events().map(event => exitMeta(event.event())).filter(Boolean);
    },
  };
})();
