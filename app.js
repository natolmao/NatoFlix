const apiKey = '355c7191de5cb3f569b2a6b34cc274bc'; // Replace with your TMDB API key

document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingMovies();
    fetchTrendingTVShows();

    // Add event listener for the search bar
    document.getElementById('searchBar').addEventListener('input', (event) => {
        const query = event.target.value.trim();
        if (query) {
            searchMovies(query);
        } else {
            fetchTrendingMovies(); // Fetch trending movies when the search bar is empty
	    fetchTrendingTVShows(); // Fetch trending TV shows on load
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

async function fetchTrendingTVShows() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`);
        const data = await response.json();
        displayTVShows(data.results);
    } catch (error) {
        console.error('Error fetching trending TV shows:', error);
    }
}

async function searchMovies(query) {
    try {
        // Fetch movies based on the search query
        const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        const movieData = await movieResponse.json();
        
        // Fetch TV shows based on the search query
        const tvResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        const tvData = await tvResponse.json();

        // Clear existing results
        const movieList = document.getElementById('trendingMovies');
        const showList = document.getElementById('trendingShows');
        movieList.innerHTML = ''; // Clear previous movie results
        showList.innerHTML = ''; // Clear previous TV show results

        // Check if the search query is empty
        if (!query) {
            // If query is empty, fetch and display trending movies and shows
            fetchTrendingMovies();
            fetchTrendingTVShows();
            // Show the headings
            document.querySelector('.trending-movies-head').style.display = 'block';
            document.querySelector('.trending-shows-head').style.display = 'block';
            return; // Exit the function early
        }

        // Check if there are results
        const foundMovies = displayMovies(movieData.results);
        const foundTVShows = displayTVShows(tvData.results);

        // Hide headings if there are search results
        if (foundMovies || foundTVShows) {
            document.querySelector('.trending-movies-head').style.display = 'none';
            document.querySelector('.trending-shows-head').style.display = 'none';
        } else {
            // Show no results message if neither movies nor TV shows are found
            movieList.innerHTML = `<p>No results found for the search "${query}".</p>`;
            showList.innerHTML = ''; // Clear TV show list
        }
    } catch (error) {
        console.error('Error searching movies and TV shows:', error);
    }
}

function displayMovies(movies, query) {
    const movieList = document.getElementById('trendingMovies');
    let hasResults = false; // Flag to check if there are results

    movieList.innerHTML = ''; // Clear previous results

    if (movies.length > 0) {
        hasResults = true; // Set flag if there are movies
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

    return hasResults; // Return if there are movie results
}

function displayTVShows(tvShows, query) {
    const movieList = document.getElementById('trendingShows');
    let hasResults = false; // Flag to check if there are results

    if (tvShows.length > 0) {
        hasResults = true; // Set flag if there are TV shows
        tvShows.forEach(tvShow => {
            const tvTile = document.createElement('div');
            tvTile.className = 'movie-tile';
            tvTile.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${tvShow.poster_path}" alt="${tvShow.name}">
                <h3>${tvShow.name}</h3>
            `;
            tvTile.addEventListener('click', () => handleTVShowClick(tvShow.id));
            movieList.appendChild(tvTile);
        });
    }

    return hasResults; // Return if there are TV show results
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

async function handleTVShowClick(tvShowId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/tv/${tvShowId}/external_ids?api_key=${apiKey}`);
        const data = await response.json();
        const imdbID = data.imdb_id;

        if (imdbID) {
            window.location.href = `movie-player.html?movie=${imdbID}`; // Redirect to the movie player for TV shows
        } else {
            alert('IMDb ID not found for the TV show');
        }
    } catch (error) {
        console.error('Error fetching IMDb ID for the TV show:', error);
    }
}
