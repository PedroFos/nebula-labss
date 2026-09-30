const topbar = document.querySelector('.topbar');
const menuBtn = document.getElementById('menuBtn');
menuBtn?.addEventListener('click', () => topbar.classList.toggle('open'));

document.querySelectorAll('#nav a').forEach(a => {
  a.addEventListener('click', () => topbar.classList.remove('open'));
});

const titles = {
  overview: 'Visão geral',
  moderation: 'Moderação',
  economy: 'Economia',
  stats: 'Estatísticas',
  settings: 'Configuração'
};

document.querySelectorAll('.dash-link').forEach(button => {
  button.addEventListener('click', () => {
    const target = button.dataset.panel;
    document.querySelectorAll('.dash-link').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active-panel'));
    button.classList.add('active');
    document.getElementById(`panel-${target}`)?.classList.add('active-panel');
    document.getElementById('panelTitle').textContent = titles[target] || 'Visão geral';
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

document.querySelectorAll('.toggle').forEach(toggle => {
  toggle.addEventListener('click', () => toggle.classList.toggle('on'));
});
