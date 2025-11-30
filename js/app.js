document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('dance-grid');
    const searchInput = document.getElementById('search-input');
    const levelSelect = document.getElementById('level-select');
    const noResults = document.getElementById('no-results');
    const themeToggle = document.getElementById('theme-toggle');
    const modal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    const youtubePlayer = document.getElementById('youtube-player');
    const modalTitle = document.getElementById('modal-title');
    const modalArtist = document.getElementById('modal-artist');

    let dances = [];

    // --- Theme Management ---
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // --- Data Loading ---
    // Using global variable from data/dances.js to avoid CORS issues locally
    if (typeof dancesData !== 'undefined') {
        dances = dancesData;
        renderDances(dances);
    } else {
        console.error('Error: dancesData not found. Make sure data/dances.js is loaded.');
    }

    // --- Rendering ---
    function renderDances(items) {
        grid.innerHTML = '';
        
        if (items.length === 0) {
            noResults.classList.remove('hidden');
            return;
        } else {
            noResults.classList.add('hidden');
        }

        items.forEach(dance => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <span class="level-badge">${dance.level}</span>
                <img src="https://img.youtube.com/vi/${dance.youtubeId}/hqdefault.jpg" alt="${dance.title}" class="card-thumbnail">
                <div class="card-content">
                    <h3 class="card-title">${dance.title}</h3>
                    <p class="card-artist">${dance.artist}</p>
                    <div class="card-tags">
                        ${dance.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            `;
            
            card.addEventListener('click', () => openModal(dance));
            grid.appendChild(card);
        });
    }

    // --- Filtering ---
    function filterDances() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedLevel = levelSelect.value;

        const filtered = dances.filter(dance => {
            const matchesSearch = dance.title.toLowerCase().includes(searchTerm) || 
                                  dance.artist.toLowerCase().includes(searchTerm);
            const matchesLevel = selectedLevel === '' || dance.level === selectedLevel;
            
            return matchesSearch && matchesLevel;
        });

        renderDances(filtered);
    }

    searchInput.addEventListener('input', filterDances);
    levelSelect.addEventListener('change', filterDances);

    // --- Modal Logic ---
    function openModal(dance) {
        modalTitle.textContent = dance.title;
        modalArtist.textContent = dance.artist;
        document.getElementById('youtube-link').href = `https://www.youtube.com/watch?v=${dance.youtubeId}`;
        youtubePlayer.src = `https://www.youtube.com/embed/${dance.youtubeId}?autoplay=1`;
        youtubePlayer.title = "YouTube video player";
        youtubePlayer.setAttribute('frameborder', '0');
        youtubePlayer.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
        youtubePlayer.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
        modal.classList.add('active');
    }

    function closeModalFunc() {
        modal.classList.remove('active');
        youtubePlayer.src = ''; // Stop video
    }

    closeModal.addEventListener('click', closeModalFunc);
    
    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModalFunc();
        }
    });
});
