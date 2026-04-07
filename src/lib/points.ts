/**
 * U Points loyalty system utilities.
 *
 * Points: 1 point per £1 spent (amounts < £1 earn nothing).
 * Vouchers: minimum 200 pts → £2.00 base, then +£0.50 per 50 pts above 200.
 */

export function calcPoints(totalSpent: number): number {
  if (totalSpent < 1) return 0;
  return Math.floor(totalSpent);
}

export function calcVoucherValue(points: number): number {
  const MINIMUM = 200;
  const INTERVAL = 50;
  const INTERVAL_VAL = 0.5;
  const BASE_VAL = 2.0;

  if (points < MINIMUM) return 0;

  const redeemable = points - MINIMUM;
  const chunks = Math.floor(redeemable / INTERVAL);
  return Math.round((BASE_VAL + chunks * INTERVAL_VAL) * 100) / 100;
}

export function nextVoucherPointsNeeded(points: number): number {
  const MINIMUM = 200;
  const INTERVAL = 50;

  if (points < MINIMUM) return MINIMUM - points;

  const remainder = (points - MINIMUM) % INTERVAL;
  return remainder === 0 ? 0 : INTERVAL - remainder;
}

/** Returns points consumed and remaining after a full redeem. */
export function redeemCalc(currentPoints: number): {
  voucherValue: number;
  pointsRedeemed: number;
  pointsRemaining: number;
} {
  const MINIMUM = 200;
  const INTERVAL = 50;

  if (currentPoints < MINIMUM) {
    return { voucherValue: 0, pointsRedeemed: 0, pointsRemaining: currentPoints };
  }

  const voucherValue = calcVoucherValue(currentPoints);
  const redeemable = currentPoints - MINIMUM;
  const chunks = Math.floor(redeemable / INTERVAL);
  const pointsRedeemed = MINIMUM + chunks * INTERVAL;
  const pointsRemaining = currentPoints - pointsRedeemed;

  return { voucherValue, pointsRedeemed, pointsRemaining };
}
