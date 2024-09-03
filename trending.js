const apiKey = '355c7191de5cb3f569b2a6b34cc274bc'; // Replace with your TMDB API key
const trendingContainer = document.getElementById('trending-section');

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/home.html') {
        fetchTrendingMovies();
    }
});

async function fetchTrendingMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`);
        const data = await response.json();
        displayTrending(data.results);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        trendingContainer.innerHTML = "<p>Failed to load trending movies.</p>";
    }
}

function displayTrending(trendingMovies) {
    if (!trendingMovies.length) {
        trendingContainer.innerHTML = "<p>No trending movies or TV shows found.</p>";
        return;
    }

    trendingContainer.innerHTML = `
        <h2>Trending Movies and TV Shows</h2>
        <div class="trending-results">
            ${trendingMovies.map(movie => `
                <div class="movie-item">
                    <a href="/home.html?movie=${movie.id}">
                        <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" alt="${movie.title || movie.name}">
                    </a>
                </div>
            `).join('')}
        </div>
    `;
}
