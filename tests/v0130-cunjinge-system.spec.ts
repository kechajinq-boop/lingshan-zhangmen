import { expect, test } from '@playwright/test';
import {
  CUNJINGE_ITEMS,
  CUNJINGE_NPCS,
  CUNJINGE_ROOMS,
  appraiserLevel,
  createCunjingeAuction,
  defaultCunjingeState,
  exchangeCunjingeChips,
  isCunjingeOpenDay,
  maxExchangeableSpirit,
  nextCunjingeOpenDay,
  submitCunjingeBid,
} from '../src/systems/CunjingeSystem';

test('confirmed content pool and calendar rules are fixed', () => {
  expect(CUNJINGE_NPCS).toHaveLength(24);
  expect(CUNJINGE_ITEMS).toHaveLength(40);
  expect(CUNJINGE_ROOMS.map(room => [room.minChips, room.minReputation])).toEqual([
    [500, 0], [5000, 100], [20000, 300],
  ]);
  expect([7, 10, 13, 16].every(isCunjingeOpenDay)).toBe(true);
  expect([6, 8, 9, 11].some(isCunjingeOpenDay)).toBe(false);
  expect(nextCunjingeOpenDay(1)).toBe(7);
  expect(nextCunjingeOpenDay(8)).toBe(10);
});

test('chip exchange preserves the larger of 500 spirit or 15 percent', () => {
  expect(maxExchangeableSpirit(300)).toBe(0);
  expect(maxExchangeableSpirit(1000)).toBe(500);
  expect(maxExchangeableSpirit(10000)).toBe(8500);
  const state = defaultCunjingeState();
  expect(exchangeCunjingeChips(state, 10000, 9000)).toEqual({ spirit: 1500, exchanged: 8500 });
  expect(state.chips).toBe(8500);
});

test('seeded chests are deterministic, legal and stay inside each room value band', () => {
  for (const room of CUNJINGE_ROOMS) {
    for (let seed = 1; seed <= 120; seed++) {
      const first = createCunjingeAuction(seed, room.id);
      if (seed <= 5) expect(createCunjingeAuction(seed, room.id)).toEqual(first);
      expect(first.items.length).toBeGreaterThanOrEqual(8);
      expect(first.items.length).toBeLessThanOrEqual(18);
      expect(first.items.filter(item => item.rarity === 'gold').length).toBeLessThanOrEqual(2);
      const occupied = new Set<string>();
      for (const item of first.items) {
        for (const cell of item.cells) {
          expect(cell.x).toBeGreaterThanOrEqual(0);
          expect(cell.x).toBeLessThan(10);
          expect(cell.y).toBeGreaterThanOrEqual(0);
          expect(cell.y).toBeLessThan(8);
          const key = `${cell.x},${cell.y}`;
          expect(occupied.has(key)).toBe(false);
          occupied.add(key);
        }
      }
      const total = first.items.reduce((sum, item) => sum + item.value, 0);
      expect(total).toBeGreaterThanOrEqual(room.valueMin);
      expect(total).toBeLessThanOrEqual(room.valueMax);
    }
  }
});

test('NPC bids use the public clues rather than hidden item values', () => {
  const first = defaultCunjingeState();
  const second = defaultCunjingeState();
  first.chips = second.chips = 100000;
  first.activeAuction = createCunjingeAuction(71823, 'cloud');
  second.activeAuction = structuredClone(first.activeAuction);
  second.activeAuction.items.forEach(item => { item.value *= 10; });
  const firstBid = submitCunjingeBid(first, 1000, 4);
  const secondBid = submitCunjingeBid(second, 1000, 4);
  expect(typeof firstBid).toBe('object');
  expect(typeof secondBid).toBe('object');
  if (typeof firstBid !== 'string' && typeof secondBid !== 'string') {
    expect(secondBid.npcs).toEqual(firstBid.npcs);
    expect(secondBid.submitOrder).toEqual(firstBid.submitOrder);
  }
});

test('five rounds settle once and level ten still requires 3150 experience', () => {
  const state = defaultCunjingeState();
  state.chips = 100000;
  state.activeAuction = createCunjingeAuction(9127, 'heaven');
  for (let round = 1; round <= 5; round++) {
    const result = submitCunjingeBid(state, 0, 3);
    expect(typeof result).toBe('object');
  }
  expect(state.activeAuction?.result).not.toBeNull();
  expect(state.stats.chestsPlayed).toBe(1);
  expect(state.appraiserXp).toBe(30);
  expect(submitCunjingeBid(state, 0)).toBe('当前没有可报价的宝匣');
  expect(appraiserLevel(3149)).toBe(9);
  expect(appraiserLevel(3150)).toBe(10);
});
