# v0.12.2-A 自然装饰纠正回滚基线

- 修改前提交：`530672f`
- 修改前状态：公开试玩版本所使用的五件装饰来自旧 `public/assets/v10/props` 素材。
- 回滚方式：恢复上述提交中的 `src/scenes/BootScene.ts`、`src/scenes/GameScene.ts`、`src/data/gamedata.json`，并移除新增的 `public/assets/v12/decor`。
- 玩家存档：本次保留原有五个装饰 ID，旧存档不需要迁移。
