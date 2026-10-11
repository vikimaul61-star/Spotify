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

const BOOT=[
  "VINZXCYY Music v5.0",
  "Initializing audio system ...",
  "Loading library ...",
  "Connecting to server ...",
  "Secure connection established",
  "Ready"
];

const STATUS=[
  "Memuat sistem...",
  "Siap menerima input...",
  "Menunggu autentikasi...",
  "Selamat datang kembali"
];

function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

function runBoot(){
  loginScreen.classList.remove('hidden');
  initParticles();
  cycleStatus();
}

function cycleStatus(){
  const el=$('panelStatus');if(!el)return;
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
  setTimeout(()=>runHack(u),400);
});

function shake(){
  loginPanel.classList.remove('shake');
  void loginPanel.offsetWidth;
  loginPanel.classList.add('shake');
}

function runHack(u){
  loginPanel.classList.add('hidden');
  const welcomeScreen=$('welcomeScreen');
  const welcomeName=$('welcomeName');
  welcomeName.textContent=u;
  welcomeScreen.classList.remove('hidden');
  setTimeout(()=>{
    welcomeScreen.classList.add('hidden');
    playIntroVideo(u);
  },2500);
}

function playIntroVideo(u){
  const introScreen=$('introScreen');
  const introVideo=$('introVideo');
  const skipBtn=$('skipIntro');
  introScreen.classList.remove('hidden');
  introVideo.currentTime=0;
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
  introVideo.addEventListener('ended',finishIntro,{once:true});
  introVideo.addEventListener('loadedmetadata',()=>{
    if(introVideo.duration>8)setTimeout(finishIntro,8000);
  },{once:true});
  skipBtn.onclick=finishIntro;
  introVideo.addEventListener('error',()=>{
    console.log('Intro video error, skip');
    setTimeout(finishIntro,500);
  },{once:true});
  introVideo.play().catch(()=>{
    setTimeout(finishIntro,1000);
  });
  setTimeout(()=>{if(!introDone && introVideo.readyState===0)finishIntro()},3500);
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
    if(i>=lines.length){setTimeout(()=>enterAppFinal(u),700);return}
    const o=lines[i];let j=0;
    const tm=setInterval(()=>{
      $(o.el).textContent=o.t.substring(0,j++);
      if(j>o.t.length){
        clearInterval(tm);i++;
        bar.style.width=((i/lines.length)*100)+'%';
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
  const heroName=$('heroName');
  if(heroName)heroName.textContent=u;
  localStorage.setItem('vinzx_last_user',u);
  favs=JSON.parse(localStorage.getItem('vinzx_fav_'+u)||'[]');
  recent=JSON.parse(localStorage.getItem('vinzx_recent_'+u)||'[]');
  renderSongs(SONGS);
  setupAudio();
  loadVolume();
  toast('Selamat datang, '+u);
}