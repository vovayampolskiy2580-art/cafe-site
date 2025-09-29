/* Сайт розроблено студентом <ІМ'Я>, група <ГРУПА> */
// ====== КОНФІГ АВТОРСТВА (змініть під себе) ======
const AUTHOR_NAME = "Alex";     // ← Вкажіть ваше ім'я
const AUTHOR_GROUP = "ФІТ-2-2";        // ← Вкажіть вашу групу

// ====== ДАНІ ПОСЛУГ (масив JS) ======
const SERVICES = [
  { id: 1, name: "Еспресо", desc: "Насичений одинарний шот", price: 65, tags:["гарячий","to-go"] },
  { id: 2, name: "Американо", desc: "Еспресо + гаряча вода", price: 55, tags:["класика"] },
  { id: 3, name: "Капучино", desc: "Еспресо + молоко + пінка", price: 75, tags:["молочний","популярний"] },
  { id: 4, name: "Лате", desc: "М'який молочний напій", price: 80, tags:["молочний"] },
  { id: 5, name: "Флет-вайт", desc: "Подвійний еспресо + мікропіна", price: 95, tags:["міцний"] },
  { id: 6, name: "Раф", desc: "Еспресо, вершки, ванільний цукор", price: 105, tags:["солодкий"] },
  { id: 7, name: "Матча-лате", desc: "Зелений чай матча з молоком", price: 110, tags:["безкави"] },
  { id: 8, name: "Чізкейк", desc: "Класичний Нью-Йорк", price: 120, tags:["десерт"] },
  { id: 9, name: "Круасан", desc: "Свіжий хрусткий круасан", price: 65, tags:["випічка"] },
];

// ====== УТИЛІТИ ======
function formatUA(n){ return new Intl.NumberFormat('uk-UA', {style:'currency', currency:'UAH'}).format(n); }

function setActiveNav(){
  const path = location.pathname.split('/').pop() || "index.html";
  document.querySelectorAll('nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if((path === '' && href.endsWith('index.html')) || href.endsWith(path)) a.classList.add('active');
  });
}

function injectAuth(){
  const els = document.querySelectorAll('[data-auth]');
  els.forEach(el => el.textContent = `${AUTHOR_NAME} • ${AUTHOR_GROUP}`);
  // футер
  const f = document.getElementById('footer-auth');
  if(f) f.textContent = `${AUTHOR_NAME} • ${AUTHOR_GROUP}`;
}

// ====== РЕНДЕР ПОСЛУГ ======
function renderServices(){
  const tbl = document.getElementById('services-table');
  if(!tbl) return;
  const tbody = tbl.querySelector('tbody');
  tbody.innerHTML = '';
  SERVICES.forEach(s => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${s.name}</strong><div class="small">${s.desc}</div></td>
      <td>${s.tags.map(t=>`<span class="badge">${t}</span>`).join(' ')}</td>
      <td class="price" data-price="${s.price}">${formatUA(s.price)}</td>
      <td><input type="number" class="qty" min="0" value="0" data-id="${s.id}" style="width:90px"/></td>
      <td class="line-total">—</td>
    `;
    tbody.appendChild(tr);
  });
  recalcTotals();
  tbody.addEventListener('input', ev => {
    if(ev.target.classList.contains('qty')) recalcTotals();
  });
}

function recalcTotals(){
  const rows = [...document.querySelectorAll('#services-table tbody tr')];
  let total = 0;
  rows.forEach(r => {
    const price = Number(r.querySelector('.price').dataset.price);
    const qty = Math.max(0, Number(r.querySelector('.qty').value || 0));
    const line = price * qty;
    r.querySelector('.line-total').textContent = qty>0 ? formatUA(line) : '—';
    total += line;
  });
  const sumEl = document.getElementById('sum');
  if(sumEl) sumEl.textContent = formatUA(total);
}

// ====== ВАЛІДАЦІЯ та "НАДСИЛАННЯ" ФОРМИ ======
function setupContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  const out = document.getElementById('contact-output');

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    out.innerHTML = '';
    const data = Object.fromEntries(new FormData(form).entries());
    // проста валідація
    const errors = [];
    if(!data.name || data.name.trim().length < 2) errors.push("Ім'я має містити щонайменше 2 символи.");
    if(!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.push("Вкажіть коректний email.");
    if(!data.message || data.message.trim().length < 10) errors.push("Повідомлення має містити 10+ символів.");
    if(errors.length){
      out.innerHTML = `<div class="notice error"><b>Помилка:</b><br>${errors.map(e=>`• ${e}`).join('<br>')}</div>`;
      return;
    }
    // імітація надсилання
    const payload = {
      meta:{ timestamp:new Date().toISOString() },
      data
    };
    out.innerHTML = `<div class="notice success"><b>Готово!</b> Повідомлення збережено локально (імітація). Нижче JSON:</div>
    <pre class="card pad" style="overflow:auto;max-height:300px">${JSON.stringify(payload, null, 2)}</pre>`;
    form.reset();
  });
}

// ====== ІНІЦІАЛІЗАЦІЯ ======
document.addEventListener('DOMContentLoaded', ()=>{
  setActiveNav();
  injectAuth();
  renderServices();
  setupContactForm();
});
