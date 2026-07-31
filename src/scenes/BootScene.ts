import Phaser from 'phaser';
import gamedata from '../data/gamedata.json';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload(): void {
    const path = 'assets/v03/';
    this.load.image('menu-bg', path + 'menu-mountains.jpg');
    for (const id of ['lingtian', 'danfang', 'danpu', 'liangong', 'xiangfang']) {
      this.load.image('building-' + id, path + 'building-' + id + '.png');
    }
    this.load.image('building-gate', path + 'building-gate.png');
    for (const variant of ['a', 'b', 'c', 'd']) {
      this.load.image('character-disciple-' + variant, path + 'character-disciple-' + variant + '.png');
      this.load.image('character-visitor-' + variant, path + 'character-visitor-' + variant + '.png');
      this.load.image('character-visitor-' + variant + '-back', path + 'character-visitor-' + variant + '-back.png');
    }
    const uiPath = 'assets/v06/';
    for (const id of ['recruit', 'elder', 'expand', 'research', 'pause', 'speed-1x', 'speed-2x']) {
      this.load.image('ui-' + id, uiPath + 'ui-' + id + '.png');
    }
  }

  create(): void {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xffffff, 1);
    g.fillRect(0, 0, 4, 4);
    g.generateTexture('px', 4, 4);
    g.destroy();
    this.cache.json.add('gamedata', gamedata);
    this.scene.start('Menu');
  }
}
