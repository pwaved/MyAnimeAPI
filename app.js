   const AnimeSearch = (() => {
        const API_URL = 'https://api.jikan.moe/v4/anime';
        
        const elements = {
            input: document.getElementById('anime-input'),
            btn: document.getElementById('search-btn'),
            results: document.getElementById('results'),
            loading: document.querySelector('.loading-indicator')
        };
    
        
        const setupEventListeners = () => {
            elements.input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') buscarAnime();
            });
            elements.btn.addEventListener('click', buscarAnime);
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
            elements.results.innerHTML = animes.map(anime => `
                <article class="anime-card">
                    <img src="${anime.images?.jpg?.image_url || 'https://via.placeholder.com/300x400'}" 
                         alt="${anime.title}" 
                         class="anime-cover"
                         onerror="this.src='https://via.placeholder.com/300x400'">
                    <div class="anime-info">
                        <h2 class="anime-title">${anime.title}</h2>
                        <div class="meta">
                            <span class="score">⭐ ${anime.score || 'N/A'}</span>
                            <span class="episodes">📺 ${anime.episodes || '?'} episódios</span>
                        </div>
                        <p class="synopsis">${anime.synopsis?.substring(0, 100) || 'Sem sinopse disponível'}...</p>
                    </div>
                </article>
            `).join('');
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
    
    document.addEventListener('DOMContentLoaded', AnimeSearch.init);