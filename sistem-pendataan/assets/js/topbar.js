/* Shared topbar enhancements: search, comments, notifications, toast */
(function(){
  const SEARCH_INDEX = [
    {label:'Dashboard', sub:'Halaman utama', href:'index.html', icon:'fa-gauge'},
    {label:'Input Dosen', sub:'Form tambah dosen', href:'input-dosen.html', icon:'fa-pen-to-square'},
    {label:'Input Mahasiswa', sub:'Form tambah mahasiswa', href:'input-mahasiswa.html', icon:'fa-pen-to-square'},
    {label:'Data Dosen', sub:'Daftar dosen', href:'data-dosen.html', icon:'fa-folder-open'},
    {label:'Data Mahasiswa', sub:'Daftar mahasiswa', href:'data-mahasiswa.html', icon:'fa-folder-open'},
    {label:'Live Preview', sub:'Preview cepat sistem', href:'live-preview.html', icon:'fa-window-maximize'},
    {label:'Documentation', sub:'Dokumentasi pemakaian', href:'documentation.html', icon:'fa-file-lines'},
    {label:'Rizky Maulana Pratama', sub:'Mahasiswa · 19081123', href:'data-mahasiswa.html', icon:'fa-user'},
    {label:'Siti Nurhaliza', sub:'Mahasiswa · 19081145', href:'data-mahasiswa.html', icon:'fa-user'},
    {label:'Dr. Hadi Santoso, M.Kom.', sub:'Dosen · NIDN 0012078001', href:'data-dosen.html', icon:'fa-chalkboard-user'},
    {label:'Dr. Siti Nurhaliza, M.Kom.', sub:'Dosen · NIDN 0023118502', href:'data-dosen.html', icon:'fa-chalkboard-user'},
  ];

  const NOTIFS_DEFAULT = [
    {icon:'fa-user-plus', color:'text-primary', text:'Mahasiswa baru: Rizky Maulana', time:'2 mnt lalu', read:false},
    {icon:'fa-pen',       color:'text-warning', text:'Data dosen diperbarui',         time:'12 mnt lalu', read:false},
    {icon:'fa-handshake', color:'text-success', text:'Mitra baru: PT. Telkom',         time:'1 jam lalu',  read:false},
    {icon:'fa-trash',     color:'text-danger',  text:'Mata kuliah dihapus',            time:'3 jam lalu',  read:true},
    {icon:'fa-circle-info', color:'text-info',  text:'Backup otomatis berhasil',       time:'Kemarin',     read:true},
  ];
  const COMMENTS_DEFAULT = [
    {user:'Admin', text:'Mohon segera lengkapi data mahasiswa angkatan 2024.', time:'09:14'},
    {user:'Rina',  text:'Form input dosen sudah saya verifikasi ya.',          time:'08:50'},
    {user:'Brian', text:'Live preview dashboard sudah siap dipakai.',          time:'Kemarin'},
  ];

  function load(key, fallback){
    try { const v = JSON.parse(localStorage.getItem(key)); return v ?? fallback; }
    catch { return fallback; }
  }
  function save(key, v){ localStorage.setItem(key, JSON.stringify(v)); }

  let notifs   = load('sp_notifs',   NOTIFS_DEFAULT);
  let comments = load('sp_comments', COMMENTS_DEFAULT);

  /* ---- DOM helpers ---- */
  function makePanel(id){
    const el = document.createElement('div');
    el.className = 'sp-panel'; el.id = id;
    document.body.appendChild(el);
    return el;
  }
  function positionPanel(panel, anchor){
    const r = anchor.getBoundingClientRect();
    panel.style.top  = (r.bottom + 6) + 'px';
    panel.style.right = (window.innerWidth - r.right) + 'px';
  }
  function closeAll(except){
    document.querySelectorAll('.sp-panel.open').forEach(p => { if(p!==except) p.classList.remove('open'); });
  }

  /* ---- Toast ---- */
  function toast(msg, type){
    let host = document.getElementById('sp-toast-host');
    if(!host){ host = document.createElement('div'); host.id='sp-toast-host'; document.body.appendChild(host); }
    const t = document.createElement('div');
    t.className = 'sp-toast ' + (type||'info');
    t.innerHTML = `<i class="fa-solid ${type==='success'?'fa-circle-check':type==='error'?'fa-triangle-exclamation':'fa-circle-info'}"></i> ${msg}`;
    host.appendChild(t);
    setTimeout(()=>{ t.classList.add('out'); setTimeout(()=>t.remove(), 300); }, 2600);
  }
  window.spToast = toast;

  /* ---- Build panels ---- */
  function renderSearch(panel, q){
    q = (q||'').trim().toLowerCase();
    const rows = q ? SEARCH_INDEX.filter(r => (r.label+' '+r.sub).toLowerCase().includes(q)) : SEARCH_INDEX.slice(0,6);
    panel.querySelector('.sp-results').innerHTML = rows.length ? rows.map(r=>`
      <a class="sp-row" href="${r.href}">
        <i class="fa-solid ${r.icon}"></i>
        <div><div class="sp-row-title">${r.label}</div><div class="sp-row-sub">${r.sub}</div></div>
      </a>`).join('') : `<div class="sp-empty">Tidak ada hasil untuk "<b>${q}</b>"</div>`;
  }
  function buildSearch(){
    const p = makePanel('sp-search');
    p.innerHTML = `
      <div class="sp-head"><i class="fa-solid fa-magnifying-glass"></i>
        <input type="text" placeholder="Cari halaman, mahasiswa, dosen..." class="sp-search-input" autocomplete="off">
      </div>
      <div class="sp-results"></div>`;
    const input = p.querySelector('input');
    input.addEventListener('input', () => renderSearch(p, input.value));
    renderSearch(p, '');
    return { panel:p, focus:()=>{ input.focus(); input.select(); } };
  }
  function buildNotifs(){
    const p = makePanel('sp-notif');
    function render(){
      const unread = notifs.filter(n=>!n.read).length;
      const dot = document.querySelector('[data-icon="bell"] .badge-dot');
      if(dot){ dot.textContent = unread; dot.style.display = unread?'inline-block':'none'; }
      p.innerHTML = `
        <div class="sp-head sp-head-flat"><b>Notifikasi</b>
          <button class="sp-link" id="markAll">Tandai semua dibaca</button>
        </div>
        <div class="sp-results">
          ${notifs.map((n,i)=>`
            <div class="sp-row sp-notif-row ${n.read?'is-read':''}" data-i="${i}">
              <i class="fa-solid ${n.icon} ${n.color}"></i>
              <div><div class="sp-row-title">${n.text}</div><div class="sp-row-sub">${n.time}</div></div>
              ${n.read?'':'<span class="sp-dot"></span>'}
            </div>`).join('')}
        </div>
        <div class="sp-foot"><a href="#" onclick="return false">Lihat semua aktivitas</a></div>`;
      p.querySelector('#markAll').onclick = ()=>{
        notifs = notifs.map(n=>({...n, read:true})); save('sp_notifs', notifs); render(); toast('Semua notifikasi ditandai sudah dibaca','success');
      };
      p.querySelectorAll('.sp-notif-row').forEach(el=>{
        el.onclick = ()=>{ const i=+el.dataset.i; notifs[i].read=true; save('sp_notifs', notifs); render(); };
      });
    }
    render();
    return { panel:p, focus:render };
  }
  function buildComments(){
    const p = makePanel('sp-comment');
    function render(){
      const dot = document.querySelector('[data-icon="comment"] .badge-dot');
      if(dot){ dot.textContent = comments.length; }
      p.innerHTML = `
        <div class="sp-head sp-head-flat"><b>Komentar</b><span class="sp-link">${comments.length} pesan</span></div>
        <div class="sp-results">
          ${comments.map(c=>`
            <div class="sp-row">
              <div class="sp-avatar">${c.user[0].toUpperCase()}</div>
              <div><div class="sp-row-title">${c.user} <span class="sp-row-sub" style="font-weight:400">· ${c.time}</span></div>
                <div class="sp-row-sub">${c.text}</div></div>
            </div>`).join('') || '<div class="sp-empty">Belum ada komentar</div>'}
        </div>
        <form class="sp-comment-form">
          <input type="text" placeholder="Tulis komentar..." required>
          <button type="submit" class="btn btn-sm btn-cyan"><i class="fa-solid fa-paper-plane"></i></button>
        </form>`;
      p.querySelector('.sp-comment-form').onsubmit = (e)=>{
        e.preventDefault();
        const inp = p.querySelector('input');
        const txt = inp.value.trim(); if(!txt) return;
        comments.unshift({user:'Brian', text:txt, time:'Baru saja'});
        save('sp_comments', comments); render(); toast('Komentar terkirim','success');
      };
    }
    render();
    return { panel:p, focus:render };
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    /* Tag the topbar icons so badges can be updated and clicks routed */
    document.querySelectorAll('.icon-btn').forEach(btn=>{
      const ic = btn.querySelector('i');
      if(!ic) return;
      if(ic.classList.contains('fa-magnifying-glass')) btn.dataset.icon = 'search';
      else if(ic.classList.contains('fa-comment'))     btn.dataset.icon = 'comment';
      else if(ic.classList.contains('fa-bell'))        btn.dataset.icon = 'bell';
    });

    const search   = buildSearch();
    const notif    = buildNotifs();
    const comment  = buildComments();
    const map = { search:search, comment:comment, bell:notif };

    document.addEventListener('click', (e)=>{
      const btn = e.target.closest('.icon-btn[data-icon]');
      if(btn){
        e.preventDefault();
        const key = btn.dataset.icon;
        const target = map[key]; if(!target) return;
        const isOpen = target.panel.classList.contains('open');
        closeAll();
        if(!isOpen){
          positionPanel(target.panel, btn);
          target.panel.classList.add('open');
          target.focus && target.focus();
        }
        return;
      }
      if(!e.target.closest('.sp-panel')) closeAll();
    });
    /* Keyboard shortcut: / to focus search */
    document.addEventListener('keydown', (e)=>{
      if(e.key==='/' && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
        e.preventDefault();
        document.querySelector('.icon-btn[data-icon="search"]')?.click();
      }
      if(e.key==='Escape') closeAll();
    });
    window.addEventListener('resize', closeAll);
  });
})();
