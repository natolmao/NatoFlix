// Constants
const apiKey = '355c7191de5cb3f569b2a6b34cc274bc'; // Replace with your TMDB API key

// DOM Elements
const trendingContainer = document.getElementById('trending-results');

async function fetchTrendingMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.results) {
            displayTrending(data.results);
        } else {
            trendingContainer.innerHTML = '<p>No trending movies or TV shows found.</p>';
        }
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        trendingContainer.innerHTML = '<p>Failed to load trending movies.</p>';
    }
}

// Display trending movies
function displayTrending(movies) {
    trendingContainer.innerHTML = ''; // Clear any previous content

    movies.forEach(movie => {
        const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/150';
        const movieElement = document.createElement('div');
        movieElement.className = 'movie-item';
        movieElement.innerHTML = `
            <a href="embed.html?movie=${movie.id}">
                <img src="${poster}" alt="${movie.title || movie.name}">
                <p>${movie.title || movie.name}</p>
            </a>
        `;
        trendingContainer.appendChild(movieElement);
    });
}

// Initialize the trending section on page load
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/home.html') {
        fetchTrendingMovies();
    }
});
