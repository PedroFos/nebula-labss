const menu=document.getElementById('menu'),nav=document.getElementById('nav');
menu.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();

document.querySelectorAll('.side-link').forEach(button=>{
  button.addEventListener('click',()=>{
    document.querySelectorAll('.side-link').forEach(b=>b.classList.remove('selected'));
    button.classList.add('selected');
  });
});

const windowBox=document.querySelector('.window');
document.addEventListener('mousemove',e=>{
  if(innerWidth<=850)return;
  const x=(e.clientX/innerWidth-.5)*4;
  const y=(e.clientY/innerHeight-.5)*-3;
  windowBox.style.transform=`rotateY(${-5+x}deg) rotateX(${2+y}deg)`;
});
