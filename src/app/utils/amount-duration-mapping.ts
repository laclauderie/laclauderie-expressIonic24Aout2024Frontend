export const my_durations = {
  duration0: 0.1,
  duration1: 0.5,
  duration2: 1,
  duration3: 3,
  duration4: 6,
  duration5: 9,
  duration6: 12,
};

export const my_amounts = {
  amount0: 0.1,
  amount1: 0.5,
  amount2: 1,
  amount3: 3,
  amount4: 6,
  amount5: 9,
  amount6: 12,
};

export function isAmountOf(durationKey: string): number | undefined {
  const index = Object.keys(my_durations).indexOf(durationKey);
  if (index !== -1) {
    return Object.values(my_amounts)[index];
  }
  return undefined;
}
