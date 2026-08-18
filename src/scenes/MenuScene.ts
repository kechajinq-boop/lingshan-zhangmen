import Phaser from 'phaser';

const FONT = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';

export class MenuScene extends Phaser.Scene {
  constructor() { super('Menu'); }

  create(): void {
    const { width, height } = this.scale;
    const data: any = this.cache.json.get('gamedata');
    const hasSave = !!localStorage.getItem('lingshan_save_v1');

    this.cameras.main.setBackgroundColor(0x7ed4f5);
    this.add.image(width / 2, height / 2, 'menu-bg').setDisplaySize(width, height);
    this.add.rectangle(width / 2, height / 2, width, height, 0x4a84c4, 0.08);

    const titleY = Math.max(50, height * 0.14);
    this.add.text(width / 2, titleY, '灵山大掌门', {
      fontSize: Math.min(46, Math.max(34, height * 0.085)) + 'px',
      color: '#ffe2a3',
      fontStyle: 'bold',
      fontFamily: FONT,
      stroke: '#4a2617',
      strokeThickness: 6,
      shadow: { color: '#000000', blur: 0, offsetX: 3, offsetY: 4, fill: true },
    }).setOrigin(0.5);
    this.add.text(width / 2, titleY + 50, '经营内容补全 · v0.12.2-A', {
      fontSize: '14px',
      color: '#57351e',
      fontFamily: FONT,
      backgroundColor: '#fff0bfdd',
      padding: { x: 10, y: 4 },
    }).setOrigin(0.5);

    const factions = data.factions;
    factions.forEach((f: any, i: number) => {
      const y = height * 0.38 + i * Math.min(104, height * 0.2);
      const cardWidth = Math.min(390, width - 40);
      const bg = this.add.rectangle(width / 2, y, cardWidth, 78, 0xffefbf, 0.96)
        .setStrokeStyle(3, 0xf08b3e)
        .setInteractive({ useHandCursor: true });
      this.add.rectangle(width / 2, y, cardWidth - 8, 70, 0xffffff, 0.25).setStrokeStyle(1, 0xffc861, 0.7);
      this.add.text(width / 2, y - 19, f.name, {
        fontSize: '21px', color: '#6a361c', fontStyle: 'bold', fontFamily: FONT,
        stroke: '#fff1bd', strokeThickness: 2,
      }).setOrigin(0.5);
      this.add.text(width / 2, y + 13, f.desc, {
        fontSize: '12px', color: '#5b4833', fontFamily: FONT,
        wordWrap: { width: cardWidth - 30 }, align: 'center',
      }).setOrigin(0.5);
      bg.on('pointerover', () => bg.setFillStyle(0xffd67b, 0.98));
      bg.on('pointerout', () => bg.setFillStyle(0xffefbf, 0.96));
      bg.on('pointerdown', () => this.scene.start('Game', { faction: f.id }));
    });

    if (hasSave) {
      const btnY = Math.min(height - 58, height * 0.82);
      const btn = this.add.rectangle(width / 2, btnY, 240, 42, 0x62b95c, 0.98)
        .setStrokeStyle(3, 0xffd15b)
        .setInteractive({ useHandCursor: true });
      this.add.text(width / 2, btnY, '继续上次的门派', {
        fontSize: '16px', color: '#fffbea', fontStyle: 'bold', fontFamily: FONT,
      }).setOrigin(0.5);
      btn.on('pointerover', () => btn.setFillStyle(0x79cc66, 1));
      btn.on('pointerout', () => btn.setFillStyle(0x62b95c, 0.98));
      btn.on('pointerdown', () => this.scene.start('Game', { load: true }));
    }

    this.add.text(width / 2, height - 15, '美术垂直切片 · 数据驱动 · 玩法验证版', {
      fontSize: '11px', color: '#4d3a22', fontFamily: FONT,
      backgroundColor: '#fff2cddd', padding: { x: 8, y: 2 },
    }).setOrigin(0.5);
  }
}
