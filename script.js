// ============================================
// VINZXCYY MUSIC - FINAL VERSION
// ============================================

const SONGS=[
  {id:1,title:"Hujan Malam",artist:"VINZXCYY",src:"songs/song1.mp3"},
  {id:2,title:"Rindu Senja",artist:"VINZXCYY",src:"songs/song2.mp3"},
  {id:3,title:"Cahaya Pagi",artist:"VINZXCYY",src:"songs/song3.mp3"},
  {id:4,title:"Badai Hati",artist:"VINZXCYY",src:"songs/song4.mp3"},
  {id:5,title:"Sunyi Kota",artist:"VINZXCYY",src:"songs/song5.mp3"},
  {id:6,title:"Langkah Kaki",artist:"VINZXCYY",src:"songs/song6.mp3"},
  {id:7,title:"Bayang Semu",artist:"VINZXCYY",src:"songs/song7.mp3"},
  {id:8,title:"Embun Pagi",artist:"VINZXCYY",src:"songs/song8.mp3"},
  {id:9,title:"Cinta Terakhir",artist:"VINZXCYY",src:"songs/song9.mp3"},
  {id:10,title:"Jejak Waktu",artist:"VINZXCYY",src:"songs/song10.mp3"}
];

let idx=0,playing=false,shuffle=false,repeat=false;
let user=null,favs=[],recent=[];

const $=id=>document.getElementById(id);
const loginScreen=$('loginScreen'),mainApp=$('mainApp'),loginPanel=$('loginPanel');
const loginForm=$('loginForm'),registerForm=$('registerForm');
const loginMsg=$('loginMsg'),regMsg=$('regMsg'),hackLoader=$('hackLoader');
const songList=$('songList'),audio=$('audioEl'),playBtn=$('playBtn');
const prevBtn=$('prevBtn'),nextBtn=$('nextBtn'),shuffleBtn=$('shuffleBtn');
const repeatBtn=$('repeatBtn'),progressBar=$('progressBar'),volumeBar=$('volumeBar');
const curTime=$('curTime'),durTime=$('durTime'),npTitle=$('npTitle');
const npArtist=$('npArtist'),playerCover=$('playerCover');
const welcomeUser=$('welcomeUser'),searchInput=$('searchInput');
const toastStack=$('toastStack');

const BOOT=[
  "VINZXCYY BIOS v2.0.26 (C) 2028",
  "Memory test .......... 65536 MB OK",
  "Initializing audio subsystem ...........",
  "Loading kernel modules ........",
  "Mounting /songs ......... 10 files found",
  "Connecting to VINZXCYY mainframe ......",
  "Encrypted tunnel established ..........",
  "Scanning for threats .......... 0 detected",
  "WARNING: unauthorized user detected",
  "Awaiting authentication .........."
];

const STATUS=[
  "Menginisialisasi koneksi...",
  "Enkripsi AES-256 aktif.",
  "Menunggu kredensial...",
  "Sistem siap menerima perintah."
];

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

async function runBoot(){
  const boot=$('bootScreen');
  for(let i=0;i<BOOT.length;i++){
    const el=document.createElement('div');
    el.className='boot-line';
    el.textContent='> '+BOOT[i];
    if(i===1||i===3||i===4||i===6||i===7)el.classList.add('ok');
    if(i===8)el.classList.add('warn');
    if(i===9)el.classList.add('err');
    boot.appendChild(el);
    await sleep(200);
  }
  const c=document.createElement('div');
  c.innerHTML='> <span class="boot-cursor"></span>';
  boot.appendChild(c);
  await sleep(600);
  boot.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  initMatrix();
  cycleStatus();
}

function cycleStatus(){
  const el=$('panelStatus');let i=0;
  function tick(){el.textContent=STATUS[i];i=(i+1)%STATUS.length;setTimeout(tick,2500)}
  tick();
}

function initMatrix(){
  const c=$('matrixCanvas');if(!c)return;
  const ctx=c.getContext('2d');
  function resize(){c.width=innerWidth;c.height=innerHeight}
  resize();addEventListener('resize',resize);
  const chars='アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ☠⚠☣♥♦';
  const fs=14,cols=Math.floor(c.width/fs);
  const drops=new Array(cols).fill(1);
  setInterval(()=>{
    ctx.fillStyle='rgba(0,0,0,0.08)';
    ctx.fillRect(0,0,c.width,c.height);
    ctx.font=fs+'px monospace';
    for(let i=0;i<drops.length;i++){
      const ch=chars[Math.floor(Math.random()*chars.length)];
      ctx.fillStyle=Math.random()>0.92?'#ffffff':'#ff0033';
      ctx.fillText(ch,i*fs,drops[i]*fs);
      if(drops[i]*fs>c.height&&Math.random()>0.975)drops[i]=0;
      drops[i]++;
    }
  },42);
}

function toast(msg,type){
  type=type||'info';
  const t=document.createElement('div');
  t.className='toast '+type;
  t.textContent=msg;
  toastStack.appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},3000);
}

document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
    btn.classList.add('active');
    if(btn.dataset.tab==='login'){loginForm.classList.add('active');loginMsg.textContent=''}
    else{registerForm.classList.add('active');regMsg.textContent=''}
  });
});

registerForm.addEventListener('submit',e=>{
  e.preventDefault();
  const u=$('regUser').value.trim(),p=$('regPass').value,p2=$('regPass2').value;
  if(u.length<3){regMsg.className='panel-msg err';regMsg.textContent='✕ Username minimal 3 karakter.';shake();return}
  if(p.length<6){regMsg.className='panel-msg err';regMsg.textContent='✕ Password minimal 6 karakter.';shake();return}
  if(p!==p2){regMsg.className='panel-msg err';regMsg.textContent='✕ Konfirmasi tidak cocok.';shake();return}
  const users=JSON.parse(localStorage.getItem('vinzx_users')||'{}');
  if(users[u]){regMsg.className='panel-msg err';regMsg.textContent='✕ Username sudah terdaftar.';shake();return}
  users[u]=btoa(p);
  localStorage.setItem('vinzx_users',JSON.stringify(users));
  regMsg.className='panel-msg ok';
  regMsg.textContent='✓ Akun dibuat. Silakan masuk.';
  toast('Akun berhasil dibuat');
  setTimeout(()=>{
    document.querySelector('[data-tab="login"]').click();
    $('loginUser').value=u;
    regMsg.className='panel-msg';regMsg.textContent='';
    $('regUser').value='';$('regPass').value='';$('regPass2').value='';
  },1400);
});

loginForm.addEventListener('submit',e=>{
  e.preventDefault();
  const u=$('loginUser').value.trim(),p=$('loginPass').value;
  const users=JSON.parse(localStorage.getItem('vinzx_users')||'{}');
  if(!users[u]||atob(users[u])!==p){
    loginMsg.className='panel-msg err';
    loginMsg.textContent='✕ Kredensial tidak valid.';
    shake();return;
  }
  user=u;
  loginMsg.className='panel-msg ok';
  loginMsg.textContent='✓ Terverifikasi. Memuat sistem...';
  loginPanel.classList.add('success');
  setTimeout(()=>runHack(u),400);
});

function shake(){
  loginPanel.classList.remove('shake');
  void loginPanel.offsetWidth;
  loginPanel.classList.add('shake');
}

function runHack(u){
  loginPanel.classList.add('hidden');
  hackLoader.classList.remove('hidden');
  const lines=[
    {el:'t1',t:'> Membuka jalur ke mainframe...'},
    {el:'t2',t:'> Memverifikasi identitas: '+u},
    {el:'t3',t:'> Mendekripsi vault pengguna...'},
    {el:'t4',t:'> Memuat database musik...'},
    {el:'t5',t:'> Sinkronisasi playlist...'},
    {el:'t6',t:'> AKSES DIBERIKAN ☠'}
  ];
  let i=0;
  const bar=$('hackBar');
  function next(){
    if(i>=lines.length){setTimeout(enterApp,900);return}
    const o=lines[i];let j=0;
    const tm=setInterval(()=>{
      $(o.el).textContent=o.t.substring(0,j++);
      if(j>o.t.length){
        clearInterval(tm);i++;
        bar.style.width=((i/lines.length)*100)+'%';
        setTimeout(next,220);
      }
    },18);
  }
  next();
}

function enterApp(){
  hackLoader.classList.add('hidden');
  loginScreen.classList.add('hidden');
  mainApp.classList.remove('hidden');
  $('userAvatar').textContent=user[0].toUpperCase();
  welcomeUser.innerHTML=user+'<small>SESSION · AKTIF</small>';
  localStorage.setItem('vinzx_last_user',user);
  favs=JSON.parse(localStorage.getItem('vinzx_fav_'+user)||'[]');
  recent=JSON.parse(localStorage.getItem('vinzx_recent_'+user)||'[]');
  renderSongs(SONGS);
  setupAudio();
  loadVolume();
  toast('Selamat datang, '+user);
}

$('logoutBtn').addEventListener('click',()=>{
  if(!confirm('Yakin logout, '+user+'?'))return;
  audio.pause();audio.src='';
  user=null;playing=false;
  mainApp.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  loginPanel.classList.remove('hidden','success');
  loginForm.reset();registerForm.reset();
  loginMsg.textContent='';regMsg.textContent='';
  updatePlayBtn();
});

function generateCover(title){
  const colors=[['#ff0033','#8b0000'],['#1db954','#0a3d1f'],['#00fff0','#004d4a'],['#a855f7','#4c1d95'],['#ff8800','#7c2d12'],['#ec4899','#831843'],['#3b82f6','#1e3a8a'],['#14b8a6','#134e4a']];
  const i=title.charCodeAt(0)%colors.length;
  const c1=colors[i][0],c2=colors[i][1];
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='"+encodeURIComponent(c1)+"'/><stop offset='100%' stop-color='"+encodeURIComponent(c2)+"'/></linearGradient></defs><rect width='200' height='200' fill='url(%23g)'/><text x='100' y='130' font-size='90' font-weight='900' font-family='monospace' text-anchor='middle' fill='white'>"+encodeURIComponent(title[0].toUpperCase())+"</text></svg>";
}

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function renderSongs(list){
  songList.innerHTML='';
  $('sectionCount').textContent=list.length+' lagu';
  if(!list.length){
    songList.innerHTML='<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-mute);font-size:12px;">— tidak ada lagu —</p>';
    return;
  }
  list.forEach(s=>{
    const card=document.createElement('div');
    card.className='song-card';
    card.dataset.id=s.id;
    if(SONGS[idx].id===s.id)card.classList.add('playing');
    card.innerHTML='<div class="song-cover"><img src="'+generateCover(s.title)+'" alt=""></div><div class="song-title">'+esc(s.title)+'</div><div class="song-artist">'+esc(s.artist)+'</div>';
    card.addEventListener('click',()=>playById(s.id));
    songList.appendChild(card);
  });
}

function playById(id){
  const i=SONGS.findIndex(s=>s.id===id);
  if(i===-1)return;
  idx=i;loadSong();
  audio.play().then(()=>{
    playing=true;updatePlayBtn();
    recent=recent.filter(x=>x!==id);
    recent.unshift(id);recent=recent.slice(0,10);
    localStorage.setItem('vinzx_recent_'+user,JSON.stringify(recent));
  }).catch(err=>{
    console.warn(err);playing=false;updatePlayBtn();
    toast('Gagal memutar audio','err');
  });
}

function loadSong(){
  const s=SONGS[idx];
  audio.src=s.src;
  npTitle.textContent=s.title;
  npArtist.textContent=s.artist;
  playerCover.innerHTML='<img src="'+generateCover(s.title)+'" alt="">';
  document.querySelectorAll('.song-card').forEach(c=>c.classList.toggle('playing',Number(c.dataset.id)===SONGS[idx].id));
}

function setupAudio(){
  audio.addEventListener('timeupdate',()=>{
    if(!audio.duration)return;
    progressBar.value=(audio.currentTime/audio.duration)*100;
    curTime.textContent=fmt(audio.currentTime);
    durTime.textContent=fmt(audio.duration);
  });
  audio.addEventListener('ended',()=>{
    if(repeat){audio.currentTime=0;audio.play()}
    else nextSong();
  });
  audio.addEventListener('error',()=>{
    npArtist.textContent='⚠ file tidak tersedia';
    playing=false;updatePlayBtn();
  });
}
function fmt(s){if(!isFinite(s))return'0:00';const m=Math.floor(s/60),x=Math.floor(s%60);return m+':'+(x<10?'0':'')+x}

playBtn.addEventListener('click',()=>{
  if(!audio.src){playById(SONGS[idx].id);return}
  if(audio.paused){audio.play().then(()=>{playing=true;updatePlayBtn()})}
  else{audio.pause();playing=false;updatePlayBtn()}
});
function updatePlayBtn(){playBtn.textContent=playing?'❚❚':'▶'}

prevBtn.addEventListener('click',()=>{
  if(audio.currentTime>3){audio.currentTime=0;return}
  idx=(idx-1+SONGS.length)%SONGS.length;
  loadSong();audio.play().then(()=>{playing=true;updatePlayBtn()});
});

nextBtn.addEventListener('click',nextSong);
function nextSong(){
  if(shuffle){
    let n;do{n=Math.floor(Math.random()*SONGS.length)}while(n===idx&&SONGS.length>1);
    idx=n;
  }else idx=(idx+1)%SONGS.length;
  loadSong();
  audio.play().then(()=>{playing=true;updatePlayBtn()});
}

shuffleBtn.addEventListener('click',()=>{shuffle=!shuffle;shuffleBtn.classList.toggle('active',shuffle);toast('Shuffle '+(shuffle?'aktif':'mati'))});
repeatBtn.addEventListener('click',()=>{repeat=!repeat;repeatBtn.classList.toggle('active',repeat);toast('Repeat '+(repeat?'aktif':'mati'))});

progressBar.addEventListener('input',()=>{
  if(!audio.duration)return;
  audio.currentTime=(progressBar.value/100)*audio.duration;
});

volumeBar.addEventListener('input',()=>{
  audio.volume=volumeBar.value/100;
  localStorage.setItem('vinzx_volume',volumeBar.value);
  updateVolIcon();
});
$('volIcon').addEventListener('click',()=>{
  const v=audio.volume>0?0:0.7;
  audio.volume=v;volumeBar.value=v*100;
  localStorage.setItem('vinzx_volume',volumeBar.value);
  updateVolIcon();
});
function updateVolIcon(){const v=audio.volume;$('volIcon').textContent=v===0?'✕':v<0.5?'◔':'◐'}
function loadVolume(){const v=localStorage.getItem('vinzx_volume')||70;volumeBar.value=v;audio.volume=v/100;updateVolIcon()}

searchInput.addEventListener('input',()=>{
  const q=searchInput.value.toLowerCase().trim();
  const list=q?SONGS.filter(s=>s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q)):SONGS.slice();
  $('sectionTitle').textContent=q?'Hasil Pencarian':'Semua Lagu';
  renderSongs(list);
});

document.querySelectorAll('#playlistList li').forEach(li=>{
  li.addEventListener('click',()=>{
    const pl=li.dataset.pl;
    let list;
    if(pl==='all'){list=SONGS.slice();$('sectionTitle').textContent='Semua Lagu'}
    else if(pl==='fav'){list=SONGS.filter(s=>favs.includes(s.id));$('sectionTitle').textContent='Favorit'}
    else if(pl==='recent'){list=recent.map(id=>SONGS.find(s=>s.id===id)).filter(Boolean);$('sectionTitle').textContent='Terbaru'}
    renderSongs(list);
  });
});

document.addEventListener('DOMContentLoaded',()=>{
  runBoot();
  const last=localStorage.getItem('vinzx_last_user');
  if(last)$('loginUser').value=last;
});