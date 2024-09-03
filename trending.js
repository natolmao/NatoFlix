const trendingApiKey = '355c7191de5cb3f569b2a6b34cc274bc';
const trendingContainer = document.querySelector('.trending-results');
const trendingSection = document.getElementById('trending-section'); // Reference to the trending section

// Check if the current page is home.html
if (window.location.pathname === '/home.html' || window.location.pathname === '/home') {
    document.addEventListener('DOMContentLoaded', fetchTrendingMovies);
} else {
    trendingSection.style.display = 'none'; // Hide the trending section on other pages
}

async function fetchTrendingMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${trendingApiKey}`);
        const data = await response.json();
        displayTrending(data.results);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        trendingContainer.innerHTML = "<p>No trending movies or TV shows found.</p>";
    }
}

async function getImdbID(tmdbID) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${trendingApiKey}&append_to_response=external_ids`);
        const data = await response.json();
        return data.external_ids.imdb_id ? data.external_ids.imdb_id : null;
    } catch (error) {
        console.error('Error fetching IMDb ID:', error);
        return null;
    }
}

function displayTrending(movies) {
    trendingContainer.innerHTML = '';

    movies.forEach(async (movie) => {
        const posterPath = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'https://via.placeholder.com/150';

        const imdbID = await getImdbID(movie.id);
        const movieElement = document.createElement('img');
        movieElement.src = posterPath;
        movieElement.alt = movie.title || movie.name;
        movieElement.onclick = () => redirectToEmbedPage(imdbID);
        trendingContainer.appendChild(movieElement);
    });
}

function redirectToEmbedPage(imdbID) {
    if (imdbID) {
        window.location.href = `https://vidsrc.net/embed/${imdbID}`;
    } else {
        alert('IMDb ID not found for this movie.');
    }
}
