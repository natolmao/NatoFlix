const apiKey = '355c7191de5cb3f569b2a6b34cc274bc'; // Replace with your TMDB API key

document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingMovies();

    // Add event listener for the search bar
    document.getElementById('searchBar').addEventListener('input', (event) => {
        const query = event.target.value.trim();
        if (query) {
            searchMovies(query);
        } else {
            fetchTrendingMovies();
        }
    });
});

async function fetchTrendingMovies() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
    }
}

async function searchMovies(query) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById('trendingMovies');
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const movieTile = document.createElement('div');
        movieTile.className = 'movie-tile';
        movieTile.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
        `;
        movieTile.addEventListener('click', () => handleMovieClick(movie.id));
        movieList.appendChild(movieTile);
    });
}

async function handleMovieClick(movieId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}/external_ids?api_key=${apiKey}`);
        const data = await response.json();
        const imdbID = data.imdb_id;

        if (imdbID) {
            window.location.href = `movie-player.html?movie=${imdbID}`;
        } else {
            alert('IMDb ID not found');
        }
    } catch (error) {
        console.error('Error fetching IMDb ID:', error);
    }
}
