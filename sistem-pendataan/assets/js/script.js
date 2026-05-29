// Toggle sidebar (mobile)
document.addEventListener('click', function(e){
  if(e.target.closest('#btnToggle')){
    document.getElementById('sidebar').classList.toggle('show');
  }
  // submenu toggle
  const tog = e.target.closest('.sub-toggle');
  if(tog){
    e.preventDefault();
    const li = tog.parentElement;
    li.classList.toggle('open');
    const sm = li.querySelector('.submenu');
    if(sm) sm.style.display = li.classList.contains('open') ? 'block' : 'none';
  }
});

// Form dosen
const fd = document.getElementById('formDosen');
if(fd){
  fd.addEventListener('submit', function(e){
    e.preventDefault();
    if(!fd.checkValidity()){
      fd.classList.add('was-validated');
      alert('Mohon lengkapi data terlebih dahulu.');
      return;
    }
    const data = Object.fromEntries(new FormData(fd).entries());
    console.log('Submit data dosen:', data);
    alert('Data dosen "'+data.firstname+' '+data.lastname+'" berhasil disimpan (dummy).');
    fd.reset();
    fd.classList.remove('was-validated');
  });
}
