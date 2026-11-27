import {MoonPhase, SearchMoonPhase} from './vendor/astronomy-engine.mjs';

export const MINUTE = 60000;
export const TWELVE_MIN = 12 * MINUTE;
export const HOUR = 3600000;
export const DAY = 24 * HOUR;
export const OFFSET = 6.5 * HOUR;
export const mm = value => String(value).replace(/[0-9]/g, digit => '၀၁၂၃၄၅၆၇၈၉'[digit]);
export const groups = [
  {key:'nanda', name:'နန္ဒာ', color:'အနီ', swatch:'#dc2626', side:'ဘယ်', direction:'အရှေ့', note:'စိတ်နှလုံး ကြည်လင်ရွှင်လန်းခြင်း၊ အဆောက်အအုံ စတင်တည်ဆောက်ခြင်း'},
  {key:'bhadra', name:'ဘဒြာ', color:'အဝါ', swatch:'#eab308', side:'ညာ', direction:'တောင်', note:'တင့်တယ်လှပခြင်း၊ ကုန်သွယ်ခြင်း၊ ဘွဲ့နှင့် ရာထူးပေးအပ်ခြင်း'},
  {key:'jaya', name:'ဇေယျာ', color:'မိုးပြာ', swatch:'#38bdf8', side:'ဘယ်', direction:'အနောက်', note:'အောင်မြင်ခြင်း၊ စူးစမ်းလေ့လာခြင်း၊ အသုံးအဆောင်ပစ္စည်း ပြုလုပ်ခြင်း'},
  {key:'rikta', name:'ရိတ္တာ', color:'အဖြူ', swatch:'#ffffff', side:'ညာ', direction:'မြောက်', note:'ကုန်ခန်းလျော့ပါးခြင်း၊ သမာဓိထူထောင်ခြင်း၊ သီလဆောက်တည်ခြင်း'},
  {key:'purna', name:'ပုဏ္ဏာ', color:'အနက်', swatch:'#111827', side:'ဘယ်', direction:'အရှေ့မြောက်', note:'ပြည့်စုံခြင်း၊ အတတ်ပညာ စတင်သင်ကြားခြင်း၊ ရေရှည်တည်တံ့စေလိုသော အမှုများ'}
];
export const stages = ['ဗာလ', 'ကုမာရ', 'ယုဝ', 'ဝုဒ္ဓ', 'မတ'];
export const stageNotes = [
  'ကလေးအဆင့် · ခွန်အားဖြည့်တင်းခြင်း၊ ခံစားမှုပြင်းထန်ခြင်း (အချိန်ကြာပါက ခေါင်းမာခြင်း၊ ဝေဖန်ဉာဏ်ကျဆင်းခြင်း ဖြစ်တတ်သဖြင့် သတိထားရန်)',
  'လူငယ်အဆင့် · ရွှင်လန်းတက်ကြွခြင်း၊ အကောင်းမြင်စိတ်နှင့် မှတ်ဉာဏ်ကောင်းခြင်း၊ စီးပွားဥစ္စာ တိုးတက်စေခြင်း၊ ပူးပေါင်းဆောင်ရွက်လိုစိတ် ဖြစ်ပေါ်စေခြင်း',
  'လူလတ်အဆင့် · ဘုန်းတန်ခိုးကြီးမားခြင်း၊ တည်ငြိမ်ရင့်ကျက်ခြင်း၊ ဝေဖန်ဆင်ခြင်ဉာဏ် ထက်မြက်ခြင်း၊ အောင်မြင်မှုနှင့် ဆုတောင်းပြည့်စုံခြင်း',
  'လူအိုအဆင့် · အင်အားဆုတ်ယုတ်ခြင်း၊ တွေဝေထိုင်းမှိုင်းခြင်း၊ စိတ်ပျံ့လွင့်ခြင်း၊ လက်လျှော့အရှုံးပေးလွယ်ခြင်း',
  'စက်ဝန်းဆုံးအဆင့် · အင်အားကုန်ခမ်းခြင်း၊ သတိမေ့လျော့ခြင်း၊ စွမ်းအားပျက်ပြယ်ခြင်း (အရေးကြီးကိစ္စများတွင် ရှောင်ကြဉ်ရန်)'
];
export const days = ['တနင်္ဂနွေ','တနင်္လာ','အင်္ဂါ','ဗုဒ္ဓဟူး','ကြာသပတေး','သောကြာ','စနေ'];
export const names = ['Amavasya','Prathama','Dwitiya','Tritiya','Chaturthi','Panchami','Shashti','Saptami','Ashtami','Navami','Dashami','Ekadashi','Dwadashi','Trayodashi','Chaturdashi','Poornima'];
export const tithiRemedies = [
  {number:0, label:'လကွယ်တိထီ', nature:'ဩဇဂုဏ် မပြည့်သေး၍ ကျန်ရစ်ခဲ့သူများမှာ ကျရာကံအလျောက် ဆက်လက်ခံစားပြီး စက်ဝန်းတစ်ပတ် အသစ်ပြန်စရန် ပြင်ဆင်သော အဆင့်။', arrangement:'အဆင်တန်ဆာ ပစ္စည်းများ', yadaya:'ကန်စွန်းဥကဲ့သို့ ဥအမျိုးမျိုး', benefit:'လွန်လေပြီးသော ဘိုးဘွားများ၏ ကောင်းကျိုးတယ်။', deity:''},
  {number:1, label:'တိထီ ၁ လုံး', nature:'အသက်ရှင်သန်မှု ဓာတ်အား၊ အညစ်အကြေးများကို ခွာချပြီး အင်အားကို အသစ်ပြန်ဖြစ်စေခြင်း။', arrangement:'ပန်း', yadaya:'နို့ထမင်း', benefit:'စီးပွားတက်စေသည်။', deity:'အဂ္ဂိ (မီးနတ်)'},
  {number:2, label:'တိထီ ၂ လုံး', nature:'ဖန်ဆင်းမှု စွမ်းအားစု၊ တိထိ ၁ လုံးမှ အင်အားကို ဆက်ခံယူပြီး ဖန်ဆင်းမှုနှင့် အကောင်အထည်ဖော်မှုကို လုပ်ဆောင်ခြင်း။', arrangement:'ဆန်', yadaya:'ထမင်းနှင့်ဒိန်ချဉ်', benefit:'သက်ရှည်ကျန်းမာသည်။', deity:'ဗြဟ္မာမင်း'},
  {number:3, label:'တိထီ ၃ လုံး', nature:'တက်ကြွရွှင်လန်းခြင်း၊ နုပျိုလန်းဆန်းခြင်း၊ ဖန်ဆင်းမှုများ သစ်လွင်တောက်ပနေသော အဆင့်။', arrangement:'ထောပတ်', yadaya:'အချိုမှုန့်', benefit:'ကျန်းမာရေးကောင်းသည်။', deity:'ဂေါရီ နတ်သမီး'},
  {number:4, label:'တိထီ ၄ လုံး', nature:'ဘဝပြောင်းလဲခြင်း၊ ကံနှင့် ကံ၏အကျိုးကို သိမြင်စေခြင်း (ယမမင်း) နှင့် စတင်ခြင်းအားလုံး ချောမွေ့ပြေပြစ်စေခြင်း (မဟာပိန္နဲနတ်)။', arrangement:'ဒိန်ချဉ်', yadaya:'ရေပြည့်အိုး', benefit:'ဆန္ဒပြည့်တယ်။', deity:'ယမမင်း နှင့် မဟာပိန္နဲနတ် (Ganesh)'},
  {number:5, label:'တိထီ ၅ လုံး', nature:'အဆိပ်အပုပ်များကို ရှင်းထုတ်သန့်စင်ခြင်း၊ သက်ရှည်ကျန်းမာရန် အရေခွံအသစ်လဲခြင်း၊ ဖန်ဆင်းနိုင်စွမ်းကို ထပ်ပြန်တလဲလဲ ဖြည့်တင်းသော အချိန်။', arrangement:'ထမင်း', yadaya:'ပဲစိမ်းလုံး', benefit:'စွဲဆောင်မှုကောင်းသည်။', deity:'မြွေ'},
  {number:6, label:'တိထီ ၆ လုံး', nature:'ရွှင်မြူးသွက်လက်ခြင်း၊ မိမိကိုယ်မိမိနှင့်တကွ အခြားသူများကိုပါ လွယ်ကူရွှင်လန်းစွာ ကာကွယ်စောင့်ရှောက်နိုင်စွမ်း ရှိခြင်း။', arrangement:'ရွှေစိမ်ထားသော ရေ', yadaya:'ထမင်းယို', benefit:'နောက်မျိုးဆက်သစ်ကောင်းသည်။', deity:'ကာရ်တိက နတ်သား (Kartik)'},
  {number:7, label:'တိထီ ၇ လုံး', nature:'ဘုန်းတန်ခိုး အင်အားကို အထူးဖြည့်ဆည်း၍ ပြည့်ဝခြင်း၊ အခြွေအရံများနှင့် တင့်တယ်ဟိတ်ဟန်ကောင်းစွာ အုပ်စိုးခြင်း (ပူလောင်သောသဘော အနည်းငယ်ရှိနိုင်သည်)။', arrangement:'ကြံသကာ / ထန်းလျက်', yadaya:'နှမ်း / နှမ်းနှင့်ပတ်သက်သော', benefit:'အကြွေးကျေသည်။', deity:'နေမင်း'},
  {number:8, label:'တိထီ ၈ လုံး', nature:'မိမိတည်ထောင်ထားသော လောက တည်မြဲတိုးပွားစေရန် ပြတ်သားရက်စက်သော ဆုံးဖြတ်ချက်များ ချမှတ်ရခြင်း (အပြင်မှာ ပြတ်သားပြပြီး ရင်ထဲ၌ ငိုကြွေးခံစားရတတ်သော သဘော)။', arrangement:'သံပုရာသီး', yadaya:'ပဲရာဇာ', benefit:'ရာဇဓါတ်ရသည်။', deity:'ရူဒြ'},
  {number:9, label:'တိထီ ၉ လုံး', nature:'ဝလင်အောင် ကျွေးမွေးစောင့်ရှောက်ခြင်း၊ ရန်စွယ်အန္တရာယ်များကို ဖယ်ရှားခြင်းတည်းဟူသော မိခင်မေတ္တာဓာတ်ကြီး။', arrangement:'ရေ', yadaya:'ဂျုံယို', benefit:'ပန်းနာရောဂါကင်းပြီး အဆုတ်အားကောင်းသည်။', deity:'အမ်ဘီကာ မယ်တော် (Ambika)'},
  {number:10, label:'တိထီ ၁၀ လုံး', nature:'တရားမျှတခြင်း၊ ဘက်မလိုက်ခြင်း၊ အမှန်တရားကို မြတ်နိုးခြင်း၊ တရားနှင့်အညီ ဆုံးမထိန်းကျောင်း ပဲ့ပြင်ပေးခြင်း။', arrangement:'ဂျုံမှုန့်နှင့် ဒိန်ချဉ် ရောနယ်', yadaya:'ဒိန်ချဉ်ထဲ ဂျုံမှုန့်အနည်းငယ်ထည့်', benefit:'ပီယအားကောင်း', deity:'ဓမ္မရာဇာ - ယမမင်း'},
  {number:11, label:'တိထီ ၁၁ လုံး', nature:'မိမိတည်ထောင်ဖန်ဆင်းထားသော လောကကို အေးချမ်းသာယာစွာ စီမံခန့်ခွဲအုပ်ချုပ်ခြင်း၊ တစ်ကိုယ်ရေ အေးချမ်းတည်ငြိမ်ခြင်း။', arrangement:'ဂျုံစေ့ / မုန့်ဆန်း', yadaya:'မုန့်စမ်း', benefit:'အကြောက်ကင်းတယ်။', deity:'Vishwanath (သျီဝ)'},
  {number:12, label:'တိထီ ၁၂ လုံး', nature:'တည်မြဲခြင်းကာလ၊ တည်မြဲတိုးပွားစေရန် လိုအပ်သလို ချိန်ခွင်လျှာညှိပေးနိုင်သော သတ္တိ။', arrangement:'နို့ထမင်း', yadaya:'မိမိအနှစ်သက်ဆုံးအစားအစာ', benefit:'အနှောင့်အယှက်ကင်းတယ်။', deity:'ဝိဿနိုး (Vishnu)'},
  {number:13, label:'တိထီ ၁၃ လုံး', nature:'နှစ်သက်ခြင်း၊ မွေ့လျော်ကြည်နူးခြင်း၊ ရလာသော အောင်မြင်မှုများအတွက် ဂုဏ်ယူကြည်နူးခြင်း (တပ်မက်မှုနှင့် မာန်တက်မှု စည်းမကျော်မိစေရန် သတိပြုရန်)။', arrangement:'ကြံသကာ / ထန်းလျက်', yadaya:'ဘာလီစေ့ကြော်', benefit:'ခွန်အားကောင်းတယ်', deity:'ကာမဒေဝ (Kamdev)'},
  {number:14, label:'တိထီ ၁၄ လုံး', nature:'မကောင်းသော စိတ်အညစ်အကြေးဟူသမျှကို သုတ်သင်ရှင်းလင်းခြင်း၊ တိထိစက်ဝန်းကြီးကို အလှပဆုံး နိဂုံးချုပ်နိုင်ရန် အညစ်အကြေးများ ခွာချရသော အဆင့်။', arrangement:'ကုံကုမံ', yadaya:'အသီး', benefit:'ပညာတိုးတယ်။', deity:'ကာလီမယ်တော်'},
  {number:15, label:'လပြည့်တိထီ', nature:'ဩဇဂုဏ်နှင့် အဆီအနှစ်၏ သဘော — အသက်ရှည်ခြင်း၊ အဆင်းလှခြင်း၊ ရောဂါကင်းခြင်း၊ နူးညံ့သိမ်မွေ့စေသော ဂုဏ်သတ္တိ ပြည့်ဝခြင်း။', arrangement:'ပဲဝါ', yadaya:'ပိန္နဲသီး', benefit:'မျက်စိရောဂါကင်းသည်။', deity:'လမင်းကြီး'}
];
export const garmentTithiEffects = [
  'မင်း၏ အစည်းအဝေးတွင် တင့်တယ်၏။ သူတကာတို့ ရှိခိုးခြင်း ခံရ၏',
  'အသက်ရှည်၏။ လာဘ်ရ၏။',
  'မယား ရအံ့။ ဥစ္စာ ရအံ့။',
  'လာဘ်ရအံ့ (မူကွဲ) အဝတ်သစ် ရအံ့။ သူတစ်ပါး နှိပ်စက်အံ့။',
  'အစာရေစာ များအံ့။',
  'အစာရေစာ မွတ်သိပ်အံ့။',
  'ဥစ္စာရအံ့။',
  'မီးလောင်အံ့။',
  'ဖျားနာအံ့။',
  'လာဘ်ရအံ့။',
  'စိတ်နှလုံး ပူဆာအံ့။',
  'ချမ်းသာအံ့။',
  'ဘေးသင့်အံ့။',
  'ချမ်းသာအံ့။',
  'ဖျားနာအံ့။',
  'ဖျားနာအံ့။',
  'သေအံ့။',
  'သူတစ်ပါး နှိပ်စက်အံ့။ အနာရောဂါ ရောက်အံ့။',
  'ဆွေမျိုးတို့တွင် မကောင်းကျိုး ဖြစ်အံ့။',
  'အဝတ်သစ် ရအံ့။ (မူကွဲ) ဆွေမျိုးများက ချစ်ကြအံ့။',
  'လာဘ်ရအံ့ (မူကွဲ) အပြစ် သင့်အံ့။',
  'ဥစ္စာ ရအံ့။',
  'ကျွန် ရအံ့ (မူကွဲ) ကျွန်ပြေးအံ့။',
  'မြတ်သော ဥစ္စာ ရအံ့။',
  'ထိုအဝတ်ကို ကြွက်ကိုက်အံ့ (မူကွဲ) ဆွေမျိုးများက ချစ်အံ့။',
  'သေအံ့ (မူကွဲ) အပြစ်ရအံ့ (မူကွဲ) လာဘ်ရ၏။',
  'ဥစ္စာ ရအံ့။',
  'ပျက်စီးအံ့။',
  'ထိတ်လန့် တုန်လှုပ်ရအံ့။',
  'ဥစ္စာ ရခြင်း၊ ချမ်းသာခြင်း၊ အလို ခပ်သိမ်း ပြည့်စုံခြင်း ရှိအံ့။'
];
export const specialTithiRules = [
  {
    key:'thousandfold',
    name:'ကောင်းမှုအကျိုး ထောင်ချီတိထီ',
    short:'ကောင်းမှု ထောင်ချီ',
    note:'မည့်သည့် ကောင်းမှုကို လုပ်သည်ဖြစ်စေ အကျိုးကျေးဇူးကို အဆပေါင်း ထောင်ချီ ပိုလွန်၍ ရသည်။',
    match:(weekday, group, number) =>
      (weekday === 1 && number === 0) ||
      (weekday === 0 && number === 7) ||
      (weekday === 2 && number === 4) ||
      (weekday === 3 && number === 8)
  },
  {
    key:'kuber',
    name:'Kuber / Ratnakar Tithi',
    short:'Kuber / Ratnakar',
    note:'တနင်္ဂနွေ·စနေ (ဇေယျာ)၊ တနင်္လာ (နန္ဒာ)၊ အင်္ဂါ (ရိတ္တာ)၊ ဗုဒ္ဓဟူး·သောကြာ (ပုဏ္ဏာ/လကွယ်)၊ ကြာသပတေး (ဘဒြာ)',
    match:(weekday, group) =>
      ((weekday === 0 || weekday === 6) && group === 2) ||
      (weekday === 1 && group === 0) ||
      (weekday === 2 && group === 3) ||
      ((weekday === 3 || weekday === 5) && group === 4) ||
      (weekday === 4 && group === 1)
  },
  {
    key:'akkhara',
    name:'အက္ခရာတိထီ',
    short:'အက္ခရာတိထီ',
    note:'တနင်္ဂနွေ (တိထီ ၇ လုံး)၊ တနင်္လာ (လကွယ်တိထီ)၊ အင်္ဂါ (တိထီ ၄ လုံး)၊ ကြာသပတေး (တိထီ ၈ လုံး)',
    details:[
      'အက္ခရာဆိုတာ ဘယ်တော့မှ မကုန်ခမ်းသော လို့ အဓိပ္ပာယ် ရပါတယ်။',
      'ဒီကာလမှာ ရွှေနည်းနည်းလေးပဲဖြစ်ဖြစ် ဝယ်ပြီး အိမ်ထဲသွင်းရင် အလွန်ချမ်းသာကြွယ်ဝစေပါတယ်။',
      'တစ်ကြိမ်လောက် ရွှေဝယ်သွင်းမိရုံနဲ့ တစ်နှစ်လောက် ငွေကြေးအပူသောက ကင်းတာကိုပဲ အထင်အရှား တွေ့ရပါတယ်။ သုံးလေးနှစ်ဆိုသလို ဆက်တိုက် ဝယ်မိရင်တော့ ကိုယ်လုပ်ချင်တာရှိလာတိုင်း ငွေအရံသင့် ဖြစ်လာတာကို အထင်အရှားတွေ့လာပါလိမ့်မယ်။ ဆယ်နှစ်ကျော်သွားရင် သေသည်အထိ ငွေကြေး ပြည့်စုံပါတယ်။',
      'စတိသဘောအနေနဲ့ ရွှေဆိုင်းဝယ်သွင်းလည်း ရပါတယ်။',
      'ရွှေဝယ်သွင်းခြင်း စီးပွါးလာဘ်လာဘတိုးတက်ဖို့ အတွက် သင့်လျော်သောအစီအရင်တွေ လုပ်နိုင်ပါတယ်။'
    ],
    match:(weekday, group, number) =>
      (weekday === 0 && number === 7) ||
      (weekday === 1 && number === 0) ||
      (weekday === 2 && number === 4) ||
      (weekday === 4 && number === 8)
  },
  {
    key:'chandi',
    name:'စန္ဒီမယ်တော် ပူဇော်ရန်နေ့',
    short:'စန္ဒီမယ်တော်',
    note:'စန္ဒီမယ်တော်ကို ပူဇော်ပါ · လပြည့်ကျော် တိထိ ၈ လုံး သို့မဟုတ် ၁၄ လုံး (အင်္ဂါနေ့ / စနေနေ့) တွင် စန္ဒီမယ်တော်ကို ပူဇော်ရင် အင်မတန် ကောင်းမြတ်သော အကျိုးကို ရပါသည်။',
    match:(weekday, group, number, index) =>
      (weekday === 2 || weekday === 6) && (index === 22 || index === 28)
  }
];
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
export const tithiLabel = index => {
  const i = ((index % 30) + 30) % 30;
  if (i === 14) return 'လပြည့် တိထိ ၁၅ လုံး';
  if (i === 29) return 'လကွယ် တိထိ';
  if (i < 14) return 'လဆန်း တိထိ ' + mm(i + 1) + ' လုံး';
  return 'လပြည့်ကျော် တိထိ ' + mm(i - 14) + ' လုံး';
};
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
  const specialTithis = specialTithiRules.filter(rule => rule.match(weekday, group, number, index));
  return {
    index, number, group, weekday, start, end, angle,
    hour, hourlyGroup: (group + hour) % 5, hourlyFull,
    twelveMin, twelveMinGroup: (group + twelveMin) % 5, twelveMinFull,
    waxing: index < 15,
    remedy: tithiRemedies[number],
    garmentEffect: garmentTithiEffects[index],
    specialTithis,
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
    const tithiIndex = (t.index + i) % 30;
    const groupIndex = (t.group + i) % 5;
    rows.push({
      index: i + 1,
      start,
      end,
      tithiIndex,
      tithiText: tithiLabel(tithiIndex),
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
    const tithiIndex = (t.index + i) % 30;
    const groupIndex = (t.group + i) % 5;
    rows.push({
      index: i + 1,
      hourIndex: Math.floor(i / 5),
      start,
      end,
      tithiIndex,
      tithiText: tithiLabel(tithiIndex),
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
    const tithiIndex = (natal.index + k) % 30;
    const groupIndex = (natal.group + k) % 5;
    rows.push({
      index: k + 1,
      startAge,
      endAge,
      startDate: addYears(bornMs, startAge),
      endDate: addYears(bornMs, endAge),
      tithiIndex,
      tithiText: tithiLabel(tithiIndex),
      groupIndex,
      group: groups[groupIndex],
      directions: directionStages(groupIndex),
      active: k === activeIndex
    });
  }
  return {natal, age, activeIndex, rows};
}

export function findUpcomingSpecialTithis(fromMs, daysAhead = 180) {
  const limitMs = fromMs + daysAhead * DAY;
  const rows = [];
  const startAngle = MoonPhase(new Date(fromMs));
  let index = Math.floor(startAngle / 12);
  let start = phaseBoundary(index, fromMs, false);
  while (start < limitMs) {
    const nextIndex = (index + 1) % 30;
    const end = phaseBoundary(nextIndex, start + 60000, true);
    const number = (index + 1) % 15 || (index === 29 ? 0 : 15);
    const groupIndex = groupOf(number);
    const firstDayLocal = Math.floor((start + OFFSET) / DAY) * DAY - OFFSET;
    for (let dayStart = firstDayLocal; dayStart < end; dayStart += DAY) {
      const dayEnd = dayStart + DAY;
      const overlapStart = Math.max(start, dayStart);
      const overlapEnd = Math.min(end, dayEnd);
      if (overlapEnd <= overlapStart || overlapEnd <= fromMs) continue;
      const weekday = new Date(dayStart + OFFSET).getUTCDay();
      const matched = specialTithiRules.filter(rule => rule.match(weekday, groupIndex, number, index));
      if (matched.length) {
        rows.push({
          start: overlapStart,
          end: overlapEnd,
          weekday,
          tithiIndex: index,
          tithiText: tithiLabel(index),
          group: groups[groupIndex],
          matched,
          keys: matched.map(r => r.key),
          active: fromMs >= overlapStart && fromMs < overlapEnd
        });
      }
    }
    index = nextIndex;
    start = end;
  }
  return rows;
}
