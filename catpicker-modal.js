// CatPicker Modal — drop-in module
(function(){
  const tpl = `
  <div class="catpicker-backdrop" id="catpickerBackdrop" role="dialog" aria-modal="true" aria-labelledby="catpickerTitle">
    <div class="catpicker-dialog">
      <div class="catpicker-header"><h2 class="catpicker-title" id="catpickerTitle">Pick a category</h2></div>
      <div class="catpicker-body">
        <input id="catpickerSearch" class="catpicker-search" type="text" placeholder="Search categories…" />
        <div id="catpickerList" class="catpicker-list" role="listbox" aria-label="Categories"></div>
      </div>
      <div class="catpicker-actions">
        <button class="catpicker-btn" id="catpickerCancel">Cancel</button>
        <button class="catpicker-btn primary" id="catpickerUse">Use category</button>
      </div>
    </div>
  </div>`;

  function ensureModal(){
    if(document.getElementById('catpickerBackdrop')) return;
    const wrap = document.createElement('div');
    wrap.innerHTML = tpl;
    document.body.appendChild(wrap.firstElementChild);
  }

  function buildList(el, cats, picked){
    el.innerHTML = '';
    const mk = (name)=>{
      const div = document.createElement('div');
      div.className = 'catpicker-item';
      div.setAttribute('role','option');
      div.dataset.name = name;
      if(name === picked) div.setAttribute('aria-selected','true');
      const span = document.createElement('span'); span.textContent = name;
      const badge = document.createElement('span'); badge.className = 'catpicker-badge'; badge.textContent = '';
      div.appendChild(span); div.appendChild(badge);
      div.addEventListener('click', ()=>{
        const nm = (div.dataset.name||'').toLowerCase().trim();
        const isAdd = nm.startsWith('+') || nm.startsWith('➕') || nm.indexOf('add new category') !== -1;
        if (isAdd) { div.setAttribute('aria-selected','true'); try { document.getElementById('catpickerUse').click(); } catch(e) {} return; }
        document.querySelectorAll('.catpicker-item[aria-selected="true"]').forEach(x=>x.removeAttribute('aria-selected'));
        div.setAttribute('aria-selected','true');
      });
      return div;
    };
    cats.forEach(c=> el.appendChild(mk(c)));
  }

  function openCategoryPicker({categories, current, onChoose}){
    ensureModal();
    const backdrop = document.getElementById('catpickerBackdrop');
    const search = document.getElementById('catpickerSearch');
    const list = document.getElementById('catpickerList');
    const btnUse = document.getElementById('catpickerUse');
    const btnCancel = document.getElementById('catpickerCancel');

    const uniq = Array.from(new Set(categories.map(c=> (c||'').trim()).filter(Boolean)));
    buildList(list, uniq, current);

    const filter = ()=>{
      const q = search.value.toLowerCase().trim();
      const filtered = uniq.filter(c=> c.toLowerCase().includes(q));
      buildList(list, filtered, (document.querySelector('.catpicker-item[aria-selected="true"]')?.dataset.name)||current);
    };
    search.oninput = filter;

    const close = ()=>{ backdrop.classList.remove('show'); search.value=''; };
    btnCancel.onclick = close;
    backdrop.onclick = (e)=>{ if(e.target===backdrop) close(); };

    btnUse.onclick = ()=>{
      const selected = (document.querySelector('.catpicker-item[aria-selected="true"]')?.dataset.name) || current;
      onChoose && onChoose(selected);
      close();
    };

    backdrop.classList.add('show');
    setTimeout(()=> search.focus(), 50);
  }

  window.SL_CatPicker = { openCategoryPicker };
})();