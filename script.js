// ============================================
// VINZXCYY MUSIC - SCRIPT v7.0 FINAL
// ============================================

const SONGS=[
  {id:1,title:"Hujan Malam",artist:"VINZXCYY",src:"songs/song1.mp3",genre:"galau"},
  {id:2,title:"Rindu Senja",artist:"VINZXCYY",src:"songs/song2.mp3",genre:"santai"},
  {id:3,title:"Cahaya Pagi",artist:"VINZXCYY",src:"songs/song3.mp3",genre:"semangat"},
  {id:4,title:"Badai Hati",artist:"VINZXCYY",src:"songs/song4.mp3",genre:"galau"},
  {id:5,title:"Sunyi Kota",artist:"VINZXCYY",src:"songs/song5.mp3",genre:"santai"},
  {id:6,title:"Langkah Kaki",artist:"VINZXCYY",src:"songs/song6.mp3",genre:"semangat"},
  {id:7,title:"Bayang Semu",artist:"VINZXCYY",src:"songs/song7.mp3",genre:"hacker"},
  {id:8,title:"Embun Pagi",artist:"VINZXCYY",src:"songs/song8.mp3",genre:"santai"},
  {id:9,title:"Cinta Terakhir",artist:"VINZXCYY",src:"songs/song9.mp3",genre:"galau"},
  {id:10,title:"Jejak Waktu",artist:"VINZXCYY",src:"songs/song10.mp3",genre:"semangat"}
];

let idx=0,playing=false,shuffle=false,repeat=false;
let user=null,favs=[],recent=[],currentGenre='all';

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

// ============ INIT ============
document.addEventListener('DOMContentLoaded',()=>{
  const last=localStorage.getItem('vinzx_last_user');
  if(last)$('loginUser').value=last;
  loginScreen.classList.remove('hidden');
  initParticles();
  cycleStatus();
});

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

function cycleStatus(){
  const el=$('panelStatus');if(!el)return;
  const STATUS=["Memuat sistem...","Siap menerima input...","Menunggu autentikasi...","Selamat datang kembali"];
  let i=0;
  function tick(){el.textContent=STATUS[i];i=(i+1)%STATUS.length;setTimeout(tick,2500)}
  tick();
}

function initParticles(){
  const wrap=$('particles');if(!wrap)return;
  wrap.innerHTML='';
  for(let i=0;i<40;i++){
    const p=document.createElement('div');
    p.className='particle';
    p.style.left=Math.random()*100+'%';
    p.style.animationDuration=(10+Math.random()*15)+'s';
    p.style.animationDelay=(Math.random()*15)+'s';
    p.style.opacity=(0.15+Math.random()*0.5);
    const size=(1+Math.random()*2)+'px';
    p.style.width=size;
    p.style.height=size;
    wrap.appendChild(p);
  }
}

function toast(msg,type){
  type=type||'info';
  const t=document.createElement('div');
  t.className='toast '+type;
  t.textContent=msg;
  toastStack.appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},3000);
}

// ============ TAB SWITCH ============
document.querySelectorAll('.tab-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
    btn.classList.add('active');
    const slider=document.getElementById('tabSlider');
    if(slider)slider.classList.toggle('right',btn.dataset.tab==='register');
    if(btn.dataset.tab==='login'){loginForm.classList.add('active');loginMsg.textContent=''}
    else{registerForm.classList.add('active');regMsg.textContent=''}
  });
});

// ============ REGISTER ============
registerForm.addEventListener('submit',e=>{
  e.preventDefault();
  const u=$('regUser').value.trim(),p=$('regPass').value,p2=$('regPass2').value;
  if(u.length<3){regMsg.className='panel-msg err';regMsg.textContent='Username minimal 3 karakter';shake();return}
  if(p.length<6){regMsg.className='panel-msg err';regMsg.textContent='Password minimal 6 karakter';shake();return}
  if(p!==p2){regMsg.className='panel-msg err';regMsg.textContent='Konfirmasi tidak cocok';shake();return}
  const users=JSON.parse(localStorage.getItem('vinzx_users')||'{}');
  if(users[u]){regMsg.className='panel-msg err';regMsg.textContent='Username sudah terdaftar';shake();return}
  users[u]=btoa(p);
  localStorage.setItem('vinzx_users',JSON.stringify(users));
  regMsg.className='panel-msg ok';
  regMsg.textContent='Akun berhasil dibuat';
  toast('Selamat bergabung, '+u);
  setTimeout(()=>{
    document.querySelector('[data-tab="login"]').click();
    $('loginUser').value=u;
    regMsg.className='panel-msg';regMsg.textContent='';
    $('regUser').value='';$('regPass').value='';$('regPass2').value='';
  },1400);
});

// ============ LOGIN ============
loginForm.addEventListener('submit',e=>{
  e.preventDefault();
  const u=$('loginUser').value.trim(),p=$('loginPass').value;
  const users=JSON.parse(localStorage.getItem('vinzx_users')||'{}');
  if(!users[u]||atob(users[u])!==p){
    loginMsg.className='panel-msg err';
    loginMsg.textContent='Username atau password salah';
    shake();return;
  }
  user=u;
  loginMsg.className='panel-msg ok';
  loginMsg.textContent='Login berhasil';
  loginPanel.classList.add('success');
  setTimeout(()=>startLoginFlow(u),500);
});

function shake(){
  loginPanel.classList.remove('shake');
  void loginPanel.offsetWidth;
  loginPanel.classList.add('shake');
}

// ============ LOGIN FLOW: WELCOME → INTRO → MAIN ============
function startLoginFlow(u){
  // 1. Sembunyikan login
  loginPanel.classList.add('hidden');
  
  // 2. Tampilkan WELCOME
  const ws=$('welcomeScreen');
  const wn=$('welcomeName');
  if(wn)wn.textContent=u;
  if(ws)ws.classList.remove('hidden');
  
  // 3. Setelah 2.5 detik → INTRO VIDEO
  setTimeout(()=>{
    if(ws)ws.classList.add('hidden');
    playIntro(u);
  },2500);
}

function playIntro(u){
  const introScreen=$('introScreen');
  const introVideo=$('introVideo');
  const skipBtn=$('skipIntro');
  
  if(!introScreen){showLoader(u);return}
  
  const INTRO_URL='https://files.catbox.moe/6l1huu.mp4';
  
  if(introVideo){
    let src=introVideo.querySelector('source');
    if(!src){
      src=document.createElement('source');
      src.type='video/mp4';
      introVideo.appendChild(src);
    }
    src.src=INTRO_URL;
    introVideo.load();
    introVideo.currentTime=0;
  }
  
  introScreen.classList.remove('hidden');
  
  let introDone=false;
  function finishIntro(){
    if(introDone)return;
    introDone=true;
    introScreen.style.opacity='0';
    introScreen.style.transition='opacity .5s';
    setTimeout(()=>{
      introScreen.classList.add('hidden');
      introScreen.style.opacity='1';
      showLoader(u);
    },500);
  }
  
  if(introVideo){
    introVideo.addEventListener('ended',finishIntro,{once:true});
    introVideo.addEventListener('loadedmetadata',()=>{
      if(introVideo.duration>8)setTimeout(finishIntro,8000);
    },{once:true});
    introVideo.addEventListener('error',()=>{
      console.log('Intro error, skip');
      setTimeout(finishIntro,500);
    },{once:true});
    introVideo.play().catch(()=>setTimeout(finishIntro,800));
    setTimeout(()=>{if(!introDone && introVideo.readyState===0)finishIntro()},5000);
  }else{
    setTimeout(finishIntro,800);
  }
  
  if(skipBtn)skipBtn.onclick=finishIntro;
}
  
  // Kalau video selesai
  if(introVideo){
    introVideo.currentTime=0;
    introVideo.addEventListener('ended',finishIntro,{once:true});
    introVideo.addEventListener('loadedmetadata',()=>{
      if(introVideo.duration>8)setTimeout(finishIntro,8000);
    },{once:true});
    introVideo.addEventListener('error',()=>{
      console.log('Intro error, skip');
      setTimeout(finishIntro,500);
    },{once:true});
    introVideo.play().catch(()=>setTimeout(finishIntro,800));
    
    // Fallback 4 detik kalau video gak load
    setTimeout(()=>{if(!introDone && introVideo.readyState===0)finishIntro()},4000);
  }else{
    setTimeout(finishIntro,800);
  }
  
  if(skipBtn)skipBtn.onclick=finishIntro;
}

function showLoader(u){
  hackLoader.classList.remove('hidden');
  const lines=[
    {el:'t1',t:'  Memuat profil '+u+'...'},
    {el:'t2',t:'  Menyiapkan library...'},
    {el:'t3',t:'  Menghubungkan audio...'},
    {el:'t4',t:'  Sinkronisasi data...'},
    {el:'t5',t:'  Hampir selesai...'},
    {el:'t6',t:'  Siap ✓'}
  ];
  let i=0;
  const bar=$('hackBar');
  function next(){
    if(i>=lines.length){setTimeout(()=>enterAppFinal(u),600);return}
    const o=lines[i];let j=0;
    const tm=setInterval(()=>{
      const target=$(o.el);
      if(target)target.textContent=o.t.substring(0,j++);
      if(j>o.t.length){
        clearInterval(tm);i++;
        if(bar)bar.style.width=((i/lines.length)*100)+'%';
        setTimeout(next,150);
      }
    },16);
  }
  next();
}

function enterAppFinal(u){
  hackLoader.classList.add('hidden');
  loginScreen.classList.add('hidden');
  mainApp.classList.remove('hidden');
  
  user=u;
  $('userAvatar').textContent=u[0].toUpperCase();
  welcomeUser.innerHTML=u+'<small>Session Aktif</small>';
  const hn=$('heroName');
  if(hn)hn.textContent=u;
  
  localStorage.setItem('vinzx_last_user',u);
  favs=JSON.parse(localStorage.getItem('vinzx_fav_'+u)||'[]');
  recent=JSON.parse(localStorage.getItem('vinzx_recent_'+u)||'[]');
  
  // RENDER LAGU
  renderSongs(SONGS);
  setupAudio();
  loadVolume();
  updateStats();
  toast('Selamat datang, '+u);
}

// ============ LOGOUT ============
$('logoutBtn').addEventListener('click',()=>{
  if(!confirm('Yakin mau keluar, '+user+'?'))return;
  audio.pause();audio.src='';
  user=null;playing=false;
  mainApp.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  loginPanel.classList.remove('hidden','success');
  loginForm.reset();registerForm.reset();
  loginMsg.textContent='';regMsg.textContent='';
  updatePlayBtn();
});

// ============ COVER GENERATOR ============
function generateCover(title){
  const colors=[
    ['#ff0033','#8b0000'],['#00d4ff','#0066cc'],['#a855f7','#4c1d95'],
    ['#22c55e','#14532d'],['#f59e0b','#78350f'],['#ec4899','#831843'],
    ['#14b8a6','#134e4a'],['#ef4444','#7f1d1d']
  ];
  const i=title.charCodeAt(0)%colors.length;
  const c1=colors[i][0],c2=colors[i][1];
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='"+encodeURIComponent(c1)+"'/><stop offset='100%' stop-color='"+encodeURIComponent(c2)+"'/></linearGradient></defs><rect width='200' height='200' fill='url(%23g)'/><text x='100' y='130' font-size='90' font-weight='900' font-family='Arial,sans-serif' text-anchor='middle' fill='white'>"+encodeURIComponent(title[0].toUpperCase())+"</text></svg>";
}

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

// ============ RENDER SONGS ============
function renderSongs(list){
  if(!songList)return;
  songList.innerHTML='';
  const sc=$('sectionCount');
  if(sc)sc.textContent=list.length+' lagu';
  
  if(!list.length){
    songList.innerHTML='<p style="grid-column:1/-1;text-align:center;padding:40px;color:#7a7a7a;font-size:12px;">Tidak ada lagu</p>';
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

// ============ PLAY ============
function playById(id){
  const i=SONGS.findIndex(s=>s.id===id);
  if(i===-1)return;
  idx=i;loadSong();
  audio.play().then(()=>{
    playing=true;updatePlayBtn();
    recent=recent.filter(x=>x!==id);
    recent.unshift(id);recent=recent.slice(0,10);
    if(user)localStorage.setItem('vinzx_recent_'+user,JSON.stringify(recent));
    updateStats();
  }).catch(err=>{
    console.warn(err);playing=false;updatePlayBtn();
    toast('Gagal memutar','err');
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

function updateStats(){
  const t=$('statTotal');if(t)t.textContent=SONGS.length;
  const f=$('statFav');if(f)f.textContent=favs.length;
  const r=$('statRecent');if(r)r.textContent=recent.length;
}

// ============ AUDIO ============
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
    npArtist.textContent='File tidak tersedia';
    playing=false;updatePlayBtn();
  });
  audio.addEventListener('loadedmetadata',()=>{
    durTime.textContent=fmt(audio.duration);
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

shuffleBtn.addEventListener('click',()=>{shuffle=!shuffle;shuffleBtn.classList.toggle('active',shuffle);toast(shuffle?'Shuffle aktif':'Shuffle nonaktif')});
repeatBtn.addEventListener('click',()=>{repeat=!repeat;repeatBtn.classList.toggle('active',repeat);toast(repeat?'Repeat aktif':'Repeat nonaktif')});

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

// ============ SEARCH ============
searchInput.addEventListener('input',()=>{applyFilter()});

// ============ CHIP FILTER ============
document.querySelectorAll('.chip').forEach(chip=>{
  chip.addEventListener('click',()=>{
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    currentGenre=chip.dataset.genre;
    applyFilter();
  });
});

function applyFilter(){
  const q=(searchInput.value||'').toLowerCase().trim();
  let list=SONGS.slice();
  if(currentGenre!=='all')list=list.filter(s=>s.genre===currentGenre);
  if(q)list=list.filter(s=>s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q));
  const st=$('sectionTitle');
  if(st)st.textContent=q?'Hasil Pencarian':(currentGenre==='all'?'Semua Lagu':currentGenre.charAt(0).toUpperCase()+currentGenre.slice(1));
  renderSongs(list);
}

// ============ PLAYLIST ============
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