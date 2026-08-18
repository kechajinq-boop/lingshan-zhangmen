const STAGES = {
  crash: { label: '崩盘', index: [0, 14], price: [3, 6] },
  low: { label: '低迷', index: [15, 34], price: [7, 9] },
  stable: { label: '平稳', index: [35, 59], price: [10, 12] },
  hot: { label: '火热', index: [60, 79], price: [13, 16] },
  crazy: { label: '狂热', index: [80, 100], price: [20, 23] },
};

const TRANSITIONS = {
  crash: [['crash', 0.08], ['low', 0.72], ['stable', 0.20]],
  low: [['crash', 0.02], ['low', 0.30], ['stable', 0.57], ['hot', 0.11]],
  stable: [['crash', 0.01], ['low', 0.13], ['stable', 0.53], ['hot', 0.28], ['crazy', 0.05]],
  hot: [['crash', 0.03], ['low', 0.03], ['stable', 0.24], ['hot', 0.48], ['crazy', 0.22]],
  crazy: [['crash', 0.20], ['stable', 0.10], ['hot', 0.45], ['crazy', 0.25]],
};

const RUNS = 2000;
const DAYS = 365;
const ALCHEMY_VALUE_PER_HERB = 15;

function mulberry32(seed) {
  return function random() {
    let value = seed += 0x6D2B79F5;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function integer(random, [min, max]) {
  return min + Math.floor(random() * (max - min + 1));
}

function choose(random, weighted) {
  let roll = random();
  for (const [value, weight] of weighted) {
    roll -= weight;
    if (roll <= 0) return value;
  }
  return weighted.at(-1)[0];
}

function nextStage(random, current, risingStreak) {
  if ((current === 'hot' || current === 'crazy') && risingStreak >= 3) {
    const extraCrashChance = Math.min(0.25, (risingStreak - 2) * 0.05);
    if (random() < extraCrashChance) return 'crash';
  }
  if (current !== 'crazy') return choose(random, TRANSITIONS[current]);
  const crashChance = Math.min(0.45, 0.20 + Math.max(0, risingStreak - 1) * 0.08);
  const crazyChance = Math.max(0, 0.45 - crashChance);
  return choose(random, [
    ['crash', crashChance],
    ['stable', 0.10],
    ['hot', 0.45],
    ['crazy', crazyChance],
  ]);
}

function simulate(seed) {
  const random = mulberry32(seed);
  let stage = 'stable';
  let previousPrice = 11;
  let risingStreak = 0;
  const days = [];
  for (let day = 1; day <= DAYS; day++) {
    stage = nextStage(random, stage, risingStreak);
    const definition = STAGES[stage];
    const index = integer(random, definition.index);
    const price = integer(random, definition.price);
    risingStreak = price > previousPrice ? risingStreak + 1 : 0;
    days.push({ day, stage, index, price, risingStreak });
    previousPrice = price;
  }
  return days;
}

const totals = {
  price: 0,
  count: 0,
  normalPrice: 0,
  normalCount: 0,
  stage: Object.fromEntries(Object.keys(STAGES).map(key => [key, { count: 0, price: 0 }])),
  maxRisingStreak: 0,
};

for (let run = 1; run <= RUNS; run++) {
  for (const day of simulate(run * 7919)) {
    totals.price += day.price;
    totals.count++;
    totals.stage[day.stage].count++;
    totals.stage[day.stage].price += day.price;
    totals.maxRisingStreak = Math.max(totals.maxRisingStreak, day.risingStreak);
    if (day.stage !== 'crazy') {
      totals.normalPrice += day.price;
      totals.normalCount++;
    }
  }
}

const averagePrice = totals.price / totals.count;
const result = {
  runs: RUNS,
  daysPerRun: DAYS,
  sampledDays: totals.count,
  alchemyValuePerHerb: ALCHEMY_VALUE_PER_HERB,
  directSaleAveragePerHerb: Number(averagePrice.toFixed(3)),
  alchemyAdvantageVsAlwaysSelling: Number(((ALCHEMY_VALUE_PER_HERB / averagePrice - 1) * 100).toFixed(1)),
  normalMarketAverageExcludingCrazy: Number((totals.normalPrice / totals.normalCount).toFixed(3)),
  crazyAverageVsAlchemyPercent: Number(((totals.stage.crazy.price / totals.stage.crazy.count / ALCHEMY_VALUE_PER_HERB) * 100).toFixed(1)),
  maxObservedRisingStreak: totals.maxRisingStreak,
  stages: Object.fromEntries(Object.entries(totals.stage).map(([key, value]) => [key, {
    label: STAGES[key].label,
    frequencyPercent: Number((value.count / totals.count * 100).toFixed(2)),
    averagePrice: Number((value.price / value.count).toFixed(3)),
  }])),
};

console.log(JSON.stringify(result, null, 2));
