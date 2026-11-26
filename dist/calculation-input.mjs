import {OFFSET} from './engine.mjs';

export const inputKey = 'tithi-calculation';
export const methods = ['current', 'hourly', 'twelveMin', 'birth', 'age'];
export const needsBirth = method => method === 'birth' || method === 'age';

function instant(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value)) return NaN;
  const ms = Date.parse(value + 'Z');
  if (!Number.isFinite(ms) || !new Date(ms).toISOString().startsWith(value)) return NaN;
  const year = Number(value.slice(0,4));
  return year >= 1600 && year <= 2200 ? ms - OFFSET : NaN;
}

export function validateInput({when, method, birth}) {
  const ms = instant(when);
  if (!Number.isFinite(ms) || !methods.includes(method)) {
    throw new Error('စစ်ဆေးလိုသော ရက်စွဲ၊ အချိန်နဲ့ တွက်နည်းကို ရွေးပါ။');
  }
  const hasBirth = typeof birth === 'string' && birth.trim() !== '';
  const born = hasBirth ? instant(birth) : NaN;
  if (needsBirth(method) && (!Number.isFinite(born) || born > ms)) {
    throw new Error('စစ်ဆေးချိန်ထက် မနောက်ကျသော မွေးရက်နှင့် မွေးချိန်ကို ထည့်ပါ။');
  }
  if (hasBirth && (!Number.isFinite(born) || born > ms)) {
    throw new Error('စစ်ဆေးချိန်ထက် မနောက်ကျသော မွေးရက်နှင့် မွေးချိန်ကို ထည့်ပါ။');
  }
  return {ms, born};
}

export function savedInput() {
  try {
    return JSON.parse(sessionStorage.getItem(inputKey));
  } catch {
    return null;
  }
}
