import {litFraction, showMoon} from './moon.mjs';
import {inputKey, savedInput, validateInput} from './calculation-input.mjs';
import {
  HOUR, TWELVE_MIN, OFFSET, mm, groups, days, names, directionStages,
  readTithi, completedYears, buildHourlySchedule, buildTwelveMinSchedule, buildTwelveYearSchedule
} from './engine.mjs';
import {table} from './table.mjs';

const byId = id => document.getElementById(id);
const isoMM = ms => new Date(ms + OFFSET).toISOString();
const fmt = ms => mm(isoMM(ms).slice(0, 19).replace('T', ' · '));
const fmtDate = ms => mm(isoMM(ms).slice(0, 10));
const fmtTime = ms => mm(isoMM(ms).slice(11, 19));
const fmtRange = (start, end) => {
  const sDate = isoMM(start).slice(0, 10);
  const eDate = isoMM(end).slice(0, 10);
  if (sDate === eDate) {
    return `${mm(sDate.slice(5))} · ${fmtTime(start)} – ${fmtTime(end)}`;
  }
  return `${mm(sDate.slice(5))} ${fmtTime(start)} – ${mm(eDate.slice(5))} ${fmtTime(end)}`;
};
const tithiName = t => (t.number === 0 ? 'လကွယ်' : t.number === 15 ? 'လပြည့်' : (t.waxing ? 'လဆန်း ' : 'လဆုတ် ') + mm(t.number)) + ' · ' + names[t.number];

function scheduleTable(headers, rows) {
  const head = headers.map(h => `<th scope="col">${h}</th>`).join('');
  const body = rows.map(r => {
    const cls = r.active ? ' class="active-row"' : '';
    const cells = r.cells.map((c, idx) => {
      const colCls = idx === 5 ? ' class="yuva-col"' : '';
      return `<td${colCls}>${c}</td>`;
    }).join('');
    return `<tr${cls}>${cells}</tr>`;
  }).join('');
  return `<div class="table-wrap schedule-wrap"><table class="schedule-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function renderRemainderNote(rem, unitLabel) {
  if (!rem) return '';
  const dur = rem.minutes > 0
    ? `${mm(rem.minutes)} မိနစ်${rem.seconds ? ' ' + mm(rem.seconds) + ' စက္ကန့်' : ''}`
    : `${mm(rem.seconds)} စက္ကန့်`;
  const activeTag = rem.active ? ' <span class="badge warn-badge">လက်ရှိအချိန် ကျရောက်နေသည်</span>' : '';
  return `<p class="remainder-note${rem.active ? ' is-active' : ''}">ကျန်ရှိချိန် (${unitLabel} မပြည့်သဖြင့် မသုံးပါ) · ${fmtRange(rem.start, rem.end)} (${dur})${activeTag}</p>`;
}

function renderHourlyTab(schedule) {
  const rows = schedule.rows.map(r => ({
    active: r.active,
    cells: [
      `${mm(r.index)}${r.active ? ' <span class="badge">လက်ရှိ</span>' : ''}`,
      fmtRange(r.start, r.end),
      `<strong>${r.group.name}</strong>`,
      ...r.directions.map(d => d.group.direction)
    ]
  }));
  return `
    <p class="basis">တိထိ စတင်ချိန်မှစ၍ ၁ နာရီပြည့် အပိုင်းပေါင်း ${mm(schedule.rows.length)} ပိုင်း (တစ်ပိုင်းလျှင် ၁ နာရီစီ အစဉ်လိုက် လှည့်တွက်ထားသည်)</p>
    ${scheduleTable(['အပိုင်း', 'အချိန်ကာလ', 'တိထိအုပ်စု', 'ဗာလ', 'ကုမာရ', 'ယုဝ', 'ဝုဒ္ဓ', 'မတာ'], rows)}
    ${renderRemainderNote(schedule.remainder, '၁ နာရီ')}`;
}

function renderTwelveMinTab(schedule, showAll, currentHourIndex) {
  const filtered = showAll
    ? schedule.rows
    : schedule.rows.filter(r => r.hourIndex === currentHourIndex);
  const displayRows = filtered.length ? filtered : schedule.rows.slice(0, 5);
  const rows = displayRows.map(r => ({
    active: r.active,
    cells: [
      `${mm(r.index)}${r.active ? ' <span class="badge">လက်ရှိ</span>' : ''}`,
      fmtRange(r.start, r.end),
      `<strong>${r.group.name}</strong>`,
      ...r.directions.map(d => d.group.direction)
    ]
  }));
  return `
    <div class="subbar">
      <p class="basis">တိထိ စတင်ချိန်မှစ၍ ၁၂ မိနစ်ပြည့် အပိုင်းပေါင်း ${mm(schedule.rows.length)} ပိုင်း (၅ ပိုင်း = ၁ နာရီ စက်ဝန်းပြည့်)</p>
      <div class="seg" role="group" aria-label="၁၂ မိနစ်ပိုင်း ပြသပုံ">
        <button type="button" data-min-scope="hour" class="${!showAll ? 'is-on' : ''}">လက်ရှိ ၁ နာရီ (${mm(displayRows.length === 5 && !showAll ? 5 : Math.min(5, schedule.rows.length))} ပိုင်း)</button>
        <button type="button" data-min-scope="all" class="${showAll ? 'is-on' : ''}">တိထိတစ်ခုလုံး (${mm(schedule.rows.length)} ပိုင်း)</button>
      </div>
    </div>
    ${scheduleTable(['အပိုင်း', 'အချိန်ကာလ', 'တိထိအုပ်စု', 'ဗာလ', 'ကုမာရ', 'ယုဝ', 'ဝုဒ္ဓ', 'မတာ'], rows)}
    ${renderRemainderNote(schedule.remainder, '၁၂ မိနစ်')}`;
}

function renderTwelveYearTab(born, ms, input) {
  if (!Number.isFinite(born)) {
    return `
      <div class="birth-prompt">
        <p class="basis">တိထီ ၁၂ နှစ်ပိုင်း ဇယားကို ကြည့်ရှုရန် မွေးရက်နှင့် မွေးချိန်ကို ထည့်သွင်းပါ။</p>
        <form id="inline-birth-form" class="inline-birth-form">
          <label>မွေးရက်နှင့် မွေးချိန်<input id="inline-birth" type="datetime-local" min="1600-01-01T00:00" max="2200-12-31T23:59:59" step="1" required></label>
          <button type="submit" class="primary">၁၂ နှစ်ပိုင်း တွက်မည်</button>
        </form>
        <p id="inline-birth-error" role="alert" hidden></p>
      </div>`;
  }
  const schedule = buildTwelveYearSchedule(born, ms);
  const rows = schedule.rows.map(r => ({
    active: r.active,
    cells: [
      `${mm(r.startAge)} – ${mm(r.endAge)} နှစ်${r.active ? ' <span class="badge">လက်ရှိ</span>' : ''}`,
      `${fmtDate(r.startDate)} – ${fmtDate(r.endDate)}`,
      `<strong>${r.group.name}</strong>`,
      ...r.directions.map(d => d.group.direction)
    ]
  }));
  return `
    <p class="basis">ဇာတိတိထိ · ${tithiName(schedule.natal)} (${groups[schedule.natal.group].name}) · မွေးချိန် ${fmt(born)} · လက်ရှိအသက် ${mm(schedule.age)} နှစ်</p>
    ${scheduleTable(['သက်တမ်း', 'ရက်စွဲကာလ', 'တိထိအုပ်စု', 'ဗာလ', 'ကုမာရ', 'ယုဝ', 'ဝုဒ္ဓ', 'မတာ'], rows)}`;
}

function calculate() {
  const input = savedInput();
  if (!input) {
    byId('result').textContent = 'တွက်ချက်လိုသည့် ရက်စွဲနှင့် အချိန်ကို ဖောင်တွင် ထည့်ပါ။';
    return;
  }
  try {
    const {ms, born} = validateInput(input);
    const {method} = input;
    const t = readTithi(ms);
    const actual = groups[t.group];
    let base = t.group;
    let caption = 'ရောက်ဆဲ တိထိ · ' + actual.name;
    let unusedNotice = '';

    if (method === 'hourly') {
      base = t.hourlyGroup;
      const slotStart = t.start + t.hour * HOUR;
      const slotEnd = Math.min(t.end, t.start + (t.hour + 1) * HOUR);
      caption = 'တိထီ ၁ နာရီပိုင်း · ' + fmt(slotStart) + ' မှ ' + fmt(slotEnd) + ' အထိ';
      if (!t.hourlyFull) {
        unusedNotice = 'ဤအချိန်သည် တိထိအဆုံးပိုင်း ၁ နာရီ မပြည့်သော ကျန်ရှိချိန်ဖြစ်သဖြင့် ၁ နာရီပိုင်းစနစ်တွင် မသုံးပါ။';
      }
    } else if (method === 'twelveMin') {
      base = t.twelveMinGroup;
      const slotStart = t.start + t.twelveMin * TWELVE_MIN;
      const slotEnd = Math.min(t.end, t.start + (t.twelveMin + 1) * TWELVE_MIN);
      caption = 'တိထီ ၁၂ မိနစ်ပိုင်း · ' + fmt(slotStart) + ' မှ ' + fmt(slotEnd) + ' အထိ';
      if (!t.twelveMinFull) {
        unusedNotice = 'ဤအချိန်သည် တိထိအဆုံးပိုင်း ၁၂ မိနစ် မပြည့်သော ကျန်ရှိချိန်ဖြစ်သဖြင့် ၁၂ မိနစ်ပိုင်းစနစ်တွင် မသုံးပါ။';
      }
    } else if (method === 'birth' || method === 'age') {
      const natal = readTithi(born);
      base = natal.group;
      caption = 'ဇာတိတိထိ · ' + tithiName(natal) + ' · ' + groups[base].name;
      if (method === 'age') {
        const age = completedYears(born, ms);
        base = (base + Math.floor(age / 12)) % 5;
        caption += ' · အသက် ' + mm(age) + ' နှစ် · လက်ရှိ ၁၂ နှစ်ပိုင်း ' + groups[base].name;
      }
    }

    const directions = directionStages(base);
    const hourlySchedule = buildHourlySchedule(t, ms);
    const twelveMinSchedule = buildTwelveMinSchedule(t, ms);
    let activeTab = (method === 'age' || method === 'birth') ? 'twelveYear'
      : method === 'twelveMin' ? 'twelveMin'
      : 'hourly';
    let showAllTwelveMin = false;

    byId('result').innerHTML = `
      <div class="lunar-result">
        <canvas id="moon-phase" width="192" height="192" aria-hidden="true"></canvas>
        <div>
          <p class="kicker">${days[t.weekday]} · ${fmt(ms)}</p>
          <h2>${tithiName(t)}</h2>
          <p class="moon-light">လမျက်နှာပြင် အလင်းရောင် ${mm((litFraction(t.angle) * 100).toFixed(1))}%</p>
          <div class="tags"><span>${actual.name} တိထိ</span><span>${actual.color}</span><span>${actual.side} ခြေ</span></div>
        </div>
      </div>
      <dl class="times"><div><dt>တိထိ စတင်ချိန်</dt><dd>${fmt(t.start)}</dd></div><div><dt>တိထိ ပြီးဆုံးချိန်</dt><dd>${fmt(t.end)}</dd></div></dl>
      <h3>အဝတ္ထာန် အရပ်များ</h3><p class="basis">${caption}</p>
      ${unusedNotice ? `<p class="remainder-note is-active">${unusedNotice}</p>` : ''}
      ${table(['အဝတ္ထာန်', 'အရပ်'], directions.map(r => [r.stage, r.group.direction]))}
      <div class="mini"><h3>တိုက်ဆိုင်သော ယုဂ်</h3><p>${t.yugs.map(y => y.name).join(' · ') || 'မရှိပါ။'}</p></div>
      <section class="schedules" aria-label="အသင့်တွက်ပြီးသား တိထီပိုင်းဇယားများ">
        <h3>အသင့်တွက်ပြီးသား တိထီပိုင်းဇယားများ</h3>
        <div class="tabs" role="tablist">
          <button type="button" role="tab" data-tab="hourly" aria-selected="${activeTab === 'hourly'}">၁ နာရီပိုင်း (${mm(hourlySchedule.rows.length)})</button>
          <button type="button" role="tab" data-tab="twelveMin" aria-selected="${activeTab === 'twelveMin'}">၁၂ မိနစ်ပိုင်း (${mm(twelveMinSchedule.rows.length)})</button>
          <button type="button" role="tab" data-tab="twelveYear" aria-selected="${activeTab === 'twelveYear'}">၁၂ နှစ်ပိုင်း</button>
        </div>
        <div id="schedule-panel" class="schedule-panel" role="tabpanel"></div>
      </section>`;

    const panel = byId('schedule-panel');
    const tabButtons = Array.from(document.querySelectorAll('.tabs [role="tab"]'));

    function paintTab() {
      tabButtons.forEach(btn => {
        const selected = btn.dataset.tab === activeTab;
        btn.setAttribute('aria-selected', String(selected));
      });
      if (activeTab === 'hourly') {
        panel.innerHTML = renderHourlyTab(hourlySchedule);
      } else if (activeTab === 'twelveMin') {
        panel.innerHTML = renderTwelveMinTab(twelveMinSchedule, showAllTwelveMin, t.hour);
        panel.querySelectorAll('[data-min-scope]').forEach(btn => {
          btn.addEventListener('click', () => {
            showAllTwelveMin = btn.dataset.minScope === 'all';
            paintTab();
          });
        });
      } else {
        panel.innerHTML = renderTwelveYearTab(born, ms, input);
        const inlineForm = byId('inline-birth-form');
        if (inlineForm) {
          inlineForm.addEventListener('submit', event => {
            event.preventDefault();
            const birthVal = byId('inline-birth').value;
            const errEl = byId('inline-birth-error');
            errEl.hidden = true;
            try {
              const updated = {...input, birth: birthVal};
              validateInput(updated);
              sessionStorage.setItem(inputKey, JSON.stringify(updated));
              calculate();
            } catch (failure) {
              errEl.textContent = failure.message;
              errEl.hidden = false;
            }
          });
        }
      }
    }

    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        paintTab();
      });
    });

    paintTab();

    const previous = sessionStorage.getItem('tithi-moon-angle');
    sessionStorage.setItem('tithi-moon-angle', String(t.angle));
    void showMoon(byId('moon-phase'), t.angle, previous === null ? t.angle : Number(previous));
  } catch {
    byId('result').textContent = 'ရက်စွဲနှင့် အချိန်ကို ပြင်ပြီး ပြန်တွက်ပါ။';
  }
}
calculate();
