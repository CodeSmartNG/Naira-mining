// src/utils.js
export function toKobo(naira) {
  return Math.round(Number(naira) * 100);
}

export function nowPlusDays(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + Number(days));
  return d.toISOString(); // store as timestamptz
}