/* Shell renderer: builds sidebar + topbar for new pages.
   Existing pages keep their inline shell. */
(function(){
  const NAV = [
    {key:'dashboard',        href:'index.html',           icon:'fa-gauge',          label:'Dashboard'},
    {key:'_input',  type:'group', icon:'fa-pen-to-square', label:'Form Input', children:[
      {key:'input-dosen',     href:'input-dosen.html',     label:'Input Dosen'},
      {key:'input-mahasiswa', href:'input-mahasiswa.html', label:'Input Mahasiswa'},
    ]},
    {key:'_data',   type:'group', icon:'fa-folder-open',  label:'Data', badge:'2', children:[
      {key:'data-dosen',      href:'data-dosen.html',      label:'Data Dosen'},
      {key:'data-mahasiswa',  href:'data-mahasiswa.html',  label:'Data Mahasiswa'},
    ]},
    {key:'live-preview',     href:'live-preview.html',    icon:'fa-window-maximize', label:'Live Preview'},
    {key:'documentation',    href:'documentation.html',   icon:'fa-file-lines',      label:'Documentation'},
    {key:'logout',           href:'#',                    icon:'fa-right-from-bracket', label:'Logout',
      onclick:"return confirm('Logout dari sistem?')"},
  ];

  function build(active){
    return `
      <aside class="sidebar" id="sidebar">
        <div class="sidebar-brand"><i class="fa-solid fa-graduation-cap"></i><span>Sistem Pendataan</span></div>
        <ul class="sidebar-menu">
          ${NAV.map(item=>{
            if(item.type==='group'){
              const childActive = item.children.some(c=>c.key===active);
              return `<li class="has-sub ${childActive?'open':''}">
                <a href="#" class="sub-toggle ${childActive?'active':''}"><i class="fa-solid ${item.icon}"></i> ${item.label}${item.badge?` <span class="badge bg-secondary ms-auto">${item.badge}</span>`:''} <i class="fa-solid fa-angle-down arrow"></i></a>
                <ul class="submenu" ${childActive?'style="display:block"':''}>
                  ${item.children.map(c=>`<li><a href="${c.href}" class="${c.key===active?'active':''}"><i class="fa-regular ${c.key===active?'fa-circle-dot':'fa-circle'}"></i> ${c.label}</a></li>`).join('')}
                </ul>
              </li>`;
            }
            const oc = item.onclick?` onclick="${item.onclick}"`:'';
            return `<li><a href="${item.href}"${oc} class="${item.key===active?'active':''}"><i class="fa-solid ${item.icon}"></i> ${item.label}</a></li>`;
          }).join('')}
        </ul>
        <div class="sidebar-foot">
          <a href="documentation.html" class="btn btn-outline-light btn-sm w-100"><i class="fa-regular fa-file-lines me-1"></i> View documentation</a>
        </div>
      </aside>
      <div class="main">
        <nav class="topbar">
          <button class="btn-toggle" id="btnToggle"><i class="fa-solid fa-bars"></i></button>
          <a href="live-preview.html" class="topbar-link ${active==='live-preview'?'active':''}"><i class="fa-regular fa-window-maximize"></i> Live preview</a>
          <a href="documentation.html" class="topbar-link d-none d-md-inline ${active==='documentation'?'active':''}"><i class="fa-regular fa-file-lines"></i> Documentation</a>
          <div class="ms-auto d-flex align-items-center gap-3">
            <a href="#" class="icon-btn" title="Cari (/)"><i class="fa-solid fa-magnifying-glass"></i></a>
            <a href="#" class="icon-btn" title="Komentar"><i class="fa-regular fa-comment"></i><span class="badge-dot bg-success">3</span></a>
            <a href="#" class="icon-btn" title="Notifikasi"><i class="fa-regular fa-bell"></i><span class="badge-dot bg-warning text-dark">15</span></a>
            <div class="profile">
              <img src="assets/img/profil.jpeg" alt="profil">
              <span>Brian Dicky Vanka Andaraneva</span>
            </div>
          </div>
        </nav>
        <div class="content" id="shellContent"></div>
        <footer class="footer">
          <div>Copyright © 2014-2026 <a href="index.html">Sistem Pendataan Kampus</a>. All rights reserved.</div>
          <div class="text-muted small">v1.0.2</div>
        </footer>
      </div>`;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const wrap = document.querySelector('.app-wrapper[data-page]');
    if(!wrap) return;
    const active = wrap.dataset.page;
    wrap.innerHTML = build(active);
    const src = document.getElementById('page-content');
    if(src){
      document.getElementById('shellContent').innerHTML = src.innerHTML;
      src.remove();
    }
    /* sidebar interactions */
    document.addEventListener('click', (e)=>{
      if(e.target.closest('#btnToggle')) document.getElementById('sidebar').classList.toggle('show');
      const tog = e.target.closest('.sub-toggle');
      if(tog){
        e.preventDefault();
        const li = tog.parentElement; li.classList.toggle('open');
        const sm = li.querySelector('.submenu');
        if(sm) sm.style.display = li.classList.contains('open') ? 'block' : 'none';
      }
    });
    document.dispatchEvent(new CustomEvent('shell:ready', {detail:{active}}));
  });
})();
