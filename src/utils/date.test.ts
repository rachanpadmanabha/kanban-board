import { describe, expect, it } from 'vitest';
import { describeDueDate, isOverdue, timeAgo } from './date';

const NOON = new Date('2026-07-29T12:00:00').getTime();

describe('timeAgo', () => {
  it('returns an empty string for missing or unparseable input', () => {
    expect(timeAgo(undefined, NOON)).toBe('');
    expect(timeAgo('not-a-date', NOON)).toBe('');
  });

  it('scales the unit with the elapsed time', () => {
    expect(timeAgo(new Date(NOON - 30_000).toISOString(), NOON)).toBe('just now');
    expect(timeAgo(new Date(NOON - 5 * 60_000).toISOString(), NOON)).toBe('5m ago');
    expect(timeAgo(new Date(NOON - 3 * 3_600_000).toISOString(), NOON)).toBe('3h ago');
    expect(timeAgo(new Date(NOON - 2 * 86_400_000).toISOString(), NOON)).toBe('2d ago');
    expect(timeAgo(new Date(NOON - 65 * 86_400_000).toISOString(), NOON)).toBe('2mo ago');
  });
});

describe('describeDueDate', () => {
  it('compares calendar days, not elapsed hours', () => {
    // Same calendar day but earlier than `now` — still "due today", not overdue.
    expect(describeDueDate('2026-07-29', NOON)).toMatchObject({
      label: 'Due today',
      overdue: false,
    });
  });

  it('labels upcoming dates', () => {
    expect(describeDueDate('2026-07-30', NOON)?.label).toBe('Due tomorrow');
    expect(describeDueDate('2026-08-02', NOON)?.label).toBe('Due in 4 days');
  });

  it('falls back to an absolute date beyond a week out', () => {
    expect(describeDueDate('2026-09-15', NOON)?.label).toMatch(/^Due /);
    expect(describeDueDate('2026-09-15', NOON)?.overdue).toBe(false);
  });

  it('singularises a one-day overdue task', () => {
    expect(describeDueDate('2026-07-28', NOON)).toMatchObject({
      label: 'Overdue by 1 day',
      overdue: true,
    });
    expect(describeDueDate('2026-07-26', NOON)?.label).toBe('Overdue by 3 days');
  });

  it('returns null when there is no due date', () => {
    expect(describeDueDate(undefined, NOON)).toBeNull();
  });
});

describe('isOverdue', () => {
  it('is false for today and true only once the day has passed', () => {
    expect(isOverdue('2026-07-29', NOON)).toBe(false);
    expect(isOverdue('2026-07-28', NOON)).toBe(true);
    expect(isOverdue(undefined, NOON)).toBe(false);
  });
});
