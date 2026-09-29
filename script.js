// Nebula Labs — interações do site

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
    nav.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
    });
});

// Ano automático no rodapé
document.getElementById("year").textContent = new Date().getFullYear();

// Edite estes links quando tiver os links reais da Nebula Labs.
const DISCORD_INVITE = "#";
const BOT_INVITE = "#";

document.getElementById("discordButton").href = DISCORD_INVITE;
document.getElementById("botButton").href = BOT_INVITE;

// Impede os botões de "#" de recarregarem a página e mostra uma mensagem.
document.getElementById("discordButton").addEventListener("click", (event) => {
    if (DISCORD_INVITE === "#") {
        event.preventDefault();
        alert("Coloque o link do seu servidor Discord no arquivo script.js.");
    }
});

document.getElementById("botButton").addEventListener("click", (event) => {
    if (BOT_INVITE === "#") {
        event.preventDefault();
        alert("Coloque o link de convite do seu bot no arquivo script.js.");
    }
});

// Pequeno efeito de movimento no fundo conforme o mouse.
document.addEventListener("mousemove", (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 12;
    const y = (event.clientY / window.innerHeight - 0.5) * 12;

    document.querySelector(".orbital").style.transform =
        `translate(${x}px, ${y}px)`;
});
