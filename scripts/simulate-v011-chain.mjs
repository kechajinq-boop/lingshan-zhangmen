import fs from 'node:fs';
import path from 'node:path';

const DAY_SECONDS = 60;
const DAYS = 10;
const RUN_SECONDS = DAY_SECONDS * DAYS;

const chains = {
  pill: {
    label: '现有丹药基线（灵田→炼丹房→丹药铺）',
    gatherTime: 6,
    craftTime: 8,
    inputPerCraft: 2,
    unitPrice: 30,
    gatherCost: 50,
    craftCost: 120,
    shopCost: 100,
  },
  forge75: {
    label: '炼器草案（青锋剑75灵石）',
    gatherTime: 8,
    craftTime: 12,
    inputPerCraft: 3,
    unitPrice: 75,
    gatherCost: 90,
    craftCost: 180,
    shopCost: 160,
  },
  forge65: {
    label: '炼器保守价（青锋剑65灵石）',
    gatherTime: 8,
    craftTime: 12,
    inputPerCraft: 3,
    unitPrice: 65,
    gatherCost: 90,
    craftCost: 180,
    shopCost: 160,
  },
};

function simulate(chain, gatherCount = 1, craftCount = 1) {
  const gathered = Math.floor(RUN_SECONDS / chain.gatherTime) * gatherCount;
  const craftCapacity = Math.floor(RUN_SECONDS / chain.craftTime) * craftCount;
  const crafted = Math.min(craftCapacity, Math.floor(gathered / chain.inputPerCraft));
  const rawLeft = gathered - crafted * chain.inputPerCraft;
  const gross = crafted * chain.unitPrice;
  const buildCost = gatherCount * chain.gatherCost + craftCount * chain.craftCost + chain.shopCost;
  const netAfterBuildings = gross - buildCost;
  return { gathered, crafted, rawLeft, gross, buildCost, netAfterBuildings };
}

const rows = [
  ['pill', 1, 1],
  ['forge75', 1, 1],
  ['forge65', 1, 1],
  ['forge65', 2, 1],
  ['forge65', 2, 2],
].map(([key, gatherCount, craftCount]) => {
  const chain = chains[key];
  return { key, gatherCount, craftCount, chain, ...simulate(chain, gatherCount, craftCount) };
});

const pillNet = rows[0].netAfterBuildings;
const lines = [
  '# v0.11 灵矿炼器首轮10日经济模拟',
  '',
  '> 仅用于确定首测数值，不代表正式平衡。模拟不计弟子、升级、长老、相性、访客排队和声望奖励。',
  '',
  `- 游戏时间：${DAYS}天（${RUN_SECONDS}秒）`,
  '- 假设所有成品均能售出。',
  '- 建筑造价在净收益中一次性扣除。',
  '',
  '| 方案 | 采集建筑 | 加工建筑 | 原料产出 | 成品产出 | 建筑造价 | 总收入 | 扣建筑造价后 | 对丹药基线 |',
  '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...rows.map(row => {
    const delta = row.netAfterBuildings - pillNet;
    const deltaText = delta === 0 ? '基线' : `${delta > 0 ? '+' : ''}${delta}`;
    return `| ${row.chain.label} | ${row.gatherCount} | ${row.craftCount} | ${row.gathered} | ${row.crafted} | ${row.buildCost} | ${row.gross} | ${row.netAfterBuildings} | ${deltaText} |`;
  }),
  '',
  '## 结论',
  '',
  '- 75灵石版本的单组炼器链，扣除建筑造价后比现有聚灵丹单组基线高约17%，会进一步放大中后期灵石溢出。',
  '- 65灵石版本的单组炼器链与现有丹药基线接近，更适合作为首测默认值。',
  '- 1座灵矿场每10天产75矿，只够炼25柄法器；炼器坊理论上能炼50次，因此单矿场是明确瓶颈。',
  '- 玩家增加第二座灵矿场后，炼器坊才会接近满负荷，能够形成自然的扩建动机。',
  '- 正式数值仍需进入真实访客分流环境测试；法器铺不能凭空卖货，也不能抢占全部丹药铺客流。',
  '',
  '## 首测建议值',
  '',
  '- 灵矿场：90灵石，8秒产1份灵矿石。',
  '- 炼器坊：180灵石，12秒消耗3份灵矿石，产1柄青锋剑。',
  '- 法器铺：160灵石，青锋剑基础售价建议先用65灵石，而非75灵石。',
];

const output = path.resolve('deliverables/v011-planning/v011-economy-simulation.md');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${lines.join('\n')}\n`, 'utf8');
console.log(`已生成: ${path.relative(process.cwd(), output)}`);
