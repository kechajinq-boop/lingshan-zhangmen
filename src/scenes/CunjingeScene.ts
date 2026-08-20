import Phaser from 'phaser';
import { GameState } from '../state';
import {
  CUNJINGE_NPCS,
  CUNJINGE_ROOMS,
  CunjingeAppraisalId,
  CunjingeRoomId,
  appraiserLevel,
  canEnterCunjingeRoom,
  exchangeCunjingeChips,
  finishCunjingeChest,
  isCunjingeOpenDay,
  maxExchangeableSpirit,
  nextCunjingeOpenDay,
  refundCunjingeChips,
  startCunjingeAuction,
  submitCunjingeBid,
  suggestedCunjingeBid,
  syncCunjingeEvent,
  useCunjingeAppraisal,
} from '../systems/CunjingeSystem';

const FONT = 'Microsoft YaHei, sans-serif';
const RARITY_COLOR: Record<string, number> = { white: 0xd8d5c8, green: 0x67bf75, blue: 0x5e9dda, purple: 0xa778d4, gold: 0xe3ad35 };

export class CunjingeScene extends Phaser.Scene {
  gs!: GameState;
  root!: Phaser.GameObjects.Container;
  draftBid = 0;
  tickCarry = 0;

  constructor() { super('Cunjinge'); }

  create(): void {
    const raw: any = this.cache.json.get('gamedata');
    const loader = new GameState(this, raw, 'dan');
    const restored = loader.save.load();
    this.gs = new GameState(this, raw, (restored?.faction as any) || 'dan', restored || undefined);
    syncCunjingeEvent(this.gs.data.cunjinge, this.gs.data.day);
    this.root = this.add.container(0, 0);
    this.cameras.main.setBackgroundColor(0x171612);
    this.scale.on('resize', this.render, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off('resize', this.render, this));
    this.render();
  }

  button(x: number, y: number, width: number, height: number, label: string, run: () => void, color = 0x9b6332, enabled = true): Phaser.GameObjects.Container {
    const container = this.add.container(x, y);
    const bg = this.add.rectangle(0, 0, width, height, enabled ? color : 0x5e574d, enabled ? 0.98 : 0.72)
      .setStrokeStyle(1, enabled ? 0xf2d39a : 0x8b8378, 0.9);
    const text = this.add.text(0, 0, label, { fontFamily: FONT, fontSize: height <= 32 ? '12px' : '14px', color: enabled ? '#fff5d6' : '#b8b1a5', fontStyle: 'bold', align: 'center' }).setOrigin(0.5);
    if (enabled) {
      bg.setInteractive({ useHandCursor: true });
      bg.on('pointerdown', () => run());
    }
    container.add([bg, text]);
    return container;
  }

  render(): void {
    this.root.removeAll(true);
    const w = this.scale.width;
    const h = this.scale.height;
    const active = this.gs.data.cunjinge.activeAuction;
    this.root.add(this.add.rectangle(0, 0, w, h, 0x171612).setOrigin(0));
    this.root.add(this.add.rectangle(12, 10, w - 24, 54, 0xffefc1, 0.98).setOrigin(0).setStrokeStyle(2, 0xe19743));
    this.root.add(this.add.text(30, 37, '寸金阁', { fontFamily: FONT, fontSize: w < 900 ? '21px' : '26px', color: '#5a331d', fontStyle: 'bold' }).setOrigin(0, 0.5));
    const status = active
      ? `${CUNJINGE_ROOMS.find(room => room.id === active.roomId)?.name} · 第${active.round}/5轮 · ${Math.ceil(active.secondsLeft)}秒 · 筹码${this.gs.data.cunjinge.chips}`
      : `第${this.gs.data.day}天 · 灵石${this.gs.data.spirit} · 筹码${this.gs.data.cunjinge.chips} · 鉴宝师Lv${appraiserLevel(this.gs.data.cunjinge.appraiserXp)}`;
    this.root.add(this.add.text(w / 2, 37, status, { fontFamily: FONT, fontSize: w < 900 ? '12px' : '15px', color: '#67492f' }).setOrigin(0.5));
    if (active) this.renderAuction(active, w, h);
    else this.renderLobby(w, h);
    this.game.canvas.dataset.cunjingeState = JSON.stringify({ day: this.gs.data.day, state: this.gs.data.cunjinge });
  }

  renderLobby(w: number, h: number): void {
    const state = this.gs.data.cunjinge;
    const open = isCunjingeOpenDay(this.gs.data.day);
    const y0 = 92;
    this.root.add(this.add.text(28, y0, open ? `万宝会今日开放 · 尚可参与${Math.max(0, 3 - state.chestsStarted)}匣` : `尚未开放 · 距离第${nextCunjingeOpenDay(this.gs.data.day)}天还有${nextCunjingeOpenDay(this.gs.data.day) - this.gs.data.day}天`, {
      fontFamily: FONT, fontSize: '16px', color: open ? '#f2c66d' : '#b6ad9c', fontStyle: 'bold',
    }));
    const exchangeY = y0 + 42;
    this.root.add(this.add.text(28, exchangeY, `可兑换 ${maxExchangeableSpirit(this.gs.data.spirit)}（自动保留宗门运营金）`, { fontFamily: FONT, fontSize: '12px', color: '#cfc2a8' }).setOrigin(0, 0.5));
    [500, 5000, 20000].forEach((amount, index) => this.root.add(this.button(235 + index * 112, exchangeY, 102, 30, `兑换${amount}`, () => this.exchange(amount), 0x76532f, maxExchangeableSpirit(this.gs.data.spirit) > 0)));
    this.root.add(this.button(575, exchangeY, 96, 30, '兑换全部', () => this.exchange(maxExchangeableSpirit(this.gs.data.spirit)), 0x76532f, maxExchangeableSpirit(this.gs.data.spirit) > 0));

    const cardTop = Math.min(h - 210, y0 + 78);
    const gap = 14;
    const cardW = Math.min(310, (w - 56 - gap * 2) / 3);
    CUNJINGE_ROOMS.forEach((room, index) => {
      const x = 28 + index * (cardW + gap);
      const reason = canEnterCunjingeRoom(room.id, state.chips, this.gs.data.reputation);
      const enabled = open && state.chestsStarted < 3 && !reason;
      const bg = this.add.rectangle(x, cardTop, cardW, Math.min(230, h - cardTop - 78), 0x30271f, 0.98).setOrigin(0).setStrokeStyle(2, enabled ? 0xdca34d : 0x66594c);
      const title = this.add.text(x + 16, cardTop + 18, room.name, { fontFamily: FONT, fontSize: '19px', color: '#f4d381', fontStyle: 'bold' });
      const detail = this.add.text(x + 16, cardTop + 54, `入场筹码：${room.minChips}\n声望门槛：${room.minReputation}\n整匣价值：${room.valueMin}～${room.valueMax}\n基础阅历：${room.xp}`, { fontFamily: FONT, fontSize: '13px', color: '#ddd0b5', lineSpacing: 8 });
      this.root.add([bg, title, detail, this.button(x + cardW / 2, cardTop + Math.min(194, h - cardTop - 112), cardW - 30, 36, enabled ? '进入竞拍' : (reason || (open ? '本次已结束' : '等待开放')), () => this.start(room.id), 0xa66d32, enabled)]);
    });
    if (!state.tutorialCompleted && this.gs.data.day >= 7) this.root.add(this.button(w / 2, h - 66, 210, 38, '免费教学宝匣', () => this.start('market', true), 0x4d7a62));
    this.root.add(this.button(w - 86, h - 38, 120, 34, '返回宗门', () => this.exitToGame(), 0x7a4936));
  }

  exchange(amount: number): void {
    const result = exchangeCunjingeChips(this.gs.data.cunjinge, this.gs.data.spirit, amount);
    this.gs.data.spirit = result.spirit;
    this.gs.save.save();
    this.render();
  }

  start(roomId: CunjingeRoomId, tutorial = false): void {
    if (!tutorial) {
      const reason = canEnterCunjingeRoom(roomId, this.gs.data.cunjinge.chips, this.gs.data.reputation);
      if (reason) return;
    }
    const error = startCunjingeAuction(this.gs.data.cunjinge, roomId, this.gs.data.day, tutorial);
    if (!error) {
      this.draftBid = suggestedCunjingeBid(this.gs.data.cunjinge.activeAuction!, 'reference');
      this.gs.save.save();
      this.render();
    }
  }

  renderAuction(active: NonNullable<GameState['data']['cunjinge']['activeAuction']>, w: number, h: number): void {
    const contentTop = 78;
    const compact = w < 900;
    const gridSize = compact ? Math.min(310, h - 130) : Math.min(480, h - 145);
    const cell = Math.floor(Math.min(gridSize / 8, (w * 0.48) / 10));
    const gridW = cell * 10, gridH = cell * 8;
    const gridX = 24, gridY = contentTop + 58;
    const npcNames = active.npcIds.map(id => CUNJINGE_NPCS.find(npc => npc.id === id)!);
    ['掌门', ...npcNames.map(npc => npc.name)].forEach((name, index) => {
      const x = 30 + index * Math.min(150, (w - 60) / 4);
      this.root.add(this.add.rectangle(x, contentTop, Math.min(138, (w - 72) / 4), 44, index === 0 ? 0x5c7f62 : 0x493a30).setOrigin(0).setStrokeStyle(1, 0xd6b77b));
      this.root.add(this.add.text(x + 8, contentTop + 9, name, { fontFamily: FONT, fontSize: '12px', color: '#ffe4a4', fontStyle: 'bold' }));
      const previous = active.bidHistory[active.bidHistory.length - 1];
      const bid = index === 0 ? previous?.player : previous?.npcs[active.npcIds[index - 1]];
      this.root.add(this.add.text(x + 8, contentTop + 27, bid === undefined ? '尚未公开' : `上轮 ${bid}`, { fontFamily: FONT, fontSize: '10px', color: '#d8cbb4' }));
    });
    for (let y = 0; y < 8; y++) for (let x = 0; x < 10; x++) this.root.add(this.add.rectangle(gridX + x * cell, gridY + y * cell, cell - 1, cell - 1, 0x28352e).setOrigin(0).setStrokeStyle(1, 0x678070, 0.55));
    active.items.forEach(item => {
      item.cells.forEach(part => this.root.add(this.add.rectangle(gridX + part.x * cell + 2, gridY + part.y * cell + 2, cell - 5, cell - 5, active.result ? RARITY_COLOR[item.rarity] : 0x50675a, 0.92).setOrigin(0).setStrokeStyle(1, active.result ? 0xffe8aa : 0x9bb9a5)));
    });
    const rightX = gridX + gridW + 22;
    const rightW = Math.max(250, w - rightX - 20);
    const visible = active.clues.slice(0, active.round);
    this.root.add(this.add.text(rightX, gridY, '公共线索', { fontFamily: FONT, fontSize: '16px', color: '#f0c66d', fontStyle: 'bold' }));
    this.root.add(this.add.text(rightX, gridY + 28, visible.map(clue => `${clue.round}. ${clue.detail}`).join('\n'), { fontFamily: FONT, fontSize: compact ? '11px' : '13px', color: '#ded2b8', wordWrap: { width: rightW }, lineSpacing: 5 }));
    if (active.appraisalResults.length) this.root.add(this.add.text(rightX, gridY + 132, active.appraisalResults.join('\n'), { fontFamily: FONT, fontSize: '11px', color: '#9fd7c4', wordWrap: { width: rightW } }));
    const appraisalY = gridY + Math.min(210, gridH * 0.55);
    const appraisalIds: Array<[CunjingeAppraisalId, string]> = [['shape', '辨形'], ['aura', '观气'], ['price', '问价'], ['fake', '排伪']];
    appraisalIds.forEach(([id, label], index) => this.root.add(this.button(rightX + 36 + index * 76, appraisalY, 68, 30, label, () => this.appraise(id), 0x476b62, active.appraisalUsesLeft > 0 && !active.usedAppraisals.includes(id) && !active.result)));
    if (active.result) {
      const r = active.result;
      const winner = r.winnerId === 'player' ? '掌门' : CUNJINGE_NPCS.find(npc => npc.id === r.winnerId)?.name;
      this.root.add(this.add.text(rightX, appraisalY + 48, `开箱完成\n赢家：${winner}\n成交价：${r.winningBid}\n实际总值：${r.actualValue}\n${r.playerWon ? `本匣盈亏：${r.playerProfit >= 0 ? '+' : ''}${r.playerProfit}` : '本匣未拍得'}`, { fontFamily: FONT, fontSize: '15px', color: r.playerWon && r.playerProfit >= 0 ? '#88d888' : '#e0b887', lineSpacing: 7 }));
      this.root.add(this.button(rightX + rightW / 2, h - 48, Math.min(220, rightW), 38, '完成本匣', () => { finishCunjingeChest(this.gs.data.cunjinge); this.gs.save.save(); this.render(); }, 0x9b6332));
      return;
    }
    const bidY = h - 95;
    (['safe', 'reference', 'bold', 'follow'] as const).forEach((kind, index) => this.root.add(this.button(rightX + 40 + index * 82, bidY, 76, 30, ['保守80%', '参考100%', '激进120%', '跟价+5'][index], () => { this.draftBid = suggestedCunjingeBid(active, kind); this.render(); }, 0x68513b)));
    this.root.add(this.add.text(rightX, h - 50, `本轮报价：${this.draftBid}`, { fontFamily: FONT, fontSize: '15px', color: '#ffe2a3', fontStyle: 'bold' }).setOrigin(0, 0.5));
    this.root.add(this.button(rightX + rightW - 72, h - 50, 138, 38, '确认提交', () => this.submit(), 0xa86131));
  }

  appraise(id: CunjingeAppraisalId): void {
    const active = this.gs.data.cunjinge.activeAuction;
    if (!active) return;
    useCunjingeAppraisal(active, id, appraiserLevel(this.gs.data.cunjinge.appraiserXp));
    this.gs.save.save();
    this.render();
  }

  submit(): void {
    const active = this.gs.data.cunjinge.activeAuction;
    if (!active) return;
    const result = submitCunjingeBid(this.gs.data.cunjinge, this.draftBid, 30 - active.secondsLeft);
    if (typeof result !== 'string') {
      this.draftBid = this.gs.data.cunjinge.activeAuction?.previousPlayerBid || 0;
      this.gs.save.save();
      this.render();
    }
  }

  update(_time: number, delta: number): void {
    const active = this.gs?.data.cunjinge.activeAuction;
    if (!active || active.result) return;
    this.tickCarry += delta / 1000;
    if (this.tickCarry < 1) return;
    const seconds = Math.floor(this.tickCarry);
    this.tickCarry -= seconds;
    active.secondsLeft = Math.max(0, active.secondsLeft - seconds);
    if (active.secondsLeft <= 0) {
      this.draftBid = active.round === 1 ? 0 : active.previousPlayerBid;
      this.submit();
    } else this.render();
  }

  exitToGame(): void {
    if (this.gs.data.cunjinge.activeAuction) return;
    this.gs.data.spirit = refundCunjingeChips(this.gs.data.cunjinge, this.gs.data.spirit);
    this.gs.save.save();
    this.scene.start('Game', { load: true });
  }
}
