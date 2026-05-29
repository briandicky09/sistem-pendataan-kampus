const MHS = [
  {nama:'Rizky Maulana Pratama', nim:'19081123', prodi:'Teknik Informatika', progress:78, status:'aktif'},
  {nama:'Siti Nurhaliza',         nim:'19081145', prodi:'Sistem Informasi',   progress:92, status:'aktif'},
  {nama:'Agus Salim Wibowo',      nim:'18081098', prodi:'Teknik Informatika', progress:45, status:'cuti'},
  {nama:'Dewi Lestari',           nim:'20081201', prodi:'Manajemen Informatika', progress:30, status:'aktif'},
  {nama:'Bambang Sutejo',         nim:'17081056', prodi:'Teknik Informatika', progress:100, status:'lulus'},
  {nama:'Putri Anggraini',        nim:'19081134', prodi:'Sistem Informasi',   progress:65, status:'aktif'},
  {nama:'Joko Susilo',            nim:'18081077', prodi:'Teknik Komputer',    progress:55, status:'aktif'},
  {nama:'Anisa Rahmawati',        nim:'20081222', prodi:'Sistem Informasi',   progress:25, status:'aktif'},
  {nama:'Fajar Nugraha',          nim:'19081159', prodi:'Teknik Informatika', progress:88, status:'aktif'},
  {nama:'Indah Permatasari',      nim:'18081088', prodi:'Manajemen Informatika', progress:70, status:'aktif'},
  {nama:'Hendra Kurniawan',       nim:'17081042', prodi:'Teknik Komputer',    progress:95, status:'aktif'},
  {nama:'Maria Ulfah',            nim:'20081210', prodi:'Sistem Informasi',   progress:18, status:'aktif'},
  {nama:'Doni Saputra',           nim:'19081167', prodi:'Teknik Informatika', progress:60, status:'aktif'},
  {nama:'Lia Anggraini',          nim:'18081099', prodi:'Sistem Informasi',   progress:82, status:'aktif'},
  {nama:'Rangga Pratama',         nim:'19081172', prodi:'Teknik Komputer',    progress:50, status:'cuti'},
];

const perPage = 5;
let page = 1;
let filtered = [...MHS];

function colorFor(p){
  if(p>=80) return 'bg-success';
  if(p>=60) return 'bg-primary';
  if(p>=40) return 'bg-warning';
  return 'bg-danger';
}
function render(){
  const tbody = document.querySelector('#tabelMhs tbody');
  const start = (page-1)*perPage;
  const rows = filtered.slice(start, start+perPage);
  tbody.innerHTML = rows.map((m,i)=>`
    <tr>
      <td>${start+i+1}.</td>
      <td><strong>${m.nama}</strong><div class="text-muted small">${m.prodi}</div></td>
      <td><code>${m.nim}</code></td>
      <td>${m.prodi}</td>
      <td>
        <div class="progress-wrap">
          <div class="progress"><div class="progress-bar ${colorFor(m.progress)}" style="width:${m.progress}%"></div></div>
          <span class="pill ${colorFor(m.progress)}">${m.progress}%</span>
        </div>
      </td>
      <td class="text-end">
        <button class="btn btn-sm btn-outline-primary" title="Edit"><i class="fa-solid fa-pen"></i></button>
        <button class="btn btn-sm btn-outline-danger" title="Hapus"><i class="fa-solid fa-trash"></i></button>
      </td>
    </tr>
  `).join('') || `<tr><td colspan="6" class="text-center text-muted py-4">Data tidak ditemukan.</td></tr>`;

  const totalPages = Math.max(1, Math.ceil(filtered.length/perPage));
  document.getElementById('pageInfo').textContent =
    `Menampilkan ${filtered.length?start+1:0} - ${Math.min(start+perPage,filtered.length)} dari ${filtered.length} data`;

  let pg = `<li class="page-item ${page===1?'disabled':''}"><a class="page-link" href="#" data-p="${page-1}">«</a></li>`;
  for(let i=1;i<=totalPages;i++){
    pg += `<li class="page-item ${i===page?'active':''}"><a class="page-link" href="#" data-p="${i}">${i}</a></li>`;
  }
  pg += `<li class="page-item ${page===totalPages?'disabled':''}"><a class="page-link" href="#" data-p="${page+1}">»</a></li>`;
  document.getElementById('pagination').innerHTML = pg;
}

document.addEventListener('click', e=>{
  const a = e.target.closest('#pagination a');
  if(a){
    e.preventDefault();
    const p = parseInt(a.dataset.p);
    const total = Math.ceil(filtered.length/perPage);
    if(p>=1 && p<=total){ page=p; render(); }
  }
});

document.getElementById('searchInput').addEventListener('input', e=>{
  const q = e.target.value.toLowerCase();
  filtered = MHS.filter(m => m.nama.toLowerCase().includes(q) || m.nim.includes(q));
  page = 1;
  render();
});

render();
