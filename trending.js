async function fetchTrendingContent() {
    const apiKey = '355c7191de5cb3f569b2a6b34cc274bc';  // Replace with your actual TMDb API key
    const trendingMoviesUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;
    const trendingTvUrl = `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`;
    
    try {
        const [moviesResponse, tvResponse] = await Promise.all([
            fetch(trendingMoviesUrl),
            fetch(trendingTvUrl)
        ]);

        const moviesData = await moviesResponse.json();
        const tvData = await tvResponse.json();

        return { movies: moviesData.results, tvShows: tvData.results };
    } catch (error) {
        console.error('Error fetching trending content:', error);
    }
}

async function displayTrendingContent() {
    const { movies, tvShows } = await fetchTrendingContent();

    const moviesContainer = document.getElementById('trending-movies');
    const tvShowsContainer = document.getElementById('trending-tv-shows');

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie-item');
        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <a href="https://vidsrc.net/embed/${movie.imdb_id}" target="_blank">${movie.title}</a>
        `;
        moviesContainer.appendChild(movieElement);
    });

    tvShows.forEach(tvShow => {
        const tvElement = document.createElement('div');
        tvElement.classList.add('movie-item');
        tvElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${tvShow.poster_path}" alt="${tvShow.name}">
            <a href="https://vidsrc.net/embed/${tvShow.imdb_id}" target="_blank">${tvShow.name}</a>
        `;
        tvShowsContainer.appendChild(tvElement);
    });
}

// Call the function to display trending content on page load
displayTrendingContent();
