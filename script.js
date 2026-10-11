// ============================================
// VINZXCYY MUSIC - SCRIPT FINAL v9.0
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

// LINK VIDEO INTRO (dari catbox)
const INTRO_URL='https://files.catbox.moe/6l1huu.mp4';

let idx=0,playing=false,shuffle=false,repeat=false;
let user=null,favs=[],recent=[],currentGenre='all';

const $=id=>document.getElementById(id);

// INIT
document.addEventListener('DOMContentLoaded',()=>{
  const last=localStorage.getItem('vinzx_last_user');
  if(last&&$('loginUser'))$('loginUser').value=last;
  initParticles();
  cycleStatus();
  bindEvents();
});

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
  const stack=$('toastStack');if(!stack)return;
  const t=document.createElement('div');
  t.className='toast '+type;
  t.textContent=msg;
  stack.appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},3000);
}

function shake(){
  const panel=$('loginPanel');if(!panel)return;
  panel.classList.remove('shake');
  void panel.offsetWidth;
  panel.classList.add('shake');
}

// ============ BIND EVENTS ============
function bindEvents(){
  // TAB SWITCH
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      const tab=btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
      const slider=$('tabSlider');
      if(tab==='login'){
        $('loginForm').classList.add('active');
        if($('loginMsg')){$('loginMsg').textContent='';$('loginMsg').className='panel-msg'}
        if(slider)slider.classList.remove('right');
      }else if(tab==='register'){
        $('registerForm').classList.add('active');
        if($('regMsg')){$('regMsg').textContent='';$('regMsg').className='panel-msg'}
        if(slider)slider.classList.add('right');
      }
    });
  });

  // REGISTER
  const regForm=$('registerForm');
  if(regForm){
    regForm.addEventListener('submit',e=>{
      e.preventDefault();
      e.stopPropagation();
      const u=$('regUser').value.trim();
      const p=$('regPass').value;
      const p2=$('regPass2').value;
      const msg=$('regMsg');
      if(!u||u.length<3){msg.className='panel-msg err';msg.textContent='Username minimal 3 karakter';shake();return}
      if(!p||p.length<6){msg.className='panel-msg err';msg.textContent='Password minimal 6 karakter';shake();return}
      if(p!==p2){msg.className='panel-msg err';msg.textContent='Konfirmasi tidak cocok';shake();return}
      const users=JSON.parse(localStorage.getItem('vinzx_users')||'{}');
      if(users[u]){msg.className='panel-msg err';msg.textContent='Username sudah terdaftar';shake();return}
      users[u]=btoa(p);
      localStorage.setItem('vinzx_users',JSON.stringify(users));
      msg.className='panel-msg ok';
      msg.textContent='Akun berhasil dibuat';
      toast('Selamat bergabung, '+u);
      setTimeout(()=>{
        const loginTab=document.querySelector('[data-tab="login"]');
        if(loginTab)loginTab.click();
        $('loginUser').value=u;
        $('regUser').value='';$('regPass').value='';$('regPass2').value='';
      },1200);
    });
  }

  // LOGIN
  const logForm=$('loginForm');
  if(logForm){
    logForm.addEventListener('submit',e=>{
      e.preventDefault();
      e.stopPropagation();
      const u=$('loginUser').value.trim();
      const p=$('loginPass').value;
      const msg=$('loginMsg');
      if(!u||!p){msg.className='panel-msg err';msg.textContent='Isi username dan password';shake();return}
      const users=JSON.parse(localStorage.getItem('vinzx_users')||'{}');
      if(!users[u]){msg.className='panel-msg err';msg.textContent='Username tidak ditemukan';shake();return}
      if(atob(users[u])!==p){msg.className='panel-msg err';msg.textContent='Password salah';shake();return}
      user=u;
      msg.className='panel-msg ok';
      msg.textContent='Login berhasil';
      $('loginPanel').classList.add('success');
      setTimeout(()=>{$('loginPass').value=''},100);
      setTimeout(()=>startLoginFlow(u),600);
    });
  }

  // LOGOUT
  const lo=$('logoutBtn');
  if(lo)lo.addEventListener('click',logout);

  // PLAYER
  const pb=$('playBtn');if(pb)pb.addEventListener('click',togglePlay);
  const pv=$('prevBtn');if(pv)pv.addEventListener('click',prevSong);
  const nx=$('nextBtn');if(nx)nx.addEventListener('click',nextSong);
  const sh=$('shuffleBtn');if(sh)sh.addEventListener('click',()=>{shuffle=!shuffle;sh.classList.toggle('active',shuffle);toast(shuffle?'Shuffle aktif':'Shuffle nonaktif')});
  const rp=$('repeatBtn');if(rp)rp.addEventListener('click',()=>{repeat=!repeat;rp.classList.toggle('active',repeat);toast(repeat?'Repeat aktif':'Repeat nonaktif')});

  const prog=$('progressBar');
  if(prog)prog.addEventListener('input',()=>{
    const a=$('audioEl');
    if(!a.duration)return;
    a.currentTime=(prog.value/100)*a.duration;
  });
  const vol=$('volumeBar');
  if(vol)vol.addEventListener('input',()=>{
    const a=$('audioEl');
    a.volume=vol.value/100;
    localStorage.setItem('vinzx_volume',vol.value);
    updateVolIcon();
  });
  const vi=$('volIcon');
  if(vi)vi.addEventListener('click',()=>{
    const a=$('audioEl');
    const v=a.volume>0?0:0.7;
    a.volume=v;vol.value=v*100;
    localStorage.setItem('vinzx_volume',vol.value);
    updateVolIcon();
  });

  // SEARCH
  const si=$('searchInput');
  if(si)si.addEventListener('input',()=>{applyFilter()});

  // CHIP FILTER
  document.querySelectorAll('.chip').forEach(chip=>{
    chip.addEventListener('click',e=>{
      e.preventDefault();
      document.querySelectorAll('.chip').forEach(c=>c.classList.remove('active'));
      chip.classList.add('active');
      currentGenre=chip.dataset.genre;
      applyFilter();
    });
  });

  // PLAYLIST
  document.querySelectorAll('#playlistList li').forEach(li=>{
    li.addEventListener('click',()=>{
      const pl=li.dataset.pl;
      let list;
      if(pl==='all'){list=SONGS.slice();if($('sectionTitle'))$('sectionTitle').textContent='Semua Lagu'}
      else if(pl==='fav'){list=SONGS.filter(s=>favs.includes(s.id));if($('sectionTitle'))$('sectionTitle').textContent='Favorit'}
      else if(pl==='recent'){list=recent.map(id=>SONGS.find(s=>s.id===id)).filter(Boolean);if($('sectionTitle'))$('sectionTitle').textContent='Terbaru'}
      renderSongs(list);
    });
  });

  // AUDIO
  const a=$('audioEl');
  if(a){
    a.addEventListener('timeupdate',()=>{
      if(!a.duration)return;
      const pb2=$('progressBar');if(pb2)pb2.value=(a.currentTime/a.duration)*100;
      const ct=$('curTime');if(ct)ct.textContent=fmt(a.currentTime);
      const dt=$('durTime');if(dt)dt.textContent=fmt(a.duration);
    });
    a.addEventListener('ended',()=>{if(repeat){a.currentTime=0;a.play()}else nextSong()});
    a.addEventListener('error',()=>{
      const na=$('npArtist');if(na)na.textContent='File tidak tersedia';
      playing=false;updatePlayBtn();
    });
    a.addEventListener('loadedmetadata',()=>{
      const dt=$('durTime');if(dt)dt.textContent=fmt(a.duration);
    });
  }

  // SKIP INTRO
  const sk=$('skipIntro');
  if(sk)sk.addEventListener('click',()=>{
    const s=$('introScreen');
    if(s){s.style.opacity='0';s.style.transition='opacity .5s';setTimeout(()=>{s.classList.add('hidden');s.style.opacity='1';showLoader(user)},500)}
  });
}

// ============ LOGIN FLOW ============
function startLoginFlow(u){
  $('loginPanel').classList.add('hidden');
  const ws=$('welcomeScreen');
  const wn=$('welcomeName');
  if(wn)wn.textContent=u;
  if(ws)ws.classList.remove('hidden');
  setTimeout(()=>{
    if(ws)ws.classList.add('hidden');
    playIntro(u);
  },2500);
}

function playIntro(u){
  const introScreen=$('introScreen');
  const introVideo=$('introVideo');
  if(!introScreen){showLoader(u);return}
  if(introVideo){
    let src=introVideo.querySelector('source');
    if(!src){src=document.createElement('source');src.type='video/mp4';introVideo.appendChild(src)}
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
      if(introVideo.duration>10)setTimeout(finishIntro,10000);
    },{once:true});
    introVideo.addEventListener('error',()=>{console.log('Intro error');setTimeout(finishIntro,500)},{once:true});
    introVideo.muted=false;
introVideo.volume=1.0;
introVideo.play().catch(()=>{introVideo.muted=true;introVideo.play().catch(()=>setTimeout(finishIntro,800))});
    setTimeout(()=>{if(!introDone&&introVideo.readyState===0)finishIntro()},6000);
  }else{setTimeout(finishIntro,800)}
}

function showLoader(u){
  const hl=$('hackLoader');if(hl)hl.classList.remove('hidden');
  const lines=[
    {el:'t1',t:'  Memuat profil '+u+'...'},
    {el:'t2',t:'  Menyiapkan library...'},
    {el:'t3',t:'  Menghubungkan audio...'},
    {el:'t4',t:'  Sinkronisasi data...'},
    {el:'t5',t:'  Hampir selesai...'},
    {el:'t6',t:'  Siap ✓'}
  ];
  let i=0;const bar=$('hackBar');
  function next(){
    if(i>=lines.length){setTimeout(()=>enterAppFinal(u),600);return}
    const o=lines[i];let j=0;
    const tm=setInterval(()=>{
      const target=$(o.el);
      if(target)target.textContent=o.t.substring(0,j++);
      if(j>o.t.length){clearInterval(tm);i++;if(bar)bar.style.width=((i/lines.length)*100)+'%';setTimeout(next,150)}
    },16);
  }
  next();
}

function enterAppFinal(u){
  const hl=$('hackLoader');if(hl)hl.classList.add('hidden');
  const ls=$('loginScreen');if(ls)ls.classList.add('hidden');
  const ma=$('mainApp');if(ma)ma.classList.remove('hidden');
  user=u;
  const ua=$('userAvatar');if(ua)ua.textContent=u[0].toUpperCase();
  const wu=$('welcomeUser');if(wu)wu.innerHTML=u+'<small>Session Aktif</small>';
  const hn=$('heroName');if(hn)hn.textContent=u;
  localStorage.setItem('vinzx_last_user',u);
  favs=JSON.parse(localStorage.getItem('vinzx_fav_'+u)||'[]');
  recent=JSON.parse(localStorage.getItem('vinzx_recent_'+u)||'[]');
  renderSongs(SONGS);
  loadVolume();
  updateStats();
  toast('Selamat datang, '+u);
}

function logout(){
  if(!confirm('Yakin mau keluar, '+user+'?'))return;
  const a=$('audioEl');if(a){a.pause();a.src=''}
  user=null;playing=false;
  const ma=$('mainApp');if(ma)ma.classList.add('hidden');
  const ls=$('loginScreen');if(ls)ls.classList.remove('hidden');
  const lp=$('loginPanel');if(lp)lp.classList.remove('hidden','success');
  const lf=$('loginForm');if(lf)lf.reset();
  const rf=$('registerForm');if(rf)rf.reset();
  const lm=$('loginMsg');if(lm)lm.textContent='';
  const rm=$('regMsg');if(rm)rm.textContent='';
  updatePlayBtn();
}

// ============ COVER ============
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

// ============ RENDER ============
function renderSongs(list){
  const songList=$('songList');if(!songList)return;
  songList.innerHTML='';
  const sc=$('sectionCount');if(sc)sc.textContent=list.length+' lagu';
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
  idx=i;
  const s=SONGS[idx];
  const a=$('audioEl');
  a.src=s.src;
  const nt=$('npTitle');if(nt)nt.textContent=s.title;
  const na=$('npArtist');if(na)na.textContent=s.artist;
  const pc=$('playerCover');if(pc)pc.innerHTML='<img src="'+generateCover(s.title)+'" alt="">';
  document.querySelectorAll('.song-card').forEach(c=>c.classList.toggle('playing',Number(c.dataset.id)===SONGS[idx].id));
  a.play().then(()=>{
    playing=true;updatePlayBtn();
    recent=recent.filter(x=>x!==id);
    recent.unshift(id);recent=recent.slice(0,10);
    if(user)localStorage.setItem('vinzx_recent_'+user,JSON.stringify(recent));
    updateStats();
  }).catch(err=>{console.warn(err);playing=false;updatePlayBtn();toast('Gagal memutar','err')});
}

function togglePlay(){
  const a=$('audioEl');
  if(!a.src){playById(SONGS[idx].id);return}
  if(a.paused){a.play().then(()=>{playing=true;updatePlayBtn()})}
  else{a.pause();playing=false;updatePlayBtn()}
}
function updatePlayBtn(){const p=$('playBtn');if(p)p.textContent=playing?'❚❚':'▶'}

function prevSong(){
  const a=$('audioEl');
  if(a.currentTime>3){a.currentTime=0;return}
  idx=(idx-1+SONGS.length)%SONGS.length;
  playById(SONGS[idx].id);
}
function nextSong(){
  if(shuffle){let n;do{n=Math.floor(Math.random()*SONGS.length)}while(n===idx&&SONGS.length>1);idx=n}
  else idx=(idx+1)%SONGS.length;
  playById(SONGS[idx].id);
}

// ============ FILTER ============
function applyFilter(){
  const si=$('searchInput');
  const q=(si?si.value:'').toLowerCase().trim();
  let list=SONGS.slice();
  if(currentGenre!=='all')list=list.filter(s=>s.genre===currentGenre);
  if(q)list=list.filter(s=>s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q));
  const st=$('sectionTitle');
  if(st)st.textContent=q?'Hasil Pencarian':(currentGenre==='all'?'Semua Lagu':currentGenre.charAt(0).toUpperCase()+currentGenre.slice(1));
  renderSongs(list);
}

function loadVolume(){
  const v=localStorage.getItem('vinzx_volume')||70;
  const vol=$('volumeBar');
  const a=$('audioEl');
  if(vol)vol.value=v;
  if(a)a.volume=v/100;
  updateVolIcon();
}

function updateVolIcon(){
  const a=$('audioEl');if(!a)return;
  const v=a.volume;
  const el=$('volIcon');
  if(el)el.textContent=v===0?'✕':v<0.5?'◔':'◐';
}

function updateStats(){
  const t=$('statTotal');if(t)t.textContent=SONGS.length;
  const f=$('statFav');if(f)f.textContent=favs.length;
  const r=$('statRecent');if(r)r.textContent=recent.length;
}

function fmt(s){
  if(!isFinite(s))return'0:00';
  const m=Math.floor(s/60),x=Math.floor(s%60);
  return m+':'+(x<10?'0':'')+x;
}