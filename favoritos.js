const darkBtn = document.getElementById('dark');
const lightBtn = document.getElementById('light');
const body = document.body;

const theme = localStorage.getItem('theme');


darkBtn.onclick = () => {
    body.classList.replace('light', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  lightBtn.onclick = () => { 
    body.classList.replace('dark', 'light');
    localStorage.setItem('theme', 'light');
  }

document.addEventListener('DOMContentLoaded', () => {
    const resultsContainer = document.getElementById('results');
    const favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

    if (favoritos.length === 0) {
        resultsContainer.innerHTML = '<p class="empty-message">Nenhum anime favorito adicionado.</p>';
        return;
    }

    resultsContainer.innerHTML = favoritos.map(anime => `
        <article class="anime-card">
            <img src="${anime.image}" alt="${anime.title}" class="anime-cover">
            <div class="anime-info2">
                <h2 class="anime-title">${anime.title}</h2>
                <button class="remover-favorito" data-id="${anime.id}">❌ Remover</button>
            </div>
        </article>
    `).join('');

    // Adicionar evento para remover favoritos
    document.querySelectorAll('.remover-favorito').forEach(button => {
        button.addEventListener('click', (event) => {
            const animeId = event.target.dataset.id;
            const novosFavoritos = favoritos.filter(anime => anime.id !== animeId);
            localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
            location.reload(); // Recarrega a página para atualizar a lista
        });
    });
});