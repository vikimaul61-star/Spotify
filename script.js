const SONGS=[
  {id:1,title:"Lagu Pertama",artist:"VINZXCYY",src:"songs/song1.mp3"},
  {id:2,title:"Lagu Kedua",artist:"VINZXCYY",src:"songs/song2.mp3"},
  {id:3,title:"Lagu Ketiga",artist:"VINZXCYY",src:"songs/song3.mp3"},
  {id:4,title:"Lagu Keempat",artist:"VINZXCYY",src:"songs/song4.mp3"},
  {id:5,title:"Lagu Kelima",artist:"VINZXCYY",src:"songs/song5.mp3"},
  {id:6,title:"Lagu Keenam",artist:"VINZXCYY",src:"songs/song6.mp3"},
  {id:7,title:"Lagu Ketujuh",artist:"VINZXCYY",src:"songs/song7.mp3"},
  {id:8,title:"Lagu Kedelapan",artist:"VINZXCYY",src:"songs/song8.mp3"},
  {id:9,title:"Lagu Kesembilan",artist:"VINZXCYY",src:"songs/song9.mp3"},
  {id:10,title:"Lagu Kesepuluh",artist:"VINZXCYY",src:"songs/song10.mp3"}
];

let currentSongIndex=0,isPlaying=false,isShuffle=false,isRepeat=false;
let currentUser=null,filteredSongs=[...SONGS];
let favorites=[],recent=[];

const $=id=>document.getElementById(id);
const loginScreen=$('loginScreen'),mainApp=$('mainApp'),loginPanel=$('loginPanel');
const loginForm=$('loginForm'),registerForm=$('registerForm');
const loginMsg=$('loginMsg'),regMsg=$('regMsg'),hackLoader=$('hackLoader');
const songList=$('songList'),audioEl=$('audioEl'),playBtn=$('playBtn');
const prevBtn=$('prevBtn'),nextBtn=$('nextBtn'),shuffleBtn=$('shuffleBtn');
const repeatBtn=$('repeatBtn'),progressBar=$('progressBar'),volumeBar=$('volumeBar');
const curTime=$('curTime'),durTime=$('durTime'),npTitle=$('npTitle');
const npArtist=$('npArtist'),playerCover=$('playerCover');
const welcomeUser=$('welcomeUser'),searchInput=$('searchInput');
const toastStack=$('toastStack');

const BOOT_LINES=[
  {t:"VINZXCYY BIOS v2.0.26 (C) 2028",d:200},
  {t:"Memory test .......... 65536 MB OK",d:250,cls:"ok"},
  {t:"Initializing audio subsystem ...........",d:200},
  {t:"Loading kernel modules ........",d:230,cls:"ok"},
  {t:"Mounting /songs ......... 10 files found",d:250,cls:"ok"},
  {t:"Connecting to VINZXCYY mainframe ......",d:300},
  {t:"Encrypted tunnel established ..........",d:250,cls:"ok"},
  {t:"Scanning for threats .......... 0 detected",d:230,cls:"ok"},
  {t:"WARNING: unauthorized user detected",d:400,cls:"warn"},
  {t:"Awaiting authentication ..........",d:350,cls:"err"}
];

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

async function runBoot(){
  const boot=$('bootScreen');
  for(let i=0;i<BOOT_LINES.length;i++){
    const line=BOOT_LINES[i];
    const el=document.createElement('div');
    el.className='boot-line '+(line.cls||'');
    el.textContent='> '+line.t;
    boot.appendChild(el);
    await sleep(line.d);
  }
  const cursor=document.createElement('div');
  cursor.innerHTML='> <span class="boot-cursor"></span>';
  boot.appendChild(cursor);
  await sleep(600);
  boot.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  initMatrix();
  cycleStatus();
}

const STATUS_MSGS=["Menginisialisasi koneksi...","Enkripsi AES-256 aktif.","Menunggu kredensial...","Sistem siap menerima perintah."];
function cycleStatus(){
  const el=$('panelStatus');let i=0;
  function tick(){el.textContent=STATUS_MSGS[i];i=(i+1)%STATUS_MSGS.length;setTimeout(tick,2500)}
  tick();
}

function initMatrix(){
  const canvas=$('matrixCanvas');if(!canvas)return;
  const ctx=canvas.getContext('2d');
  function resize(){canvas.width=innerWidth;canvas.height=innerHeight}
  resize();addEventListener('resize',resize);
  const chars='アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ☠⚠☣♥♦◊';
  const fontSize=14,columns=Math.floor(canvas.width/fontSize);
  const drops=new Array(columns).fill(1);
  setInterval(()=>{
    ctx.fillStyle='rgba(0,0,0,0.08)';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.font=fontSize+'px monospace';
    for(let i=0;i<drops.length;i++){
      const ch=chars[Math.floor(Math.random()*chars.length)];
      ctx.fillStyle=Math.random()>0.92?'#ffffff':'#ff0033';
      ctx.fillText(ch,i*fontSize,drops[i]*fontSize);
      if(drops[i]*fontSize>canvas.height&&Math.random()>0.975)drops[i]=0;
      drops[i]++;
    }
  },42);
}

function toast(msg,type='info',dur=3000){
  const t=document.createElement('div');
  t.className='toast '+type;
  t.textContent=msg;
  toastStack.appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},dur);
}

document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
    btn.classList.add('active');
    (btn.dataset.tab==='login'?loginForm:registerForm).classList.add('active');
    loginMsg.textContent='';regMsg.textContent='';
  });
});

registerForm.addEventListener('submit',e=>{
  e.preventDefault();
  const user=$('regUser').value.trim();
  const pass=$('regPass').value;
  const pass2=$('regPass2').value;
  if(user.length<3){regMsg.className='panel-msg err';regMsg.textContent='✕ Username minimal 3 karakter.';shakePanel();return}
  if(pass.length<6){regMsg.className='panel-msg err';regMsg.textContent='✕ Password minimal 6 karakter.';shakePanel();return}
  if(pass!==pass2){regMsg.className='panel-msg err';regMsg.textContent='✕ Konfirmasi tidak cocok.';shakePanel();return}
  const users=JSON.parse(localStorage.getItem('vinzx_users')||'{}');
  if(users[user]){regMsg.className='panel-msg err';regMsg.textContent='✕ Username sudah terdaftar.';shakePanel();return}
  users[user]=btoa(pass);
  localStorage.setItem('vinzx_users',JSON.stringify(users));
  regMsg.className='panel-msg ok';
  regMsg.textContent='✓ Akun dibuat. Silakan masuk.';
  toast('Akun berhasil dibuat','info');
  setTimeout(()=>{
    document.querySelector('[data-tab="login"]').click();
    $('loginUser').value=user;
    regMsg.className='panel-msg';regMsg.textContent='';
    $('regUser').value='';$('regPass').value='';$('regPass2').value='';
  },1400);
});

loginForm.addEventListener('submit',e=>{
  e.preventDefault();
  const user=$('loginUser').value.trim();
  const pass=$('loginPass').value;
  const users=JSON.parse(localStorage.getItem('vinzx_users')||'{}');
  if(!users[user]||atob(users[user])!==pass){
    loginMsg.className='panel-msg err';
    loginMsg.textContent='✕ Kredensial tidak valid.';
    shakePanel();return;
  }
  currentUser=user;
  loginMsg.className='panel-msg ok';
  loginMsg.textContent='✓ Terverifikasi. Memuat sistem...';
  loginPanel.classList.add('success');
  setTimeout(()=>runHack(user),400);
});

function shakePanel(){loginPanel.classList.remove('shake');void loginPanel.offsetWidth;loginPanel.classList.add('shake')}

function runHack(user){
  loginPanel.classList.add('hidden');
  hackLoader.classList.remove('hidden');
  const lines=[
    {el:'t1',text:'> Membuka jalur ke mainframe...'},
    {el:'t2',text:'> Memverifikasi identitas: '+user},
    {el:'t3',text:'> Mendekripsi vault pengguna...'},
    {el:'t4',text:'> Memuat database musik...'},
    {el:'t5',text:'> Sinkronisasi playlist...'},
    {el:'t6',text:'> AKSES DIBERIKAN ☠'}
  ];
  let i=0;const bar=$('hackBar');
  function next(){
    if(i>=lines.length){setTimeout(enterApp,900);return}
    const obj=lines[i];let j=0;
    const target=$(obj.el);
    const tm=setInterval(()=>{
      target.textContent=obj.text.substring(0,j++);
      if(j>obj.text.length){clearInterval(tm);i++;bar.style.width=((i/lines.length)*100)+'%';setTimeout(next,220)}
    },18);
  }
  next();
}

function enterApp(){
  hackLoader.classList.add('hidden');
  loginScreen.classList.add('hidden');
  mainApp.classList.remove('hidden');
  $('userAvatar').textContent=currentUser[0].toUpperCase();
  welcomeUser.innerHTML=currentUser+'<small>SESSION · AKTIF</small>';
  localStorage.setItem('vinzx_last_user',currentUser);
  favorites=JSON.parse(localStorage.getItem('vinzx_fav_'+(currentUser||'guest'))||'[]');
  recent=JSON.parse(localStorage.getItem('vinzx_recent_'+(currentUser||'guest'))||'[]');
  renderSongs(SONGS);
  setupAudio();
  loadVolume();
  toast('Selamat datang, '+currentUser,'info');
}

$('logoutBtn').addEventListener('click',()=>{
  if(!confirm('Yakin logout, '+currentUser+'?'))return;
  audioEl.pause();audioEl.src='';
  currentUser=null;isPlaying=false;
  mainApp.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  loginPanel.classList.remove('hidden','success');
  loginForm.reset();registerForm.reset();
  loginMsg.textContent='';regMsg.textContent='';
  updatePlayBtn();
});

function generateCover(title){
  const palettes=[['#ff0033','#8b0000'],['#1db954','#0a3d1f'],['#00fff0','#004d4a'],['#a855f7','#4c1d95'],['#ff8800','#7c2d12'],['#ec4899','#831843'],['#3b82f6','#1e3a8a'],['#14b8a6','#134e4a']];
  const idx=title.charCodeAt(0)%palettes.length;
  const c1=palettes[idx][0],c2=palettes[idx][1];
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='"+encodeURIComponent(c1)+"'/><stop offset='100%' stop-color='"+encodeURIComponent(c2)+"'/></linearGradient></defs><rect width='200' height='200' fill='url(%23g)'/><text x='100' y='130' font-size='90' font-weight='900' font-family='monospace' text-anchor='middle' fill='white' opacity='0.95'>"+encodeURIComponent(title[0].toUpperCase())+"</text></svg>";
}

function renderSongs(list){
  songList.innerHTML='';
  $('sectionCount').textContent=list.length+' lagu';
  if(!list.length){
    songList.innerHTML='<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-mute);font-size:12px;">— tidak ada lagu —</p>';
    return;
  }
  list.forEach(song=>{
    const card=document.createElement('div');
    card.className='song-card';
    card.dataset.id=song.id;
    if(SONGS[currentSongIndex].id===song.id)card.classList.add('playing');
    const isFav=favorites.includes(song.id);
    card.innerHTML='<div class="song-cover"><img src="'+generateCover(song.title)+'" alt=""></div><div class="song-title">'+escapeHtml(song.title)+'</div><div class="song-artist">'+escapeHtml(song.artist)+'</div>'+(isFav?'<div style="margin-top:4px;font-size:9px;color:var(--red)">FAVORIT</div>':'');
    card.addEventListener('click',()=>playSongById(song.id));
    songList.appendChild(card);
  });
}

function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function playSongById(id){
  const idx=SONGS.findIndex(s=>s.id===id);
  if(idx===-1)return;
  currentSongIndex=idx;
  loadSong();
  audioEl.play().then(()=>{
    isPlaying=true;updatePlayBtn();
    recent=recent.filter(x=>x!==id);
    recent.unshift(id);recent=recent.slice(0,10);
    localStorage.setItem('vinzx_recent_'+(currentUser||'guest'),JSON.stringify(recent));
  }).catch(err=>{
    console.warn(err);isPlaying=false;updatePlayBtn();
    toast('Gagal memutar audio','err');
  });
}

function loadSong(){
  const song=SONGS[currentSongIndex];
  audioEl.src=song.src;
  npTitle.textContent=song.title;
  npArtist.textContent=song.artist;
  playerCover.innerHTML='<img src="'+generateCover(song.title)+'" alt="">';
  document.querySelectorAll('.song-card').forEach(c=>c.classList.toggle('playing',Number(c.dataset.id)===SONGS[currentSongIndex].id));
}

function setupAudio(){
  audioEl.addEventListener('timeupdate',()=>{
    if(!audioEl.duration)return;
    progressBar.value=(audioEl.currentTime/audioEl.duration)*100;
    curTime.textContent=fmtTime(audioEl.currentTime);
    durTime.textContent=fmtTime(audioEl.duration);
  });
  audioEl.addEventListener('ended',()=>{
    if(isRepeat){audioEl.currentTime=0;audioEl.play()}
    else nextSong();
  });
  audioEl.addEventListener('error',()=>{
    npArtist.textContent='⚠ file tidak tersedia';
    isPlaying=false;updatePlayBtn();
  });
}
function fmtTime(s){if(!isFinite(s))return'0:00';const m=Math.floor(s/60),x=Math.floor(s%60);return m+':'+(x<10?'0':'')+x}

playBtn.addEventListener('click',()=>{
  if(!audioEl.src){playSongById(SONGS[currentSongIndex].id);return}
  if(audioEl.paused){audioEl.play().then(()=>{isPlaying=true;updatePlayBtn()})}
  else{audioEl.pause();isPlaying=false;updatePlayBtn()}
});
function updatePlayBtn(){playBtn.textContent=isPlaying?'❚❚':'▶'}

prevBtn.addEventListener('click',()=>{
  if(audioEl.currentTime>3){audioEl.currentTime=0;return}
  currentSongIndex=(currentSongIndex-1+SONGS.length)%SONGS.length;
  loadSong();audioEl.play().then(()=>{isPlaying=true;updatePlayBtn()});
});

nextBtn.addEventListener('click',nextSong);
function nextSong(){
  if(isShuffle){
    let n;do{n=Math.floor(Math.random()*SONGS.length)}while(n===currentSongIndex&&SONGS.length>1);
    currentSongIndex=n;
  }else currentSongIndex=(currentSongIndex+1)%SONGS.length;
  loadSong();
  audioEl.play().then(()=>{isPlaying=true;updatePlayBtn()});
}

shuffleBtn.addEventListener('click',()=>{isShuffle=!isShuffle;shuffleBtn.classList.toggle('active',isShuffle);toast('Shuffle '+(isShuffle?'aktif':'mati'),'info',1500)});
repeatBtn.addEventListener('click',()=>{isRepeat=!isRepeat;repeatBtn.classList.toggle('active',isRepeat);toast('Repeat '+(isRepeat?'aktif':'mati'),'info',1500)});

progressBar.addEventListener('input',()=>{
  if(!audioEl.duration)return;
  audioEl.currentTime=(progressBar.value/100)*audioEl.duration;
});

volumeBar.addEventListener('input',()=>{
  audioEl.volume=volumeBar.value/100;
  localStorage.setItem('vinzx_volume',volumeBar.value);
  updateVolIcon();
});
$('volIcon').addEventListener('click',()=>{
  const v=audioEl.volume>0?0:0.7;
  audioEl.volume=v;volumeBar.value=v*100;
  localStorage.setItem('vinzx_volume',volumeBar.value);
  updateVolIcon();
});
function updateVolIcon(){const v=audioEl.volume;$('volIcon').textContent=v===0?'✕':v<0.5?'◔':'◐'}
function loadVolume(){const v=localStorage.getItem('vinzx_volume')||70;volumeBar.value=v;audioEl.volume=v/100;updateVolIcon()}

searchInput.addEventListener('input',()=>{
  const q=searchInput.value.toLowerCase().trim();
  const list=q?SONGS.filter(s=>s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q)):[...SONGS];
  filteredSongs=list;
  $('sectionTitle').textContent=q?'Hasil Pencarian':'Semua Lagu';
  renderSongs(list);
});

document.querySelectorAll('#playlistList li').forEach(li=>{
  li.addEventListener('click',()=>{
    const pl=li.dataset.pl;
        if(pl==='all'){filteredSongs=[...SONGS];$('sectionTitle').textContent='Semua Lagu'}
    else if(pl==='fav'){filteredSongs=SONGS.filter(s=>favorites.includes(s.id));$('sectionTitle').textContent='Favorit'}
    else if(pl==='recent'){filteredSongs=recent.map(id=>SONGS.find(s=>s.id===id)).filter(Boolean);$('sectionTitle').textContent='Terbaru'}
    renderSongs(filteredSongs);
  });
});

document.addEventListener('DOMContentLoaded',()=>{
  runBoot();
  const last=localStorage.getItem('vinzx_last_user');
  if(last)$('loginUser').value=last;
  setInterval(cycleStatus,9000);
});