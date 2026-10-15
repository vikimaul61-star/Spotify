// ============================================
// VINZXCYY MUSIC - SCRIPT v13.0 SPOTIFY MAX
// 30 FITUR FULL UPGRADE
// ============================================

const LOGO_URL='https://raw.githubusercontent.com/vikimaul61-star/Spotify/main/assets/logo.png';
const INTRO_URL='https://files.catbox.moe/6l1huu.mp4';

const SONGS=[
  {id:1,title:"Lagu 1",artist:"VINZXCYY",src:"https://files.catbox.moe/4rtt8q.mp3",cover:""},
  {id:2,title:"Lagu 2",artist:"VINZXCYY",src:"https://files.catbox.moe/26e2d3.mp3",cover:""},
  {id:3,title:"Lagu 3",artist:"VINZXCYY",src:"https://files.catbox.moe/sobm0s.mp3",cover:""},
  {id:4,title:"Lagu 4",artist:"VINZXCYY",src:"https://files.catbox.moe/hd3vgj.mp3",cover:""},
  {id:5,title:"Lagu 5",artist:"VINZXCYY",src:"https://files.catbox.moe/idsfuz.mp3",cover:""},
  {id:6,title:"Lagu 6",artist:"VINZXCYY",src:"https://files.catbox.moe/vzoy5f.mp3",cover:""},
  {id:7,title:"Lagu 7",artist:"VINZXCYY",src:"https://files.catbox.moe/yomgn9.mp3",cover:""},
  {id:8,title:"Lagu 8",artist:"VINZXCYY",src:"https://files.catbox.moe/wsd0j7.m4a",cover:""},
  {id:9,title:"Lagu 9",artist:"VINZXCYY",src:"https://files.catbox.moe/1cl2xg.mp3",cover:""},
  {id:10,title:"Lagu 10",artist:"VINZXCYY",src:"https://files.catbox.moe/g4pqs1.mp3",cover:""},
  {id:11,title:"Lagu 11",artist:"VINZXCYY",src:"https://files.catbox.moe/xh1gj9.mp3",cover:""},
  {id:12,title:"Lagu 12",artist:"VINZXCYY",src:"https://files.catbox.moe/mn3s9y.mp3",cover:""},
  {id:13,title:"Lagu 13",artist:"VINZXCYY",src:"https://files.catbox.moe/hcd0zc.m4a",cover:""},
  {id:14,title:"Lagu 14",artist:"VINZXCYY",src:"https://files.catbox.moe/e6qrmn.mp3",cover:""},
  {id:15,title:"Lagu 15",artist:"VINZXCYY",src:"https://files.catbox.moe/ng2zus.mp3",cover:""},
  {id:16,title:"Lagu 16",artist:"VINZXCYY",src:"https://files.catbox.moe/qvi3aj.mp3",cover:""},
  {id:17,title:"Lagu 17",artist:"VINZXCYY",src:"https://files.catbox.moe/kpgvb0.mp3",cover:""},
  {id:18,title:"Lagu 18",artist:"VINZXCYY",src:"https://files.catbox.moe/ISI_LINK_18.mp3",cover:""},
  {id:19,title:"Lagu 19",artist:"VINZXCYY",src:"https://files.catbox.moe/m5uuko.mp3",cover:""},
  {id:20,title:"Lagu 20",artist:"VINZXCYY",src:"https://files.catbox.moe/3fw4cn.mp3",cover:""},
  {id:21,title:"Lagu 21",artist:"VINZXCYY",src:"https://files.catbox.moe/jd42al.m4a",cover:""},
  {id:22,title:"Lagu 22",artist:"VINZXCYY",src:"https://files.catbox.moe/jbo3lq.m4a",cover:""},
  {id:23,title:"Lagu 23",artist:"VINZXCYY",src:"https://files.catbox.moe/4pqux3.mp3",cover:""},
  {id:24,title:"Lagu 24",artist:"VINZXCYY",src:"https://files.catbox.moe/n90has.mp3",cover:""},
  {id:25,title:"Lagu 25",artist:"VINZXCYY",src:"https://files.catbox.moe/zqu3d8.mp3",cover:""},
  {id:26,title:"Lagu 26",artist:"VINZXCYY",src:"https://files.catbox.moe/3xrzb5.mp3",cover:""},
  {id:27,title:"Lagu 27",artist:"VINZXCYY",src:"https://files.catbox.moe/jn6hg6.mp3",cover:""}
];

let idx=0,playing=false,shuffle=false,repeat=false;
let user=null,favs=[],recent=[],topPlayed={},userPlaylists={},currentFilter='all';
let shuffleQueue=[],isDraggingProgress=false,sleepTimer=null;
let audioCtx=null,analyser=null,sourceNode=null,bassFilter=null,midFilter=null,trebleFilter=null;
let voiceRecognition=null;

const $=id=>document.getElementById(id);

document.addEventListener('DOMContentLoaded',()=>{
  const last=localStorage.getItem('vinzx_last_user');
  if(last&&$('loginUser'))$('loginUser').value=last;
  const li=$('logoImg'),sl=$('sidebarLogo');
  if(li)li.src=LOGO_URL;
  if(sl)sl.src=LOGO_URL;
  const theme=localStorage.getItem('vinzx_theme');
  if(theme==='light')document.body.classList.add('light-mode');
  updateThemeIcon();
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
    p.style.width=size;p.style.height=size;
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
  panel.classList.remove('shake');void panel.offsetWidth;panel.classList.add('shake');
}

function bindEvents(){
  // TAB
  document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      const tab=btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.auth-form').forEach(f=>f.classList.remove('active'));
      const slider=$('tabSlider');
      if(tab==='login'){$('loginForm').classList.add('active');if($('loginMsg'))$('loginMsg').textContent='';if(slider)slider.classList.remove('right')}
      else{$('registerForm').classList.add('active');if($('regMsg'))$('regMsg').textContent='';if(slider)slider.classList.add('right')}
    });
  });

  // REGISTER
  const rf=$('registerForm');
  if(rf)rf.addEventListener('submit',e=>{
    e.preventDefault();e.stopPropagation();
    const u=$('regUser').value.trim(),p=$('regPass').value,p2=$('regPass2').value,msg=$('regMsg');
    if(!u||u.length<3){msg.className='panel-msg err';msg.textContent='Username minimal 3 karakter';shake();return}
    if(!p||p.length<6){msg.className='panel-msg err';msg.textContent='Password minimal 6 karakter';shake();return}
    if(p!==p2){msg.className='panel-msg err';msg.textContent='Konfirmasi tidak cocok';shake();return}
    const users=JSON.parse(localStorage.getItem('vinzx_users')||'{}');
    if(users[u]){msg.className='panel-msg err';msg.textContent='Username sudah terdaftar';shake();return}
    users[u]=btoa(p);
    localStorage.setItem('vinzx_users',JSON.stringify(users));
    msg.className='panel-msg ok';msg.textContent='Akun berhasil dibuat';
    toast('Selamat bergabung, '+u);
    setTimeout(()=>{document.querySelector('[data-tab="login"]').click();$('loginUser').value=u;$('regUser').value='';$('regPass').value='';$('regPass2').value=''},1200);
  });

  // LOGIN
  const lf=$('loginForm');
  if(lf)lf.addEventListener('submit',e=>{
    e.preventDefault();e.stopPropagation();
    const u=$('loginUser').value.trim(),p=$('loginPass').value,msg=$('loginMsg');
    if(!u||!p){msg.className='panel-msg err';msg.textContent='Isi username dan password';shake();return}
    const users=JSON.parse(localStorage.getItem('vinzx_users')||'{}');
    if(!users[u]){msg.className='panel-msg err';msg.textContent='Username tidak ditemukan';shake();return}
    if(atob(users[u])!==p){msg.className='panel-msg err';msg.textContent='Password salah';shake();return}
    user=u;
    msg.className='panel-msg ok';msg.textContent='Login berhasil';
    $('loginPanel').classList.add('success');
    setTimeout(()=>{$('loginPass').value=''},100);
    setTimeout(()=>startLoginFlow(u),600);
  });

  const lo=$('logoutBtn');if(lo)lo.addEventListener('click',logout);
  const pb=$('playBtn');if(pb)pb.addEventListener('click',togglePlay);
  const pv=$('prevBtn');if(pv)pv.addEventListener('click',prevSong);
  const nx=$('nextBtn');if(nx)nx.addEventListener('click',nextSong);
  const sh=$('shuffleBtn');if(sh)sh.addEventListener('click',toggleShuffle);
  const rp=$('repeatBtn');if(rp)rp.addEventListener('click',toggleRepeat);
  const fb=$('favBtn');if(fb)fb.addEventListener('click',toggleFavCurrent);
  const sB=$('shareBtn');if(sB)sB.addEventListener('click',openShare);

  // Sidebar toggle
  const sb=$('sidebarToggle');
  if(sb)sb.addEventListener('click',()=>{
    const ma=$('mainApp');
    if(ma)ma.classList.toggle('sidebar-closed');
  });

  const prog=$('progressBar');
  if(prog){
    prog.addEventListener('mousedown',()=>{isDraggingProgress=true});
    prog.addEventListener('touchstart',()=>{isDraggingProgress=true});
    prog.addEventListener('input',()=>{const a=$('audioEl');if(!a.duration)return;a.currentTime=(prog.value/100)*a.duration});
    prog.addEventListener('mouseup',()=>{isDraggingProgress=false});
    prog.addEventListener('touchend',()=>{isDraggingProgress=false});
  }

  const vol=$('volumeBar');
  if(vol)vol.addEventListener('input',()=>{
    const a=$('audioEl');a.volume=vol.value/100;
    if(user)localStorage.setItem('vinzx_volume_'+user,vol.value);
    updateVolIcon();
  });
  const vi=$('volIcon');
  if(vi)vi.addEventListener('click',()=>{
    const a=$('audioEl');const v=a.volume>0?0:0.7;
    a.volume=v;vol.value=v*100;
    if(user)localStorage.setItem('vinzx_volume_'+user,vol.value);
    updateVolIcon();
  });

  const si=$('searchInput');
  if(si){
    si.addEventListener('input',()=>{applyFilter();showAutocomplete()});
    si.addEventListener('blur',()=>setTimeout(()=>{const ab=$('autocompleteBox');if(ab)ab.classList.remove('show')},200));
    si.addEventListener('focus',showAutocomplete);
  }
  const ab=$('autocompleteBox');
  if(ab)ab.addEventListener('click',e=>{
    const item=e.target.closest('.autocomplete-item');
    if(item){
      const id=parseInt(item.dataset.id);
      playById(id);
      const si2=$('searchInput');if(si2)si2.value='';
      ab.classList.remove('show');
    }
  });

  const apb=$('addPlaylistBtn');
  if(apb)apb.addEventListener('click',()=>{
    const input=$('newPlaylistInput');
    const name=input.value.trim();
    if(!name){toast('Nama playlist kosong','err');return}
    if(userPlaylists[name]){toast('Playlist sudah ada','err');return}
    userPlaylists[name]=[];
    saveUserData();renderPlaylists();
    input.value='';
    toast('Playlist "'+name+'" dibuat');
  });

  const th=$('themeToggle');if(th)th.addEventListener('click',toggleTheme);

  const lt=$('lyricsToggle');
  if(lt)lt.addEventListener('click',()=>{const ma=$('mainApp');if(ma)ma.classList.toggle('lyrics-open')});
  const cl=$('closeLyrics');
  if(cl)cl.addEventListener('click',()=>{const ma=$('mainApp');if(ma)ma.classList.remove('lyrics-open')});

  const qt=$('queueToggle');
  if(qt)qt.addEventListener('click',()=>{const ma=$('mainApp');if(ma)ma.classList.toggle('queue-open')});
  const cq=$('closeQueue');
  if(cq)cq.addEventListener('click',()=>{const ma=$('mainApp');if(ma)ma.classList.remove('queue-open')});

  const np=$('nowPlaying');
  if(np)np.addEventListener('click',openNowPlayingFull);
  const npc=$('npClose');
  if(npc)npc.addEventListener('click',closeNowPlayingFull);

  const sb2=$('sleepBtn');
  if(sb2)sb2.addEventListener('click',()=>{const sm=$('sleepMenu');if(sm)sm.classList.toggle('hidden')});
  document.querySelectorAll('#sleepMenu button').forEach(b=>{
    b.addEventListener('click',()=>{
      const min=parseInt(b.dataset.min);
      const sm=$('sleepMenu');if(sm)sm.classList.add('hidden');
      if(sleepTimer){clearTimeout(sleepTimer);sleepTimer=null}
      if(min===0){toast('Sleep timer dimatikan');return}
      sleepTimer=setTimeout(()=>{
        const a=$('audioEl');a.pause();playing=false;updatePlayBtn();
        toast('⏰ Sleep timer: player berhenti','warn');
      },min*60*1000);
      toast('⏰ Sleep timer aktif: '+min+' menit');
    });
  });

  const eb=$('equalizerBtn');
  if(eb)eb.addEventListener('click',()=>{const ep=$('equalizerPanel');if(ep)ep.classList.toggle('hidden')});
  const ce=$('closeEq');
  if(ce)ce.addEventListener('click',()=>{const ep=$('equalizerPanel');if(ep)ep.classList.add('hidden')});
  ['eqBass','eqMid','eqTreble'].forEach(id=>{
    const el=$(id);
    if(el)el.addEventListener('input',()=>{
      $(id+'Val').textContent=el.value;
      applyEq();
    });
  });
  const re=$('resetEq');
  if(re)re.addEventListener('click',()=>{
    ['eqBass','eqMid','eqTreble'].forEach(id=>{const el=$(id);if(el)el.value=0;$(id+'Val').textContent='0'});
    applyEq();
  });

  const vb=$('voiceBtn');
  if(vb)vb.addEventListener('click',initVoice);

  const sc=$('shareClose');
  if(sc)sc.addEventListener('click',()=>{const sm=$('shareModal');if(sm)sm.classList.add('hidden')});
  const scp=$('shareCopy');
  if(scp)scp.addEventListener('click',copyShare);
  const swa=$('shareWA');
  if(swa)swa.addEventListener('click',shareWA);

  const a=$('audioEl');
  if(a){
    a.addEventListener('timeupdate',()=>{
      if(!a.duration)return;
      if(!isDraggingProgress){const pb2=$('progressBar');if(pb2)pb2.value=(a.currentTime/a.duration)*100}
      const ct=$('curTime');if(ct)ct.textContent=fmt(a.currentTime);
      const dt=$('durTime');if(dt)dt.textContent=fmt(a.duration);
      if(user&&idx>=0)localStorage.setItem('vinzx_progress_'+user,JSON.stringify({id:SONGS[idx].id,time:a.currentTime}));
    });
    a.addEventListener('ended',()=>{if(repeat){a.currentTime=0;a.play()}else nextSong()});
    a.addEventListener('error',()=>{const na=$('npArtist');if(na)na.textContent='File tidak tersedia';playing=false;updatePlayBtn()});
    a.addEventListener('loadedmetadata',()=>{const dt=$('durTime');if(dt)dt.textContent=fmt(a.duration)});
  }

  const sk=$('skipIntro');
  if(sk)sk.addEventListener('click',()=>{const s=$('introScreen');if(s){s.style.opacity='0';s.style.transition='opacity .5s';setTimeout(()=>{s.classList.add('hidden');s.style.opacity='1';enterAppFinal(user)},500)}});
  const ub=$('unmuteBtn');
  if(ub)ub.addEventListener('click',()=>{const v=$('introVideo');if(v){v.muted=false;v.volume=1.0;v.play().catch(()=>{});ub.classList.add('muted-on')}});

  document.addEventListener('keydown',e=>{
    const ma=$('mainApp');if(!ma||ma.classList.contains('hidden'))return;
    if(e.target.tagName==='INPUT')return;
    if(e.code==='Space'){e.preventDefault();togglePlay()}
    else if(e.code==='ArrowRight'){const a=$('audioEl');a.currentTime+=5}
    else if(e.code==='ArrowLeft'){const a=$('audioEl');a.currentTime-=5}
    else if(e.code==='ArrowUp'){e.preventDefault();const v=$('volumeBar');v.value=Math.min(100,parseInt(v.value)+5);v.dispatchEvent(new Event('input'))}
    else if(e.code==='ArrowDown'){e.preventDefault();const v=$('volumeBar');v.value=Math.max(0,parseInt(v.value)-5);v.dispatchEvent(new Event('input'))}
    else if(e.key==='n'||e.key==='N'){nextSong()}
    else if(e.key==='p'||e.key==='P'){prevSong()}
    else if(e.key==='l'||e.key==='L'){const ma2=$('mainApp');ma2.classList.toggle('lyrics-open')}
    else if(e.key==='q'||e.key==='Q'){const ma3=$('mainApp');ma3.classList.toggle('queue-open')}
  });
}

// ===== LOGIN FLOW =====
function startLoginFlow(u){
  $('loginPanel').classList.add('hidden');
  const ws=$('welcomeScreen'),wn=$('welcomeName');
  if(wn)wn.textContent=u;
  if(ws)ws.classList.remove('hidden');
  setTimeout(()=>{if(ws)ws.classList.add('hidden');playIntro(u)},2500);
}

function playIntro(u){
  const introScreen=$('introScreen'),introVideo=$('introVideo');
  if(!introScreen){enterAppFinal(u);return}
  if(introVideo){
    let src=introVideo.querySelector('source');
    if(!src){src=document.createElement('source');src.type='video/mp4';introVideo.appendChild(src)}
    src.src=INTRO_URL;
    introVideo.load();introVideo.currentTime=0;
  }
  introScreen.classList.remove('hidden');
  let introDone=false;
  function finishIntro(){
    if(introDone)return;
    introDone=true;
    introScreen.style.opacity='0';
    introScreen.style.transition='opacity .5s';
    setTimeout(()=>{introScreen.classList.add('hidden');introScreen.style.opacity='1';enterAppFinal(u)},500);
  }
  if(introVideo){
    introVideo.addEventListener('ended',finishIntro,{once:true});
    introVideo.addEventListener('loadedmetadata',()=>{if(introVideo.duration>10)setTimeout(finishIntro,10000)},{once:true});
    introVideo.addEventListener('error',()=>{setTimeout(finishIntro,500)},{once:true});
    introVideo.muted=false;introVideo.volume=1.0;
    introVideo.play().catch(()=>{introVideo.muted=true;introVideo.play().catch(()=>setTimeout(finishIntro,800))});
    setTimeout(()=>{if(!introDone&&introVideo.readyState===0)finishIntro()},2500);
  }else{setTimeout(finishIntro,800)}
}

function enterAppFinal(u){
  const ls=$('loginScreen');if(ls)ls.classList.add('hidden');
  const ma=$('mainApp');if(ma)ma.classList.remove('hidden');
  user=u;
  const ua=$('userAvatar');if(ua)ua.textContent=u[0].toUpperCase();
  const wu=$('welcomeUser');if(wu)wu.innerHTML=u+'<small>Session Aktif</small>';
  const hn=$('heroName');if(hn)hn.textContent=u;
  localStorage.setItem('vinzx_last_user',u);
  favs=JSON.parse(localStorage.getItem('vinzx_fav_'+u)||'[]');
  recent=JSON.parse(localStorage.getItem('vinzx_recent_'+u)||'[]');
  topPlayed=JSON.parse(localStorage.getItem('vinzx_top_'+u)||'{}');
  userPlaylists=JSON.parse(localStorage.getItem('vinzx_pl_'+u)||'{}');
  renderPlaylists();
  renderSongs(SONGS);
  renderRecent();
  renderMadeForYou();
  renderTopSongs();
  loadVolume();
  updateStats();
  initVisualizer();
  const lastProgress=localStorage.getItem('vinzx_progress_'+u);
  if(lastProgress){
    try{
      const p=JSON.parse(lastProgress);
      const i=SONGS.findIndex(s=>s.id===p.id);
      if(i>=0){
        idx=i;
        loadSong();
        const a=$('audioEl');
        a.currentTime=p.time||0;
        toast('Melanjutkan: '+SONGS[i].title);
      }
    }catch(e){}
  }
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

function saveUserData(){
  if(!user)return;
  localStorage.setItem('vinzx_fav_'+user,JSON.stringify(favs));
  localStorage.setItem('vinzx_recent_'+user,JSON.stringify(recent));
  localStorage.setItem('vinzx_top_'+user,JSON.stringify(topPlayed));
  localStorage.setItem('vinzx_pl_'+user,JSON.stringify(userPlaylists));
}

function renderPlaylists(){
  const list=$('playlistList');if(!list)return;
  list.innerHTML=`
    <li data-pl="all">🎵 Semua Lagu</li>
    <li data-pl="fav">❤️ Favorit</li>
    <li data-pl="recent">🕐 Terbaru</li>
    <li data-pl="top">🔥 Top 10</li>
  `;
  Object.keys(userPlaylists).forEach(name=>{
    const li=document.createElement('li');
    li.dataset.pl='custom:'+name;
    li.innerHTML=`<span>🎧 ${esc(name)}</span><span class="pl-del" data-name="${esc(name)}">✕</span>`;
    list.appendChild(li);
  });
  list.querySelectorAll('li').forEach(li=>{
    li.addEventListener('click',e=>{
      if(e.target.classList.contains('pl-del')){
        const name=e.target.dataset.name;
        if(confirm('Hapus playlist "'+name+'"?')){
          delete userPlaylists[name];saveUserData();renderPlaylists();toast('Playlist dihapus');
        }
        return;
      }
      const pl=li.dataset.pl;
      if(pl==='all'){currentFilter='all';$('sectionTitle').textContent='Semua Lagu';renderSongs(SONGS)}
      else if(pl==='fav'){currentFilter='fav';$('sectionTitle').textContent='Favorit';renderSongs(SONGS.filter(s=>favs.includes(s.id)))}
      else if(pl==='recent'){currentFilter='recent';      $('sectionTitle').textContent='Terbaru';
      renderSongs(recent.map(id=>SONGS.find(s=>s.id===id)).filter(Boolean));
    }
    else if(pl==='top'){currentFilter='top';$('sectionTitle').textContent='Top 10';renderTopSongs()}
    else if(pl&&pl.startsWith('custom:')){
      const name=pl.slice(7);
      currentFilter='custom:'+name;
      $('sectionTitle').textContent='Playlist: '+name;
      renderSongs(SONGS.filter(s=>userPlaylists[name].includes(s.id)));
    }
  });
});
}

function renderRecent(){
  const el=$('recentList');if(!el)return;
  const list=recent.map(id=>SONGS.find(s=>s.id===id)).filter(Boolean).slice(0,10);
  const rc=$('recentCount');if(rc)rc.textContent=list.length+' lagu';
  if(!list.length){el.innerHTML='<p style="color:var(--text-mute);font-size:12px;padding:20px 0;">Belum ada lagu diputar</p>';return}
  el.innerHTML='';
  list.forEach(s=>el.appendChild(makeCard(s)));
}

function renderMadeForYou(){
  const el=$('madeForYou');if(!el)return;
  const mixes=[
    {title:'Daily Mix 1',sub:'VINZXCYY + lebih',deco:'🎵',filter:s=>s.id%3===0},
    {title:'Daily Mix 2',sub:'Lagu favoritmu',deco:'🔥',filter:s=>s.id%3===1},
    {title:'Daily Mix 3',sub:'Rekomendasi',deco:'✨',filter:s=>s.id%3===2}
  ];
  el.innerHTML='';
  mixes.forEach(m=>{
    const card=document.createElement('div');
    card.className='mix-card';
    card.innerHTML=`<div class="mix-card-deco">${m.deco}</div><div class="mix-card-title">${m.title}</div><div class="mix-card-sub">${m.sub}</div>`;
    card.addEventListener('click',()=>{
      const list=SONGS.filter(m.filter);
      renderSongs(list);
      $('sectionTitle').textContent=m.title;
      const c=document.querySelector('.content');if(c)c.scrollTo({top:0,behavior:'smooth'});
    });
    el.appendChild(card);
  });
}

function renderTopSongs(){
  const el=$('topList');if(!el)return;
  const sorted=Object.entries(topPlayed).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([id])=>SONGS.find(s=>s.id===parseInt(id))).filter(Boolean);
  if(!sorted.length){el.innerHTML='<p style="color:var(--text-mute);font-size:12px;padding:20px 0;">Belum ada data</p>';return}
  el.innerHTML='';
  sorted.forEach(s=>el.appendChild(makeCard(s)));
}

function makeCard(s){
  const card=document.createElement('div');
  card.className='song-card';card.dataset.id=s.id;
  if(SONGS[idx].id===s.id)card.classList.add('playing');
  const isFav=favs.includes(s.id);
  card.innerHTML=`
    <button class="song-fav ${isFav?'active':''}">${isFav?'❤️':'♡'}</button>
    <div class="song-cover"><img src="${getCover(s)}" alt="" onerror="this.src='${generateCover(s.title)}'"></div>
    <button class="song-play-fab">▶</button>
    <div class="song-title">${esc(s.title)}</div>
    <div class="song-artist">${esc(s.artist)}</div>
  `;
  card.querySelector('.song-cover').addEventListener('click',()=>playById(s.id));
  card.querySelector('.song-title').addEventListener('click',()=>playById(s.id));
  card.querySelector('.song-play-fab').addEventListener('click',e=>{e.stopPropagation();playById(s.id)});
  card.querySelector('.song-fav').addEventListener('click',e=>{e.stopPropagation();toggleFav(s.id)});
  return card;
}

function toggleFav(id){
  const i=favs.indexOf(id);
  if(i===-1){favs.push(id);toast('❤️ Ditambahkan ke favorit')}
  else{favs.splice(i,1);toast('Dihapus dari favorit')}
  saveUserData();updateStats();updateFavBtn();
  if(currentFilter==='fav')renderSongs(SONGS.filter(s=>favs.includes(s.id)));
  else renderSongs(SONGS);
  renderRecent();renderTopSongs();
}

function toggleFavCurrent(){
  if(idx>=0)toggleFav(SONGS[idx].id);
}

function updateFavBtn(){
  const fb=$('favBtn');if(!fb)return;
  if(idx>=0&&favs.includes(SONGS[idx].id)){
    fb.classList.add('active');fb.textContent='❤️';
  }else{
    fb.classList.remove('active');fb.textContent='♡';
  }
}

function getCover(song){
  if(song.cover&&song.cover.trim()!=='')return song.cover;
  return generateCover(song.title);
}

function generateCover(title){
  const colors=[['#1db954','#158a3e'],['#00d4ff','#0066cc'],['#a855f7','#4c1d95'],['#22c55e','#14532d'],['#f59e0b','#78350f'],['#ec4899','#831843'],['#14b8a6','#134e4a'],['#ef4444','#7f1d1d']];
  const i=title.charCodeAt(0)%colors.length;
  const c1=colors[i][0],c2=colors[i][1];
  return "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='"+encodeURIComponent(c1)+"'/><stop offset='100%' stop-color='"+encodeURIComponent(c2)+"'/></linearGradient></defs><rect width='200' height='200' fill='url(%23g)'/><text x='100' y='130' font-size='90' font-weight='900' font-family='Arial,sans-serif' text-anchor='middle' fill='white'>"+encodeURIComponent(title[0].toUpperCase())+"</text></svg>";
}

function esc(s){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

function renderSongs(list){
  const songList=$('songList');if(!songList)return;
  songList.innerHTML='';
  const sc=$('sectionCount');if(sc)sc.textContent=list.length+' lagu';
  if(!list.length){songList.innerHTML='<p style="grid-column:1/-1;text-align:center;padding:40px;color:var(--text-mute);font-size:13px;">Tidak ada lagu</p>';return}
  list.forEach(s=>songList.appendChild(makeCard(s)));
}

function playById(id){
  const i=SONGS.findIndex(s=>s.id===id);
  if(i===-1)return;
  idx=i;
  const ma=$('mainApp');if(ma)ma.classList.add('player-open');
  const player=document.querySelector('.player');if(player)player.classList.add('show');
  loadSong();
  const a=$('audioEl');
  a.play().then(()=>{
    playing=true;updatePlayBtn();
    recent=recent.filter(x=>x!==id);recent.unshift(id);recent=recent.slice(0,20);
    topPlayed[id]=(topPlayed[id]||0)+1;
    saveUserData();updateStats();
    if(shuffle)rebuildShuffleQueue();
    renderRecent();renderTopSongs();
    renderQueue();
  }).catch(err=>{console.warn(err);playing=false;updatePlayBtn();toast('Gagal memutar','err')});
}

function loadSong(){
  const s=SONGS[idx];
  const a=$('audioEl');
  a.src=s.src;
  const nt=$('npTitle');if(nt)nt.textContent=s.title;
  const na=$('npArtist');if(na)na.textContent=s.artist;
  const pc=$('playerCover');if(pc)pc.innerHTML=`<img src="${getCover(s)}" alt="" onerror="this.src='${generateCover(s.title)}'">`;
  const lt=$('lyricsTitle');if(lt)lt.textContent=s.title;
  const la=$('lyricsArtist');if(la)la.textContent=s.artist;
  const nft=$('npFullTitle');if(nft)nft.textContent=s.title;
  const nfa=$('npFullArtist');if(nfa)nfa.textContent=s.artist;
  const nfc=$('npFullCover');if(nfc)nfc.innerHTML=`<img src="${getCover(s)}" alt="">`;
  const nfb=$('npFullBg');if(nfb)nfb.style.backgroundImage=`url('${getCover(s)}')`;
  loadLyrics(s.id);
  document.querySelectorAll('.song-card').forEach(c=>c.classList.toggle('playing',Number(c.dataset.id)===SONGS[idx].id));
  updateFavBtn();
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
  if(shuffle&&shuffleQueue.length){
    const nextId=shuffleQueue.shift();
    shuffleQueue.push(nextId);
    playById(nextId);
  }else{
    idx=(idx+1)%SONGS.length;
    playById(SONGS[idx].id);
  }
}

function toggleShuffle(){
  shuffle=!shuffle;
  const sh=$('shuffleBtn');if(sh)sh.classList.toggle('active',shuffle);
  if(shuffle)rebuildShuffleQueue();
  toast(shuffle?'⤨ Shuffle aktif':'Shuffle nonaktif');
}

function rebuildShuffleQueue(){
  shuffleQueue=SONGS.map(s=>s.id).filter(id=>id!==SONGS[idx].id);
  for(let i=shuffleQueue.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [shuffleQueue[i],shuffleQueue[j]]=[shuffleQueue[j],shuffleQueue[i]];
  }
}

function toggleRepeat(){
  repeat=!repeat;
  const rp=$('repeatBtn');if(rp)rp.classList.toggle('active',repeat);
  toast(repeat?'↻ Repeat aktif':'Repeat nonaktif');
}

function loadVolume(){
  const v=localStorage.getItem('vinzx_volume_'+user)||70;
  const vol=$('volumeBar');const a=$('audioEl');
  if(vol)vol.value=v;if(a)a.volume=v/100;
  updateVolIcon();
}

function updateVolIcon(){
  const a=$('audioEl');if(!a)return;
  const v=a.volume;const el=$('volIcon');
  if(el)el.textContent=v===0?'🔇':v<0.5?'🔉':'🔊';
}

function updateStats(){
  const t=$('statTotal');if(t)t.textContent=SONGS.length;
  const f=$('statFav');if(f)f.textContent=favs.length;
  const r=$('statRecent');if(r)r.textContent=recent.length;
}

function applyFilter(){
  const si=$('searchInput');
  const q=(si?si.value:'').toLowerCase().trim();
  let list=SONGS.slice();
  if(q)list=list.filter(s=>s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q));
  const st=$('sectionTitle');
  if(st)st.textContent=q?'Hasil Pencarian':'Semua Lagu';
  renderSongs(list);
}

function showAutocomplete(){
  const si=$('searchInput');const ab=$('autocompleteBox');
  if(!si||!ab)return;
  const q=si.value.toLowerCase().trim();
  if(!q){ab.classList.remove('show');return}
  const matches=SONGS.filter(s=>s.title.toLowerCase().includes(q)||s.artist.toLowerCase().includes(q)).slice(0,6);
  if(!matches.length){ab.classList.remove('show');return}
  ab.innerHTML=matches.map(s=>`<div class="autocomplete-item" data-id="${s.id}"><span>${esc(s.title)}</span><span class="ac-artist">${esc(s.artist)}</span></div>`).join('');
  ab.classList.add('show');
}

function toggleTheme(){
  document.body.classList.toggle('light-mode');
  const isLight=document.body.classList.contains('light-mode');
  localStorage.setItem('vinzx_theme',isLight?'light':'dark');
  updateThemeIcon();
  toast(isLight?'☀️ Light mode':'🌙 Dark mode');
}
function updateThemeIcon(){
  const th=$('themeToggle');if(!th)return;
  th.textContent=document.body.classList.contains('light-mode')?'☀️':'🌙';
}

function loadLyrics(songId){
  const body=$('lyricsBody');if(!body)return;
  body.innerHTML='<p class="lyrics-empty">Memuat lirik...</p>';
  setTimeout(()=>{body.innerHTML='<p class="lyrics-empty">🎵 Lirik belum tersedia untuk lagu ini</p>'},500);
  const nfl=$('npFullLyrics');if(nfl)nfl.textContent='🎵 Lirik belum tersedia';
}

function initVisualizer(){
  const canvas=$('visualizer');if(!canvas)return;
  const a=$('audioEl');if(!a)return;
  try{
    if(!audioCtx){
      audioCtx=new (window.AudioContext||window.webkitAudioContext)();
      analyser=audioCtx.createAnalyser();
      analyser.fftSize=128;
      sourceNode=audioCtx.createMediaElementSource(a);
      sourceNode.connect(analyser);
      analyser.connect(audioCtx.destination);
    }
    const ctx=canvas.getContext('2d');
    const data=new Uint8Array(analyser.frequencyBinCount);
    function resize(){canvas.width=canvas.offsetWidth;canvas.height=canvas.offsetHeight}
    resize();addEventListener('resize',resize);
    function draw(){
      requestAnimationFrame(draw);
      if(!analyser)return;
      analyser.getByteFrequencyData(data);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const bw=canvas.width/data.length;
      for(let i=0;i<data.length;i++){
        const h=(data[i]/255)*canvas.height;
        const alpha=data[i]/255*0.7+0.1;
        ctx.fillStyle=`rgba(29,185,84,${alpha})`;
        ctx.fillRect(i*bw,canvas.height-h,bw-1,h);
      }
    }
    draw();
  }catch(e){console.warn('Visualizer fail:',e)}
}

function applyEq(){
  if(!audioCtx||!sourceNode)return;
  if(!bassFilter){
    bassFilter=audioCtx.createBiquadFilter();bassFilter.type='lowshelf';bassFilter.frequency.value=200;
    midFilter=audioCtx.createBiquadFilter();midFilter.type='peaking';midFilter.frequency.value=1000;midFilter.Q.value=1;
    trebleFilter=audioCtx.createBiquadFilter();trebleFilter.type='highshelf';trebleFilter.frequency.value=3000;
    sourceNode.disconnect();
    sourceNode.connect(bassFilter);bassFilter.connect(midFilter);midFilter.connect(trebleFilter);trebleFilter.connect(analyser);
  }
  const b=$('eqBass'),m=$('eqMid'),t=$('eqTreble');
  if(b)bassFilter.gain.value=parseInt(b.value);
  if(m)midFilter.gain.value=parseInt(m.value);
  if(t)trebleFilter.gain.value=parseInt(t.value);
}

function renderQueue(){
  const qb=$('queueBody');if(!qb)return;
  qb.innerHTML='';
  SONGS.forEach((s,i)=>{
    const item=document.createElement('div');
    item.className='queue-item'+(i===idx?' active':'');
    item.innerHTML=`<img src="${getCover(s)}" alt=""><div class="queue-item-info"><div class="queue-item-title">${esc(s.title)}</div><div class="queue-item-artist">${esc(s.artist)}</div></div>`;
    item.addEventListener('click',()=>playById(s.id));
    qb.appendChild(item);
  });
}

function openNowPlayingFull(){
  if(idx<0)return;
  const npf=$('nowPlayingFull');if(npf)npf.classList.remove('hidden');
}
function closeNowPlayingFull(){
  const npf=$('nowPlayingFull');if(npf)npf.classList.add('hidden');
}

function openShare(){
  if(idx<0||!SONGS[idx]){toast('Tidak ada lagu','err');return}
  const s=SONGS[idx];
  const sm=$('shareModal');const st=$('shareText');
  if(st)st.textContent=`🎧 Dengerin "${s.title}" oleh ${s.artist} di VINZXCYY Music!`;
  if(sm)sm.classList.remove('hidden');
}

function copyShare(){
  const s=SONGS[idx];
  const text=`🎧 Dengerin "${s.title}" oleh ${s.artist} di VINZXCYY Music!\n\nhttps://spotify-beige-iota.vercel.app`;
  navigator.clipboard.writeText(text).then(()=>{
    toast('📋 Link dicopy');
    const sm=$('shareModal');if(sm)sm.classList.add('hidden');
  }).catch(()=>toast('Gagal copy','err'));
}

function shareWA(){
  const s=SONGS[idx];
  const text=encodeURIComponent(`🎧 Dengerin "${s.title}" oleh ${s.artist} di VINZXCYY Music!\n\nhttps://spotify-beige-iota.vercel.app`);
  window.open('https://wa.me/?text='+text,'_blank');
  const sm=$('shareModal');if(sm)sm.classList.add('hidden');
}

function initVoice(){
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR){toast('Browser tidak mendukung voice command','err');return}
  if(voiceRecognition){try{voiceRecognition.stop()}catch(e){}}
  voiceRecognition=new SR();
  voiceRecognition.lang='id-ID';
  voiceRecognition.continuous=false;
  const ind=$('voiceIndicator');
  voiceRecognition.onstart=()=>{if(ind)ind.classList.remove('hidden')};
  voiceRecognition.onend=()=>{if(ind)ind.classList.add('hidden')};
  voiceRecognition.onerror=()=>{if(ind)ind.classList.add('hidden')};
  voiceRecognition.onresult=e=>{
    const cmd=e.results[0][0].transcript.toLowerCase();
    toast('🎤 "'+cmd+'"');
    if(cmd.includes('play')||cmd.includes('putar'))togglePlay();
    else if(cmd.includes('pause')||cmd.includes('jeda')){const a=$('audioEl');a.pause();playing=false;updatePlayBtn()}
    else if(cmd.includes('next')||cmd.includes('lanjut'))nextSong();
    else if(cmd.includes('prev')||cmd.includes('kembali'))prevSong();
    else if(cmd.includes('shuffle'))toggleShuffle();
    else if(cmd.includes('repeat'))toggleRepeat();
    else if(cmd.includes('volume naik')){const v=$('volumeBar');v.value=Math.min(100,parseInt(v.value)+10);v.dispatchEvent(new Event('input'))}
    else if(cmd.includes('volume turun')){const v=$('volumeBar');v.value=Math.max(0,parseInt(v.value)-10);v.dispatchEvent(new Event('input'))}
    else{
      const found=SONGS.find(s=>cmd.includes(s.title.toLowerCase()));
      if(found)playById(found.id);
    }
  };
  try{voiceRecognition.start()}catch(e){}
}

function fmt(s){if(!isFinite(s))return'0:00';const m=Math.floor(s/60),x=Math.floor(s%60);return m+':'+(x<10?'0':'')+x}