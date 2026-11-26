import {MoonPhase, SearchMoonPhase} from './vendor/astronomy-engine.mjs';

export const MINUTE = 60000;
export const TWELVE_MIN = 12 * MINUTE;
export const HOUR = 3600000;
export const OFFSET = 6.5 * HOUR;
export const mm = value => String(value).replace(/[0-9]/g, digit => '၀၁၂၃၄၅၆၇၈၉'[digit]);
export const groups = [
  {name:'နန္ဒာ', color:'အနီ', side:'ဘယ်', direction:'အရှေ့', note:'စိတ်နှလုံး ကြည်လင်ရွှင်လန်းခြင်း၊ အဆောက်အအုံ စတင်တည်ဆောက်ခြင်း'},
  {name:'ဘဒြာ', color:'အဝါ', side:'ညာ', direction:'တောင်', note:'တင့်တယ်လှပခြင်း၊ ကုန်သွယ်ခြင်း၊ ဘွဲ့နှင့် ရာထူးပေးအပ်ခြင်း'},
  {name:'ဇေယျာ', color:'အပြာ', side:'ဘယ်', direction:'အနောက်', note:'အောင်မြင်ခြင်း၊ စူးစမ်းလေ့လာခြင်း၊ အသုံးအဆောင်ပစ္စည်း ပြုလုပ်ခြင်း'},
  {name:'ရိတ္တာ', color:'အဖြူ', side:'ညာ', direction:'မြောက်', note:'ကုန်ခန်းလျော့ပါးခြင်း၊ သမာဓိထူထောင်ခြင်း၊ သီလဆောက်တည်ခြင်း'},
  {name:'ပုဏ္ဏာ', color:'အနက်', side:'ဘယ်', direction:'အရှေ့မြောက်', note:'ပြည့်စုံခြင်း၊ အတတ်ပညာ စတင်သင်ကြားခြင်း၊ ရေရှည်တည်တံ့စေလိုသော အမှုများ'}
];
export const stages = ['ဗာလ', 'ကုမာရ', 'ယုဝ', 'ဝုဒ္ဓ', 'မတာ'];
export const stageNotes = ['ကလေးအဆင့် · အားဖြည့်ခြင်း', 'လူငယ်အဆင့် · လန်းဆန်းတက်ကြွခြင်း', 'လူလတ်အဆင့် · ရင့်ကျက်တည်ငြိမ်ခြင်း', 'လူအိုအဆင့် · အားဆုတ်ခြင်း', 'စက်ဝန်းဆုံးအဆင့်'];
export const days = ['တနင်္ဂနွေ','တနင်္လာ','အင်္ဂါ','ဗုဒ္ဓဟူး','ကြာသပတေး','သောကြာ','စနေ'];
export const names = ['Amavasya','Prathama','Dwitiya','Tritiya','Chaturthi','Panchami','Shashti','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Poornima'];
export const yugRules = [
  {name:'သိဒ္ဓိယုဂ်', en:'Siddhi', page:41, groups:[[],[],[2],[1],[4],[0],[3]]},
  {name:'အမရိတယုဂ်', en:'Amrita', page:41, groups:[[4],[4],[1],[0],[2],[3],[0]]},
  {name:'မတယုဂ်', en:'Mrita', page:41, groups:[[0],[1],[0],[2],[3],[1],[4]]},
  {name:'လောင်ကျွမ်းသောယုဂ်', en:'Dakdha', page:42, numbers:[12,11,5,3,6,8,9]},
  {name:'ဝိသယုဂ်', en:'Visha', page:43, numbers:[4,6,7,2,8,9,7]},
  {name:'ယာဇ်မီးယုဂ်', en:'Hutasana', page:43, numbers:[12,6,7,8,9,10,11]},
  {name:'သံဝတ္တကယုဂ်', en:'Samvartaka', page:43, numbers:[7,null,null,1,null,null,null]},
  {name:'ဖြတ်တောက်သောယုဂ်', en:'Khrachaka', page:44, numbers:[12,11,10,9,8,7,6]}
];
export const groupOf = number => (number + 4) % 5;
export const directionStages = group => stages.map((stage,i) => ({
  stage, group:groups[(group+i)%5], note:stageNotes[i]
}));
function phaseBoundary(index, ms, forward) {
  const target = index * 12;
  const seed = new Date(ms + (forward ? -1000 : 1000));
  const estimate = +SearchMoonPhase(target, seed, forward ? 2 : -2).date;
  let before = estimate - 1000;
  let after = estimate + 1000;
  while (after - before > 1) {
    const midpoint = Math.floor((before + after) / 2);
    const phase = MoonPhase(new Date(midpoint));
    if ((phase - target + 360) % 360 < 180) after = midpoint;
    else before = midpoint;
  }
  return after;
}

export function readTithi(ms) {
  const angle = MoonPhase(new Date(ms));
  const index = Math.floor(angle / 12);
  const number = (index + 1) % 15 || (index === 29 ? 0 : 15);
  const start = phaseBoundary(index, ms, false);
  const end = phaseBoundary((index + 1) % 30, ms, true);
  const group = groupOf(number);
  const weekday = new Date(ms + OFFSET).getUTCDay();
  const hour = Math.max(0, Math.floor((ms - start) / HOUR));
  const twelveMin = Math.max(0, Math.floor((ms - start) / TWELVE_MIN));
  const hourlyFull = start + (hour + 1) * HOUR <= end;
  const twelveMinFull = start + (twelveMin + 1) * TWELVE_MIN <= end;
  return {
    number, group, weekday, start, end, angle,
    hour, hourlyGroup: (group + hour) % 5, hourlyFull,
    twelveMin, twelveMinGroup: (group + twelveMin) % 5, twelveMinFull,
    waxing: index < 15,
    yugs: yugRules.filter(rule => rule.groups?.[weekday].includes(group) || rule.numbers?.[weekday] === number)
  };
}

export function completedYears(birth, target) {
  const a = new Date(birth + OFFSET).toISOString();
  const b = new Date(target + OFFSET).toISOString();
  return Number(b.slice(0,4)) - Number(a.slice(0,4)) - (b.slice(5,19) < a.slice(5,19) ? 1 : 0);
}

export function addYears(ms, years) {
  const d = new Date(ms + OFFSET);
  const y = d.getUTCFullYear() + years;
  const m = d.getUTCMonth();
  const day = d.getUTCDate();
  const lastDay = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return Date.UTC(y, m, Math.min(day, lastDay), d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds()) - OFFSET;
}

export function buildHourlySchedule(t, currentMs) {
  const rows = [];
  let cursor = t.start;
  let i = 0;
  while (cursor + HOUR <= t.end) {
    const start = cursor;
    const end = cursor + HOUR;
    const groupIndex = (t.group + i) % 5;
    rows.push({
      index: i + 1,
      start,
      end,
      groupIndex,
      group: groups[groupIndex],
      directions: directionStages(groupIndex),
      active: currentMs >= start && currentMs < end
    });
    cursor = end;
    i++;
  }
  const remainder = cursor < t.end ? {
    start: cursor,
    end: t.end,
    minutes: Math.floor((t.end - cursor) / MINUTE),
    seconds: Math.round(((t.end - cursor) % MINUTE) / 1000),
    active: currentMs >= cursor && currentMs < t.end
  } : null;
  return {rows, remainder};
}

export function buildTwelveMinSchedule(t, currentMs) {
  const rows = [];
  let cursor = t.start;
  let i = 0;
  while (cursor + TWELVE_MIN <= t.end) {
    const start = cursor;
    const end = cursor + TWELVE_MIN;
    const groupIndex = (t.group + i) % 5;
    rows.push({
      index: i + 1,
      hourIndex: Math.floor(i / 5),
      start,
      end,
      groupIndex,
      group: groups[groupIndex],
      directions: directionStages(groupIndex),
      active: currentMs >= start && currentMs < end
    });
    cursor = end;
    i++;
  }
  const remainder = cursor < t.end ? {
    start: cursor,
    end: t.end,
    minutes: Math.floor((t.end - cursor) / MINUTE),
    seconds: Math.round(((t.end - cursor) % MINUTE) / 1000),
    active: currentMs >= cursor && currentMs < t.end
  } : null;
  return {rows, remainder};
}

export function buildTwelveYearSchedule(bornMs, targetMs, periods = 10) {
  const natal = readTithi(bornMs);
  const age = Math.max(0, completedYears(bornMs, targetMs));
  const activeIndex = Math.floor(age / 12);
  const total = Math.max(periods, activeIndex + 2);
  const rows = [];
  for (let k = 0; k < total; k++) {
    const startAge = k * 12;
    const endAge = (k + 1) * 12;
    const groupIndex = (natal.group + k) % 5;
    rows.push({
      index: k + 1,
      startAge,
      endAge,
      startDate: addYears(bornMs, startAge),
      endDate: addYears(bornMs, endAge),
      groupIndex,
      group: groups[groupIndex],
      directions: directionStages(groupIndex),
      active: k === activeIndex
    });
  }
  return {natal, age, activeIndex, rows};
}
