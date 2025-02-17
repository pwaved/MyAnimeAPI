  const darkBtn = document.getElementById('dark');
  const lightBtn = document.getElementById('light');
  const body = document.body;
  const favBtn = document.getElementById('view-favorites');
  const favoritesContainer = document.getElementById('favorites-container');
  
  const theme = localStorage.getItem('theme');

  darkBtn.onclick = () => {
    body.classList.replace('light', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  lightBtn.onclick = () => { 
    body.classList.replace('dark', 'light');
    localStorage.setItem('theme', 'light');
  }

  let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

  const AnimeSearch = (() => {
        const API_URL = 'https://api.jikan.moe/v4/anime';
        
        const elements = {
            input: document.getElementById('anime-input'),
            btn: document.getElementById('search-btn'),
            results: document.getElementById('results'),
            loading: document.querySelector('.loading-indicator'),
            
        };
    
        const setupEventListeners = () => {
            elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') buscarAnime();
            });
            elements.btn.addEventListener('click', buscarAnime);

            elements.results.addEventListener('click', (e) => {
                if (e.target.classList.contains('ver-mais')) {
                    verMais(e.target);
                }
            });
        };
    
        const toggleLoading = (show) => {
            elements.loading.classList.toggle('active', show);
            console.log('Loading state:', show);
        };
    
        const showError = (message) => {
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            elements.results.prepend(errorElement);
            setTimeout(() => errorElement.remove(), 3000);
        };
    
        const renderResults = (animes) => {

            favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

            elements.results.innerHTML = animes.map(anime => {
                const isFavorito = favoritos.some(fav => fav.id == anime.mal_id);
        
                return `
                    <article class="anime-card">
                        <img src="${anime.images?.jpg?.image_url || 'https://via.placeholder.com/300x400'}"
                            alt="${anime.title}" class="anime-cover"
                            onerror="this.src='https://via.placeholder.com/300x400'">
                        
                        <div class="anime-info">
                            <h2 class="anime-title">${anime.title}</h2>
                            <div class="meta">
                                <span class="score">⭐ ${anime.score || 'N/A'}</span>
                                <span class="episodes">📺 ${anime.episodes || '?'} episódios</span>
                                <button class="favorito ${isFavorito ? 'ativo' : ''}" 
                                        data-id="${anime.mal_id}" 
                                        data-title="${anime.title}" 
                                        data-image="${anime.images?.jpg?.image_url}">
                                    ${isFavorito ? '★ Remover' : '☆ Favoritar'}
                                </button>
                            </div>
                            <details class="details">
                                <summary class="synopsis">${anime.synopsis?.substring(0, 100) || 'Sem sinopse disponível'}...</summary>
                                <div class="details-content">
                                    <p class="textt">${anime.synopsis}</p>
                                </div>
                            </details>
                        </div>
                    </article>
                `;
            }).join('');
        
            // Adiciona evento nos botões de favorito após renderizar
            document.querySelectorAll('.favorito').forEach(button => {
                button.addEventListener('click', toggleFavorito);
            });
        };
        
        const buscarAnime = async () => {
            try {
                toggleLoading(true);
                const response = await fetch(`${API_URL}?q=${encodeURIComponent(elements.input.value)}`);
                if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
                const data = await response.json();
                if (!data.data?.length) throw new Error('Nenhum anime encontrado');
                renderResults(data.data.slice(0, 12));
            } catch (error) {
                console.error('Erro:', error);
                showError(error.message);
            } finally {
                toggleLoading(false);
            }
        };
    
        return { 
            init: () => {
                elements.loading.classList.remove('active');
                setupEventListeners();
            }
        };
    })(); 
    
    function toggleFavorito(evento) {
        const button = evento.target;
        const anime = {
            id: button.dataset.id,
            title: button.dataset.title,
            image: button.dataset.image,
        }
    
    const index = favoritos.findIndex(fav => fav.id === anime.id);

    if (index === -1) {
        favoritos.push(anime);
        button.classList.add('ativo');
        button.textContent = '★ Remover';
    } else {
        favoritos.splice(index, 1);
        button.classList.remove('ativo');
        button.textContent = '☆ Favoritar';
    }
    localStorage.setItem('favoritos', JSON.stringify(favoritos));
    }

    document.addEventListener('DOMContentLoaded', AnimeSearch.init);