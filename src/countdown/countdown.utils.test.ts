import { describe, expect, it } from 'vitest';
import { daysBetween, parseIsoDate } from './countdown.utils';

describe('daysBetween', () => {
  it('counts calendar days until the exam', () => {
    expect(daysBetween('2026-11-10', '2026-12-06')).toBe(26);
  });

  it('is negative when the target is before', () => {
    expect(daysBetween('2026-12-06', '2026-11-10')).toBe(-26);
  });

  it('is zero on the same day', () => {
    expect(daysBetween('2026-11-10', '2026-11-10')).toBe(0);
  });

  it('crosses months and leap years', () => {
    expect(daysBetween('2026-02-28', '2026-03-01')).toBe(1);
    expect(daysBetween('2028-02-28', '2028-03-01')).toBe(2);
    expect(daysBetween('2026-12-31', '2027-01-01')).toBe(1);
  });

  it('ignores daylight saving changes', () => {
    expect(daysBetween('2026-10-31', '2026-11-02')).toBe(2);
    expect(daysBetween('2026-02-21', '2026-02-23')).toBe(2);
  });

  it('is NaN for an invalid date', () => {
    expect(daysBetween('2026-02-30', '2026-03-01')).toBeNaN();
  });
});

describe('parseIsoDate', () => {
  it('parses a valid ISO date', () => {
    expect(parseIsoDate('2026-11-10')).toBe(Date.UTC(2026, 10, 10));
  });

  it('rejects invalid dates', () => {
    for (const value of ['2026-13-01', '2026-02-30', '10/11/2026', '2026-11-10T00:00', '']) {
      expect(parseIsoDate(value)).toBeNull();
    }
  });
});
