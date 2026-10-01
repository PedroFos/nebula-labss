const API_URL = window.NEBULA_API_URL || 'https://api.nebulalabs.com.br';

const topbar = document.querySelector('.topbar');
document.getElementById('menuBtn')?.addEventListener('click', () => topbar.classList.toggle('open'));
document.querySelectorAll('#nav a').forEach(a => a.addEventListener('click', () => topbar.classList.remove('open')));
document.getElementById('year').textContent = new Date().getFullYear();

function loginUrl(){ return `${API_URL}/auth/discord`; }
function goLogin(e){ e?.preventDefault(); window.location.href = loginUrl(); }
document.getElementById('loginBtn')?.addEventListener('click', goLogin);
document.getElementById('heroLogin')?.addEventListener('click', goLogin);
document.getElementById('loginMain')?.addEventListener('click', goLogin);

let currentGuild = null;
let settings = {};
const $ = id => document.getElementById(id);

async function api(path, options={}) {
  const res = await fetch(`${API_URL}${path}`, { credentials:'include', ...options, headers:{'Content-Type':'application/json', ...(options.headers||{})} });
  if(res.status===401) throw new Error('NOT_AUTHENTICATED');
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error || 'API_ERROR');
  return data;
}

function showLoggedIn(user){
  $('loginScreen').classList.add('hidden'); $('serverScreen').classList.remove('hidden');
  $('serverDashboard').classList.add('hidden');
  $('accountName').textContent = user.global_name || user.username;
  const avatar = $('accountBox').querySelector('.avatar');
  avatar.textContent = '';
  if(user.avatar){ avatar.style.backgroundImage=`url(https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=64)`; avatar.style.backgroundSize='cover'; }
}

async function loadServers(){
  try{
    const [user, result] = await Promise.all([api('/api/me'), api('/api/servers')]);
    showLoggedIn(user);
    const list = $('serverList'); list.innerHTML='';
    if(!result.servers.length){ list.innerHTML='<div class="dash-card"><h3>Nenhum servidor disponível</h3><p>O bot precisa estar no servidor e sua conta precisa ter permissão de Administrador.</p></div>'; return; }
    for(const s of result.servers){
      const card=document.createElement('div'); card.className='dash-card server-card';
      const icon=s.icon ? `https://cdn.discordapp.com/icons/${s.id}/${s.icon}.png?size=128` : '';
      card.innerHTML=`<div class="server-icon">${icon?`<img src="${icon}" alt="">`:'✦'}</div><div><h3>${escapeHtml(s.name)}</h3><small>${s.memberCount} membros • NebulaBot instalado</small></div><button class="fake-btn">Gerenciar →</button>`;
      card.querySelector('button').addEventListener('click',()=>openServer(s.id)); list.appendChild(card);
    }
  }catch(e){
    $('loginScreen').classList.remove('hidden'); $('serverScreen').classList.add('hidden');
    if(e.message!=='NOT_AUTHENTICATED') console.error(e);
  }
}

async function openServer(id){
  try{
    const data=await api(`/api/servers/${id}`); currentGuild=id; settings=data.settings;
    $('serverScreen').classList.add('hidden'); $('serverDashboard').classList.remove('hidden');
    $('realServerName').textContent=data.server.name; $('realServerMeta').textContent=`ID ${data.server.id}`;
    $('realMembers').textContent=data.server.memberCount; $('realPrefix').textContent=settings.prefix;
    $('prefixInput').value=settings.prefix; setToggle('antiLinkToggle',settings.antiLink); setToggle('logsToggle',settings.moderationLogs);
    $('serverInfo').innerHTML=`<div><b>${escapeHtml(data.server.name)}</b><span>${data.server.memberCount} membros</span></div><div><b>NebulaBot</b><span>Conectado ao servidor</span></div>`;
  }catch(e){ alert('Não foi possível abrir este servidor.'); console.error(e); }
}
function setToggle(id,on){ $(id).classList.toggle('on',Boolean(on)); }
function getToggle(id){ return $(id).classList.contains('on'); }
$('antiLinkToggle')?.addEventListener('click',()=>setToggle('antiLinkToggle',!getToggle('antiLinkToggle')));
$('logsToggle')?.addEventListener('click',()=>setToggle('logsToggle',!getToggle('logsToggle')));
$('saveSettings')?.addEventListener('click',async()=>{
  if(!currentGuild)return;
  $('saveStatus').textContent='Salvando...';
  try{
    const data=await api(`/api/servers/${currentGuild}/settings`,{method:'PUT',body:JSON.stringify({prefix:$('prefixInput').value,antiLink:getToggle('antiLinkToggle'),moderationLogs:getToggle('logsToggle')})});
    settings=data.settings; $('realPrefix').textContent=settings.prefix; $('saveStatus').textContent='Salvo ✓';
    setTimeout(()=>$('saveStatus').textContent='',1800);
  }catch(e){ $('saveStatus').textContent='Erro ao salvar'; console.error(e); }
});
$('backServers')?.addEventListener('click',()=>{currentGuild=null;$('serverDashboard').classList.add('hidden');$('serverScreen').classList.remove('hidden');loadServers();});
$('logoutBtn')?.addEventListener('click',async()=>{try{await api('/auth/logout',{method:'POST'})}catch{} location.reload();});
function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}

// Mantém a navegação do dashboard demonstrativo.
const titles={overview:'Visão geral',moderation:'Moderação',economy:'Economia',stats:'Estatísticas',settings:'Configuração'};
document.querySelectorAll('.dash-link').forEach(button=>button.addEventListener('click',()=>{const target=button.dataset.panel;document.querySelectorAll('.dash-link').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active-panel'));button.classList.add('active');document.getElementById(`panel-${target}`)?.classList.add('active-panel');document.getElementById('panelTitle').textContent=titles[target]||'Visão geral';}));

document.querySelectorAll('.toggle').forEach(t=>t.addEventListener('click',()=>t.classList.toggle('on')));
loadServers();
