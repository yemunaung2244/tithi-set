import {inputKey, methods, needsBirth, savedInput, validateInput} from './calculation-input.mjs';
import {OFFSET} from './engine.mjs';
const byId = id => document.getElementById(id);
const when = byId('when');
const birth = byId('birth');
const method = byId('method');
const birthHint = byId('birth-hint');
const inputDate = ms => new Date(ms+OFFSET).toISOString().slice(0,19);

function updateMethod() {
  const required = needsBirth(method.value);
  birth.required = required;
  if (birthHint) {
    birthHint.textContent = required ? '(မဖြစ်မနေ ထည့်ရန်)' : '(၁၂ နှစ်ပိုင်းအတွက် ရွေးချယ်ထည့်နိုင်သည်)';
  }
}

const form = byId('form');
const error = byId('error');
function submitCalculation(event) {
  event.preventDefault();
  error.hidden = true;
  const input = {when:when.value, method:method.value, birth:birth.value};
  try {
    validateInput(input);
    sessionStorage.setItem(inputKey, JSON.stringify(input));
    location.assign('./result.html');
  } catch (failure) {
    error.textContent = failure.message;
    error.hidden = false;
  }
}

form.addEventListener('submit',submitCalculation);
method.addEventListener('change',()=>{updateMethod();error.hidden = true;});
byId('now').addEventListener('click',()=>{
  when.value=inputDate(Date.now());
  form.requestSubmit();
});
const previous = savedInput();
when.value = previous?.when || inputDate(Date.now());
if (methods.includes(previous?.method)) method.value = previous.method;
birth.value = previous?.birth || '';
updateMethod();
