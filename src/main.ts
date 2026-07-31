import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#1a1d23',
  scale: {
    mode: Phaser.Scale.RESIZE,
    width: '100%',
    height: '100%',
  },
  scene: [BootScene, MenuScene, GameScene],
});
