import Phaser from 'phaser';
import gamedata from '../data/gamedata.json';

export class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload(): void {
    const basePath = 'assets/v03/';
    const path = 'assets/v10/buildings/';
    this.load.image('menu-bg', basePath + 'menu-mountains.jpg');
    for (const id of ['lingtian', 'danfang', 'danpu', 'liangong', 'xiangfang']) {
      this.load.image('building-' + id, path + 'building-' + id + '.png');
    }
    const v12Path = 'assets/v12/';
    for (const id of ['lingkuang', 'lianqi', 'faqipu']) {
      this.load.image('building-' + id, v12Path + 'buildings/building-' + id + '.png');
      this.load.image('icon-build-' + id, v12Path + 'icons/icon-build-' + id + '.png');
    }
    this.load.image('icon-spirit-ore', v12Path + 'icons/icon-spirit-ore.png');
    this.load.image('icon-azure-edge-sword', v12Path + 'icons/icon-azure-edge-sword.png');
    this.load.image('fx-da-geng-sword-array', v12Path + 'fx/fx-da-geng-sword-array.png');
    this.load.spritesheet('fx-mine-glow', v12Path + 'fx/fx-mine-glow.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('fx-forge-sparks', v12Path + 'fx/fx-forge-sparks.png', { frameWidth: 128, frameHeight: 128 });
    this.load.image('building-gate', path + 'building-gate.png');
    const v10TerrainPath = 'assets/v10/terrain/';
    for (const id of [
      'tile_grass_base_01',
      'tile_stone_base_01',
      'tile_dirt_base_01',
      'tile_water_base_01',
      'tile_herb_base_01',
      'tile_stone_path_straight_01',
      'tile_stone_path_corner_01',
      'tile_stone_path_cross_01',
      'tile_water_bank_01',
      'tile_cliff_edge_01',
      'tile_cliff_corner_01',
      'tile_stairs_01',
      'tile_waterfall_01',
      'tile_cloud_01',
      'tile_mountain_bg_01',
    ]) {
      this.load.image('v10-' + id, v10TerrainPath + id + '.png');
    }
    const v10PropPath = 'assets/v10/props/';
    for (const id of [
      'prop_tree_pine_01',
      'prop_tree_sakura_01',
      'prop_bamboo_01',
      'prop_rock_01',
      'prop_fence_01',
      'prop_lantern_01',
      'prop_incense_01',
      'prop_bridge_01',
      'prop_flower_01',
      'prop_lotus_01',
      'prop_cloud_01',
    ]) {
      this.load.image('v10-' + id, v10PropPath + id + '.png');
    }
    for (const stage of ['01', '02', '03']) {
      this.load.image('v10-map-stage-' + stage, 'assets/v10/map/map_stage_' + stage + '_base.png');
    }
    this.load.image('v12-map-base', 'assets/v12/map/map_base.png');
    const fixedPath = 'assets/v10/fixed/';
    this.load.image('v10-fixed-main-hall', fixedPath + 'bldg_main_hall.png');
    this.load.image('v10-fixed-elder-pavilion', fixedPath + 'bldg_elder_pavilion.png');
    this.load.image('v10-fixed-research-library', fixedPath + 'bldg_research_library.png');
    this.load.image('v10-fixed-construction-yard', fixedPath + 'bldg_construction_site.png');
    this.load.image('v10-fixed-sect-gate', fixedPath + 'bldg_sect_gate.png');
    this.load.image('v10-fixed-lantern-left', fixedPath + 'prop_lantern_stone_01.png');
    this.load.image('v10-fixed-incense', fixedPath + 'prop_incense_burner.png');
    this.load.image('v10-fixed-lantern-right', fixedPath + 'prop_lantern_stone_02.png');
    this.load.image('v10-fixed-water-lotus', fixedPath + 'prop_water_lotus.png');
    for (const variant of ['a', 'b', 'c', 'd']) {
      this.load.image('character-disciple-' + variant, basePath + 'character-disciple-' + variant + '.png');
      this.load.image('character-visitor-' + variant, basePath + 'character-visitor-' + variant + '.png');
      this.load.image('character-visitor-' + variant + '-back', basePath + 'character-visitor-' + variant + '-back.png');
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
    if (!this.anims.exists('v12-mine-glow')) {
      this.anims.create({ key: 'v12-mine-glow', frames: this.anims.generateFrameNumbers('fx-mine-glow', { start: 0, end: 3 }), frameRate: 5.5, repeat: -1 });
    }
    if (!this.anims.exists('v12-forge-sparks')) {
      this.anims.create({ key: 'v12-forge-sparks', frames: this.anims.generateFrameNumbers('fx-forge-sparks', { start: 0, end: 3 }), frameRate: 9, repeat: -1 });
    }
    this.cache.json.add('gamedata', gamedata);
    this.scene.start('Menu');
  }
}
