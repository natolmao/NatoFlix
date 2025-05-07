const apiKey = '355c7191de5cb3f569b2a6b34cc274bc'; // Replace with your TMDB API key

document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('searchBar');
    const filterButtons = document.getElementById('filterButtons');
    const moviesButton = document.getElementById('moviesButton');
    const tvShowsButton = document.getElementById('tvShowsButton');
    const trendingMovies = document.getElementById('trendingMovies');
    const trendingShows = document.getElementById('trendingShows');
    const trendingMoviesHead = document.querySelector('.trending-movies-head');
    const trendingShowsHead = document.querySelector('.trending-shows-head');

    // Fetch and display trending movies and TV shows on page load
    fetchTrendingMovies();
    fetchTrendingTVShows();

    // Event listener for the search bar
    searchBar.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        if (query) {
            filterButtons.style.display = 'flex'; // Show filter buttons
            searchContent(query);
        } else {
            filterButtons.style.display = 'none'; // Hide filter buttons
            trendingMoviesHead.style.display = 'block';
            trendingShowsHead.style.display = 'block';
            fetchTrendingMovies();
            fetchTrendingTVShows();
        }
    });

    // Event listeners for filter buttons
    moviesButton.addEventListener('click', () => {
        moviesButton.classList.add('active');
        tvShowsButton.classList.remove('active');
        trendingMovies.style.display = 'flex';
        trendingShows.style.display = 'none';
    });

    tvShowsButton.addEventListener('click', () => {
        tvShowsButton.classList.add('active');
        moviesButton.classList.remove('active');
        trendingMovies.style.display = 'none';
        trendingShows.style.display = 'flex';
    });

    // Function to fetch trending movies
    async function fetchTrendingMovies() {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
            const data = await response.json();
            displayMovies(data.results);
        } catch (error) {
            console.error('Error fetching trending movies:', error);
        }
    }

    // Function to fetch trending TV shows
    async function fetchTrendingTVShows() {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`);
            const data = await response.json();
            displayTVShows(data.results);
        } catch (error) {
            console.error('Error fetching trending TV shows:', error);
        }
    }

    // Function to search for movies and TV shows
    async function searchContent(query) {
        try {
            // Fetch movies based on the search query
            const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
            const movieData = await movieResponse.json();

            // Fetch TV shows based on the search query
            const tvResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
            const tvData = await tvResponse.json();

            // Clear existing results
            trendingMovies.innerHTML = '';
            trendingShows.innerHTML = '';

            // Display search results
            const foundMovies = await displayMovies(movieData.results);
            const foundTVShows = await displayTVShows(tvData.results);

            // Hide headings if there are search results
            if (foundMovies || foundTVShows) {
                trendingMoviesHead.style.display = 'none';
                trendingShowsHead.style.display = 'none';
            } else {
                // Show no results message if neither movies nor TV shows are found
                trendingMovies.innerHTML = `<p>No results found for the search "${query}".</p>`;
                trendingShows.innerHTML = '';
            }

            // Default to showing movies
            moviesButton.classList.add('active');
            tvShowsButton.classList.remove('active');
            trendingMovies.style.display = 'flex';
            trendingShows.style.display = 'none';
        } catch (error) {
            console.error('Error searching movies and TV shows:', error);
        }
    }

    // Function to display movies
    async function displayMovies(movies) {
        let hasResults = false;
        trendingMovies.innerHTML = '';

        if (movies.length > 0) {
            hasResults = true;
            for (const movie of movies) {
                const movieTile = document.createElement('div');
                movieTile.className = 'movie-tile';

                const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';

                // Fetch detailed movie info to get runtime
                const detailedMovie = await fetchMovieDetails(movie.id);
                const runtime = detailedMovie.runtime ? `${detailedMovie.runtime}m` : 'N/A';

                movieTile.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
                    <h3>${movie.title}</h3>
                    <p>${releaseYear} • ${runtime}</p>
                `;
                movieTile.addEventListener('click', () => handleMovieClick(movie.id));
                trendingMovies.appendChild(movieTile);
            }
        }

        return hasResults;
    }

    // Function to fetch detailed movie information
    async function fetchMovieDetails(movieId) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching movie details:', error);
            return {};
        }
    }

    // Function to display TV shows
    async function displayTVShows(tvShows) {
        let hasResults = false;
        trendingShows.innerHTML = '';

        if (tvShows.length > 0) {
            hasResults = true;
            for (const show of tvShows) {
                const tvShowTile = document.createElement('div');
                tvShowTile.className = 'movie-tile';

                // Fetch detailed TV show info to get latest season and episode
                const detailedShow = await fetchTVShowDetails(show.id);
                const seasons = detailedShow.seasons || [];
                const latestSeason = seasons.length > 0 ? `S${seasons.length}` : 'N/A';
                const latestEpisode = seasons.length > 0 ? `E${seasons[seasons.length - 1].episode_count}` : 'N/A';

                tvShowTile.innerHTML = `
                    <img src="https://image.tmdb.org/t/p/w500${show.poster_path}" alt="${show.name}">
                    <h3>${show.name}</h3>
                    <p>${latestSeason} • ${latestEpisode}</p>
                `;
                tvShowTile.addEventListener('click', () => handleTVShowClick(show.id));
                trendingShows.appendChild(tvShowTile);
            }
        }

        return hasResults;
    }

    // Function to fetch detailed TV show information
    async function fetchTVShowDetails(tvShowId) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${tvShowId}?api_key=${apiKey}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching TV show details:', error);
            return {};
        }
    }

    // Function to handle movie tile click
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

    // Function to handle TV show tile click
    async function handleTVShowClick(tvShowId) {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${tvShowId}/external_ids?api_key=${apiKey}`);
            const data = await response.json();
            const imdbID = data.imdb_id;

            if (imdbID) {
                window.location.href = `movie-player.html?movie=${imdbID}`;
            } else {
                alert('IMDb ID not found for the TV show');
            }
        } catch (error) {
            console.error('Error fetching IMDb ID for the TV show:', error);
        }
    }
});
