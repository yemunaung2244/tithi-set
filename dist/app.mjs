import {notesPages, notesContents} from './notes.mjs';
import {litFraction, showMoon} from './moon.mjs';
import {transcript} from './transcript.mjs';
import {HOUR, OFFSET, mm, groups, stages, days, names, groupOf, directionStages, readTithi, completedYears, yugRules} from './engine.mjs';
const byId = id => document.getElementById(id);
const when = byId('when');
const birth = byId('birth');
const method = byId('method');
const page = byId('page');
const fmt = ms => mm(new Date(ms+OFFSET).toISOString().slice(0,19).replace('T',' · '));
const inputDate = ms => new Date(ms+OFFSET).toISOString().slice(0,19);
const instant = value => Date.parse(value+'+06:30');
const table = (headers, rows) => '<div class="table-wrap"><table><thead><tr>'+headers.map(h=>'<th scope="col">'+h+'</th>').join('')+'</tr></thead><tbody>'+rows.map(row=>'<tr>'+row.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
const pageLink = (number, label=mm(number), book='lessons') => '<a href="#reader" data-book="'+book+'" data-page="'+number+'">'+label+'</a>';
const tithiName = t => (t.number===0 ? 'လကွယ်' : t.number===15 ? 'လပြည့်' : (t.waxing?'လဆန်း ':'လဆုတ် ')+mm(t.number))+' · '+names[t.number];

const numberNotes = [
  'စက်ဝန်းတစ်ပတ် ပြန်စခြင်းနှင့် ဆက်ခံခြင်း',
  'သန့်စင်၍ အသစ်ပြန်စခြင်း',
  'ဖန်တီးစွမ်းအားကို ပုံသဏ္ဌာန် ဖော်ဆောင်ခြင်း',
  'ရှင်လန်းနုပျို၍ ကြီးထွားခြင်း',
  'အဆင့်တစ်ခု အဆုံးသတ်ပြီး အခြေအနေသစ်သို့ ကူးပြောင်းခြင်း',
  'မလိုအပ်သောအရာများကို ဖယ်ရှားသန့်စင်ခြင်း',
  'မိမိနှင့် အခြားသူများကို ကာကွယ်စောင့်ရှောက်ခြင်း',
  'စွမ်းအားနှင့် ဂုဏ်အင် တိုးပွားခြင်း',
  'ခက်ခဲသော ဆုံးဖြတ်ချက်ချခြင်းနှင့် နက်နက်ရှိုင်းရှိုင်း ရှာဖွေခြင်း',
  'ကျွေးမွေးစောင့်ရှောက်ခြင်းနှင့် ရန်စွယ်ဖယ်ရှားခြင်း',
  'စည်းကမ်း၊ တရားမျှတမှုနှင့် ထိန်းကျောင်းခြင်း',
  'ဖန်တီးထားသည့်အရာကို မိမိကိုယ်တိုင် စီမံအုပ်ချုပ်ခြင်း',
  'တည်မြဲစေရန်နှင့် ကြီးထွားစေရန် အချိန်အလိုက် ညှိယူခြင်း',
  'နှစ်သက်ခြင်းနှင့် အောင်မြင်မှုကို ဂုဏ်ယူခံစားခြင်း',
  'စက်ဝန်း မပြည့်မီ ကျန်ရှိသည့်အရာများကို ရှင်းလင်းခြင်း',
  'ပြည့်စုံမှုနှင့် စက်ဝန်း၏ အနှစ်သာရ'
];

function calculate() {
  const error = byId('error');
  error.hidden = true;
  try {
    const ms = instant(when.value);
    if (!Number.isFinite(ms)) throw Error('စစ်ဆေးလိုသော ရက်စွဲနှင့် အချိန်ကို ရွေးပါ။');
    const t = readTithi(ms);
    const actual = groups[t.group];
    let base = t.group;
    let caption = 'ရောက်ဆဲ တိထိ · '+actual.name;
    if (method.value==='hourly') {
      base = t.hourlyGroup;
      caption = 'တစ်နာရီစီ · '+fmt(t.start+t.hour*HOUR)+' မှ '+fmt(Math.min(t.end,t.start+(t.hour+1)*HOUR))+' အထိ';
    }
    if (method.value==='birth' || method.value==='age') {
      const born = instant(birth.value);
      if (!Number.isFinite(born) || born>ms) throw Error('စစ်ဆေးချိန်ထက် စောသော မွေးရက်နှင့် မွေးချိန်ကို ထည့်ပါ။');
      const natal = readTithi(born);
      base = natal.group;
      caption = 'ဇာတိတိထိ · '+tithiName(natal)+' · '+groups[base].name;
      if (method.value==='age') {
        const age = completedYears(born,ms);
        base = (base+Math.floor(age/12))%5;
        caption += ' · အသက် '+mm(age)+' နှစ် · လက်ရှိသက်တမ်း '+groups[base].name;
      }
    }
    const directions = directionStages(base);
    byId('result').innerHTML = `
      <div class="lunar-result">
        <canvas id="moon-phase" width="192" height="192" aria-hidden="true"></canvas>
        <div>
          <p class="kicker">${days[t.weekday]} · ${fmt(ms)}</p>
          <h2>${tithiName(t)}</h2>
          <p class="moon-light">လမျက်နှာပြင် အလင်းရောင် ${mm((litFraction(t.angle)*100).toFixed(1))}%</p>
          <div class="tags"><span>${actual.name} တိထိ</span><span>${actual.color}</span><span>${actual.side} ခြေ</span></div>
        </div>
      </div>
      <dl class="times"><div><dt>တိထိ စတင်ချိန်</dt><dd>${fmt(t.start)}</dd></div><div><dt>တိထိ ပြီးဆုံးချိန်</dt><dd>${fmt(t.end)}</dd></div></dl>
      <h3>အဝတ္ထာန် အရပ်များ</h3><p class="basis">${caption}</p>
      ${table(['အဝတ္ထာန်','အရပ်','ကျမ်းဖော်ပြချက်'],directions.map(r=>[r.stage,r.group.direction,r.note]))}
      <div class="mini"><h3>တိထိနှင့် ယုဂ်</h3><p>${t.yugs.length?t.yugs.map(y=>pageLink(y.page,y.name)).join(' · '):'ကျမ်းပါ စည်းမျဉ်းများနှင့် တိုက်ဆိုင်သော ယုဂ် မရှိပါ။'}</p></div>
      <div class="mini"><h3>${actual.name} တိထိ၏ ရိုးရာဖော်ပြချက်</h3><p>${actual.note} · ${pageLink(39,'ကျမ်းကို ဖတ်ပါ')}</p></div>
      <div class="mini"><h3>တိထိလုံးအလိုက် ကျမ်းဖော်ပြချက်</h3><p>${numberNotes[t.number]} · ${pageLink(t.number===1?45:t.number>=2&&t.number<=5?46:t.number>=6&&t.number<=11?47:48,'ကျမ်းကို ဖတ်ပါ')}</p></div>`;
    void showMoon(byId('moon-phase'), t.angle);
  } catch (failure) {
    byId('result').textContent = 'ရက်စွဲနှင့် အချိန်ကို ပြင်ပြီး ပြန်တွက်ပါ။';
    error.textContent = failure instanceof TypeError ? 'ရွေးထားသည့် အချိန်အတွက် တွက်ချက်မှု မပြီးဆုံးနိုင်ပါ။' : failure.message;
    error.hidden = false;
  }
}
function updateMethod() {
  birth.required = ['age','birth'].includes(method.value);
  byId('birth-field').hidden = !birth.required;
}
byId('form').addEventListener('submit',event=>{event.preventDefault();calculate();});
method.addEventListener('change',()=>{updateMethod();if(byId('form').checkValidity()) calculate();});
byId('now').addEventListener('click',()=>{when.value=inputDate(Date.now());if(byId('form').reportValidity()) calculate();});
byId('group-table').innerHTML = table(['အုပ်စု','တိထိလုံး','အရပ်','ခြေ','အရောင်'],groups.map((g,i)=>[g.name,i===4?'၀၊ ၅၊ ၁၀၊ ၁၅':mm(i+1)+'၊ '+mm(i+6)+'၊ '+mm(i+11),g.direction,g.side,g.color]));
byId('number-table').innerHTML = table(['တိထိလုံး','အမည်','အုပ်စု'],names.map((n,i)=>[mm(i),n,groups[groupOf(i)].name]));
byId('yug-table').innerHTML = table(['ယုဂ်','နေ့နှင့် တိထိ','စာမျက်နှာ'],yugRules.map(y=>[y.name+' · '+y.en,days.map((day,i)=>{
  const match=y.groups?.[i].map(index=>groups[index].name).join('၊ ') ?? (y.numbers[i]===null?'':mm(y.numbers[i]));
  return match?day+' '+match:'';
}).filter(Boolean).join(' · '),pageLink(y.page)]));
const book = byId('book');
const readerSources = {
  lessons: {
    pages: transcript,
    first: 19,
    last: 53,
    note: 'စာမျက်နှာ ၁၉ မှ ၅၃ အထိ ပုံမှ စာသားဖတ်ယူထားသော မူကြမ်းဖြစ်၍ စာလုံးနှင့် စာကြောင်းအချို့ လွဲနိုင်ပါသည်။',
    links: [[19,'တိထိအုပ်စု'],[27,'အဝတ္ထာန်'],[39,'တိထိနှင့် ယုဂ်'],[45,'တိထိလုံးရေ'],[51,'အနုစိတ်တွက်နည်း']]
  },
  notes: {
    pages: notesPages,
    first: 0,
    last: 48,
    note: 'မင်းနိုင်၏ တိထီစက်မှတ်စု။ PDF မှ စာသားဖတ်ယူထားသောကြောင့် စာလုံးနှင့် စာကြောင်းအချို့ လွဲနိုင်ပါသည်။',
    links: [[0,'မျက်နှာဖုံး'],[1,'မာတိကာ'],[10,'မွမ်းမံအဆင့်'],[14,'တိထီနှင့် ဘုန်းတန်ခိုး'],[32,'တွက်နည်းနမူနာ'],[37,'ခယတိထီ'],[44,'ကလိယုဂ်']]
  }
};
let currentBook;

function selectBook(key, number=readerSources[key].first) {
  const source = readerSources[key];
  if (currentBook !== key) {
    currentBook = key;
    book.value = key;
    const options = Object.keys(source.pages).map(Number).map(n=>new Option(n===0?'မျက်နှာဖုံး':mm(n),n));
    page.replaceChildren(...options);
    byId('reader-note').textContent = source.note;
    byId('chapters').innerHTML = source.links.map(([n,label])=>pageLink(n,label,key)).join('');
  }
  showPage(number);
}

const sourceNames = ['အမာဝသီ','ပထမ','ဒုတိယ','တတိယ','စတုတ္ထ','ပဉ္စမ','ဆဋ္ဌမ','သတ္တမ','အဋ္ဌမ','နဝမ','ဒသမီ','ဧကာဒသီ','ဒွါဒသီ','တိယောဒသီ','စတုဒ္ဒသီ','ပုဏ္ဏမီ'];

function showPage(number) {
  page.value=number;
  const source = readerSources[currentBook];
  const entry = source.pages[number];
  const article = byId('transcript');
  const heading = document.createElement('h3');
  heading.textContent = entry.heading || 'စာမျက်နှာ ' + mm(number);
  const prose = document.createElement('div');
  prose.className = 'transcript-text';
  prose.textContent = entry.text;
  article.replaceChildren(heading, prose);
  if (currentBook === 'notes' && (number === 1 || number === 2)) {
    const contents = document.createElement('div');
    const rows = notesContents[number].map(([title, target])=>[pageLink(target,title,'notes'),mm(target)]);
    contents.innerHTML = table(['အကြောင်းအရာ','စာမျက်နှာ'], rows);
    article.append(contents);
  }
  if (currentBook === 'lessons' && number === 26) {
    const sourceTable = document.createElement('div');
    sourceTable.innerHTML = table(['လုံးရေ','Tithi','တိထိအမည်','တိထိအုပ်စု','အရပ်မျက်နှာ'], names.map((name, i) => {
      const group = groups[groupOf(i)];
      return [mm(i), name, sourceNames[i], group.name, groupOf(i) === 4 ? 'ထောင့်၊ အထက်၊ အောက်အရပ်' : group.direction];
    }));
    article.append(sourceTable);
  }
  byId('prev').disabled = number === source.first;
  byId('next').disabled = number === source.last;
}
book.addEventListener('change',()=>selectBook(book.value));
page.addEventListener('change',()=>showPage(Number(page.value)));
byId('prev').addEventListener('click',()=>showPage(Number(page.value)-1));
byId('next').addEventListener('click',()=>showPage(Number(page.value)+1));
document.addEventListener('click',event=>{
  const link=event.target.closest('[data-page]');
  if(link) selectBook(link.dataset.book,Number(link.dataset.page));
});
when.value=inputDate(Date.now());
const linkedBook = new URLSearchParams(location.search).get('book');
selectBook(linkedBook === 'notes' ? 'notes' : 'lessons');
updateMethod();
calculate();
