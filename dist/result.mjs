import {litFraction, showMoon} from './moon.mjs?v=20261126b';
import {inputKey, savedInput, validateInput} from './calculation-input.mjs?v=20261126b';
import {
  HOUR, TWELVE_MIN, OFFSET, mm, groups, groupOf, days, names, directionStages, tithiLabel, tithiRemedies,
  specialTithiRules, readTithi, completedYears,
  buildHourlySchedule, buildTwelveMinSchedule, buildTwelveYearSchedule, findUpcomingSpecialTithis
} from './engine.mjs?v=20261126b';
import {table} from './table.mjs?v=20261126b';

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
const tithiName = t => `${tithiLabel(t.index)} · ${names[t.number]}`;
const colorPill = g => `<span class="tithi-pill tithi-${g.key}"><span class="swatch" aria-hidden="true"></span>${g.name} · ${g.color}</span>`;
const tithiCell = r => `<div class="tithi-cell"><strong>${r.tithiText}</strong>${colorPill(r.group)}</div>`;

function scheduleTable(headers, rows, highlightYuva = true) {
  const head = headers.map(h => `<th scope="col">${h}</th>`).join('');
  const body = rows.map(r => {
    const cls = r.active ? ' class="active-row"' : '';
    const cells = r.cells.map((c, idx) => {
      const colCls = highlightYuva && idx === 5 ? ' class="yuva-col"' : '';
      return `<td${colCls}>${c}</td>`;
    }).join('');
    return `<tr${cls}>${cells}</tr>`;
  }).join('');
  return `<div class="table-wrap schedule-wrap"><table class="schedule-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
}

function renderRemedyCard(title, tithiText, remedy) {
  const deityTag = remedy.deity ? ` <span class="deity-tag">(${remedy.deity})</span>` : '';
  return `
    <div class="mini remedy-card">
      <h3>${title} · ${tithiText}${deityTag}</h3>
      <dl class="remedy-grid">
        <div><dt>တိထီ အစီအရင်</dt><dd>${remedy.arrangement}</dd></div>
        <div><dt>တိထီ ယတြာ</dt><dd>${remedy.yadaya}</dd></div>
        <div class="remedy-benefit"><dt>အကျိုးကျေးဇူး</dt><dd>${remedy.benefit}</dd></div>
      </dl>
    </div>`;
}

function renderSpecialCard(specialTithis) {
  if (!specialTithis.length) return '';
  const items = specialTithis.map(rule => {
    const extra = rule.details ? `<div class="special-details">${rule.details.map(p => `<p>${p}</p>`).join('')}</div>` : '';
    return `
    <div class="special-hit special-${rule.key}">
      <strong>${rule.name}</strong>
      <p>${rule.note}</p>
      ${extra}
    </div>`;
  }).join('');
  return `<div class="mini special-card"><h3>တိုက်ဆိုင်သော အထူးတိထီ</h3><div class="special-list">${items}</div></div>`;
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
      tithiCell(r),
      ...r.directions.map(d => d.group.direction)
    ]
  }));
  return `
    <p class="basis">တိထိ စတင်ချိန်မှစ၍ ၁ နာရီပြည့် အပိုင်းပေါင်း ${mm(schedule.rows.length)} ပိုင်း (တစ်ပိုင်းလျှင် ၁ နာရီစီ အစဉ်လိုက် လှည့်တွက်ထားသည်)</p>
    ${scheduleTable(['အပိုင်း', 'အချိန်ကာလ', 'တိထိ နှင့် အရောင်', 'ဗာလ', 'ကုမာရ', 'ယုဝ', 'ဝုဒ္ဓ', 'မတ'], rows)}
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
      tithiCell(r),
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
    ${scheduleTable(['အပိုင်း', 'အချိန်ကာလ', 'တိထိ နှင့် အရောင်', 'ဗာလ', 'ကုမာရ', 'ယုဝ', 'ဝုဒ္ဓ', 'မတ'], rows)}
    ${renderRemainderNote(schedule.remainder, '၁၂ မိနစ်')}`;
}

function renderTwelveYearTab(born, ms) {
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
      tithiCell(r),
      ...r.directions.map(d => d.group.direction)
    ]
  }));
  return `
    <p class="basis">ဇာတိတိထိ · ${tithiName(schedule.natal)} (${groups[schedule.natal.group].name} · ${groups[schedule.natal.group].color}) · မွေးချိန် ${fmt(born)} · လက်ရှိအသက် ${mm(schedule.age)} နှစ်</p>
    ${scheduleTable(['သက်တမ်း', 'ရက်စွဲကာလ', 'တိထိ နှင့် အရောင်', 'ဗာလ', 'ကုမာရ', 'ယုဝ', 'ဝုဒ္ဓ', 'မတ'], rows)}`;
}

function renderSpecialTab(upcoming, filterKey) {
  const filtered = filterKey === 'all' ? upcoming : upcoming.filter(r => r.keys.includes(filterKey));
  const activeRule = specialTithiRules.find(r => r.key === filterKey);
  const noteText = activeRule
    ? `${activeRule.name} — ${activeRule.note}`
    : `စစ်ဆေးချိန်မှစ၍ လာမည့် ရက် ၁၈၀ အတွင်း ကျရောက်မည့် အထူးတိထီများ (${mm(upcoming.length)} ကြိမ်)`;
  const detailBox = activeRule?.details
    ? `<div class="special-hit special-${activeRule.key} special-box"><strong>${activeRule.name}</strong><div class="special-details">${activeRule.details.map(p => `<p>${p}</p>`).join('')}</div></div>`
    : '';
  const rowsHtml = filtered.map(r => {
    const badges = r.matched.map(m => `<span class="special-chip special-${m.key}">${m.short}</span>`).join(' ');
    return `<tr${r.active ? ' class="active-row"' : ''}>
      <td><strong>${fmtDate(r.start)}</strong> (${days[r.weekday]})${r.active ? ' <span class="badge">လက်ရှိ</span>' : ''}</td>
      <td>${fmtTime(r.start)} – ${fmtTime(r.end)}</td>
      <td>${tithiCell(r)}</td>
      <td><div class="chip-wrap">${badges}</div></td>
    </tr>`;
  }).join('');
  return `
    <div class="subbar">
      <p class="basis">${noteText}</p>
      <div class="seg seg-wrap" role="group" aria-label="အထူးတိထီ အမျိုးအစား">
        <button type="button" data-special-filter="all" class="${filterKey === 'all' ? 'is-on' : ''}">အားလုံး (${mm(upcoming.length)})</button>
        ${specialTithiRules.map(r => {
          const count = upcoming.filter(u => u.keys.includes(r.key)).length;
          return `<button type="button" data-special-filter="${r.key}" class="${filterKey === r.key ? 'is-on' : ''}">${r.short} (${mm(count)})</button>`;
        }).join('')}
      </div>
    </div>
    ${detailBox}
    ${filtered.length
      ? `<div class="table-wrap schedule-wrap"><table class="schedule-table remedy-table"><thead><tr><th scope="col">ရက်စွဲနှင့် နေ့</th><th scope="col">အချိန်ကာလ</th><th scope="col">တိထိ နှင့် အရောင်</th><th scope="col">အထူးတိထီ</th></tr></thead><tbody>${rowsHtml}</tbody></table></div>`
      : '<p class="basis">ရွေးချယ်ထားသော ကာလအတွင်း တိုက်ဆိုင်မှု မတွေ့ပါ။</p>'}`;
}

function renderRemedyTab(currentNumber) {
  const ordered = [...tithiRemedies.slice(1), tithiRemedies[0]];
  const rows = ordered.map(item => {
    const g = groups[groupOf(item.number)];
    const active = item.number === currentNumber;
    return {
      active,
      cells: [
        `<div class="tithi-cell"><strong>${item.label}${active ? ' <span class="badge">လက်ရှိ</span>' : ''}</strong>${colorPill(g)}</div>`,
        item.arrangement,
        item.yadaya,
        item.benefit,
        item.deity || '—'
      ]
    };
  });
  return `
    <p class="basis">တိထီ ၁ လုံးမှ ၁၄ လုံး၊ လပြည့်တိထီနှင့် လကွယ်တိထီအတွက် အစီအရင်၊ ယတြာနှင့် အကျိုးကျေးဇူးများ</p>
    <div class="table-wrap schedule-wrap"><table class="schedule-table remedy-table"><thead><tr><th scope="col">တိထီ</th><th scope="col">တိထီ အစီအရင်</th><th scope="col">တိထီ ယတြာ</th><th scope="col">အကျိုးကျေးဇူး</th><th scope="col">အုပ်စိုး</th></tr></thead><tbody>${rows.map(r => `<tr${r.active ? ' class="active-row"' : ''}>${r.cells.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
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
    const natal = Number.isFinite(born) ? readTithi(born) : null;
    const actual = groups[t.group];
    let base = t.group;
    let caption = 'ရောက်ဆဲ တိထိ · ' + tithiLabel(t.index) + ' (' + actual.name + ' · ' + actual.color + ')';
    let unusedNotice = '';

    if (method === 'hourly') {
      base = t.hourlyGroup;
      const slotStart = t.start + t.hour * HOUR;
      const slotEnd = Math.min(t.end, t.start + (t.hour + 1) * HOUR);
      caption = 'တိထီ ၁ နာရီပိုင်း · ' + tithiLabel(t.index + t.hour) + ' · ' + fmt(slotStart) + ' မှ ' + fmt(slotEnd) + ' အထိ';
      if (!t.hourlyFull) {
        unusedNotice = 'ဤအချိန်သည် တိထိအဆုံးပိုင်း ၁ နာရီ မပြည့်သော ကျန်ရှိချိန်ဖြစ်သဖြင့် ၁ နာရီပိုင်းစနစ်တွင် မသုံးပါ။';
      }
    } else if (method === 'twelveMin') {
      base = t.twelveMinGroup;
      const slotStart = t.start + t.twelveMin * TWELVE_MIN;
      const slotEnd = Math.min(t.end, t.start + (t.twelveMin + 1) * TWELVE_MIN);
      caption = 'တိထီ ၁၂ မိနစ်ပိုင်း · ' + tithiLabel(t.index + t.twelveMin) + ' · ' + fmt(slotStart) + ' မှ ' + fmt(slotEnd) + ' အထိ';
      if (!t.twelveMinFull) {
        unusedNotice = 'ဤအချိန်သည် တိထိအဆုံးပိုင်း ၁၂ မိနစ် မပြည့်သော ကျန်ရှိချိန်ဖြစ်သဖြင့် ၁၂ မိနစ်ပိုင်းစနစ်တွင် မသုံးပါ။';
      }
    } else if (method === 'birth' || method === 'age') {
      base = natal.group;
      caption = 'ဇာတိတိထိ · ' + tithiName(natal) + ' · ' + groups[base].name + ' (' + groups[base].color + ')';
      if (method === 'age') {
        const age = completedYears(born, ms);
        const period = Math.floor(age / 12);
        base = (base + period) % 5;
        caption += ' · အသက် ' + mm(age) + ' နှစ် · လက်ရှိ ၁၂ နှစ်ပိုင်း ' + tithiLabel(natal.index + period) + ' (' + groups[base].name + ')';
      }
    }

    const directions = directionStages(base);
    const hourlySchedule = buildHourlySchedule(t, ms);
    const twelveMinSchedule = buildTwelveMinSchedule(t, ms);
    let upcomingSpecial = null;
    let specialFilter = 'all';
    let activeTab = (method === 'age' || method === 'birth') ? 'twelveYear'
      : method === 'twelveMin' ? 'twelveMin'
      : 'hourly';
    let showAllTwelveMin = false;

    const natalRemedyHtml = natal && natal.number !== t.number
      ? renderRemedyCard('ဇာတိတိထိ ယတြာနှင့် အစီအရင်', tithiLabel(natal.index), natal.remedy)
      : '';

    byId('result').innerHTML = `
      <div class="lunar-result">
        <canvas id="moon-phase" width="192" height="192" aria-hidden="true"></canvas>
        <div>
          <p class="kicker">${days[t.weekday]} · ${fmt(ms)}</p>
          <h2>${tithiName(t)}</h2>
          <p class="moon-light">လမျက်နှာပြင် အလင်းရောင် ${mm((litFraction(t.angle) * 100).toFixed(1))}%</p>
          <div class="tags">${colorPill(actual)}<span>${actual.side} ခြေ</span></div>
        </div>
      </div>
      <dl class="times"><div><dt>တိထိ စတင်ချိန်</dt><dd>${fmt(t.start)}</dd></div><div><dt>တိထိ ပြီးဆုံးချိန်</dt><dd>${fmt(t.end)}</dd></div></dl>
      <h3>အဝတ္ထာန် အရပ်များ</h3><p class="basis">${caption}</p>
      ${unusedNotice ? `<p class="remainder-note is-active">${unusedNotice}</p>` : ''}
      ${table(['အဝတ္ထာန်', 'တိထိအုပ်စု / အရောင်', 'အရပ်', 'အကျိုးပေး'], directions.map(r => [r.stage, colorPill(r.group), r.group.direction, r.note]))}
      <div class="mini"><h3>တိုက်ဆိုင်သော ယုဂ်</h3><p>${t.yugs.map(y => y.name).join(' · ') || 'မရှိပါ။'}</p></div>
      ${renderSpecialCard(t.specialTithis)}
      ${renderRemedyCard('ရောက်ဆဲ တိထီ ယတြာနှင့် အစီအရင်', tithiLabel(t.index), t.remedy)}
      ${natalRemedyHtml}
      <section class="schedules" aria-label="အသင့်တွက်ပြီးသား တိထီပိုင်းဇယားများ">
        <h3>အသင့်တွက်ပြီးသား တိထီပိုင်းဇယားများ</h3>
        <div class="tabs" role="tablist">
          <button type="button" role="tab" data-tab="hourly" aria-selected="${activeTab === 'hourly'}">၁ နာရီပိုင်း (${mm(hourlySchedule.rows.length)})</button>
          <button type="button" role="tab" data-tab="twelveMin" aria-selected="${activeTab === 'twelveMin'}">၁၂ မိနစ်ပိုင်း (${mm(twelveMinSchedule.rows.length)})</button>
          <button type="button" role="tab" data-tab="twelveYear" aria-selected="${activeTab === 'twelveYear'}">၁၂ နှစ်ပိုင်း</button>
          <button type="button" role="tab" data-tab="special" aria-selected="${activeTab === 'special'}">အထူးတိထီများ</button>
          <button type="button" role="tab" data-tab="remedy" aria-selected="${activeTab === 'remedy'}">တိထီ ယတြာဇယား (၁၆)</button>
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
      } else if (activeTab === 'special') {
        upcomingSpecial ??= findUpcomingSpecialTithis(ms, 180);
        panel.innerHTML = renderSpecialTab(upcomingSpecial, specialFilter);
        panel.querySelectorAll('[data-special-filter]').forEach(btn => {
          btn.addEventListener('click', () => {
            specialFilter = btn.dataset.specialFilter;
            paintTab();
          });
        });
      } else if (activeTab === 'remedy') {
        panel.innerHTML = renderRemedyTab(t.number);
      } else {
        panel.innerHTML = renderTwelveYearTab(born, ms);
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
