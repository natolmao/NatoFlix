const tmdbApiKey = '355c7191de5cb3f569b2a6b34cc274bc';
const omdbApiKey = '212011c';

async function fetchMovieDetailsFromTMDB(tmdbId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${tmdbApiKey}&append_to_response=external_ids`);
    const data = await response.json();
    return data;
}

async function redirectToEmbedPage(tmdbId) {
    const movieDetails = await fetchMovieDetailsFromTMDB(tmdbId);
    const imdbID = movieDetails.external_ids.imdb_id;

    if (imdbID) {
        loadMovie(imdbID);
    } else {
        alert('IMDb ID not found');
    }
}

async function loadMovie(imdbID, updateHistory = true) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`);
    const data = await response.json();

    if (data.Response === "True") {
        const videoUrl = `https://vidsrc.net/embed/${imdbID}`;

        // Display movie info
        document.getElementById('info').innerHTML = `
            <h2>${data.Title} (${data.Year})</h2>
            <div class="rating">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="Rotten Tomatoes">
                <span>${data.Ratings.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A'}</span>
            </div>
            <p>${data.Plot}</p>
        `;

        // Embed the video
        document.getElementById('videoContainer').innerHTML = `<iframe src="${videoUrl}" allowfullscreen></iframe>`;

        // Hide the search container and trending section, show the info container
        document.getElementById('searchContainer').style.display = 'none';
        document.getElementById('trending-section').style.display = 'none'; // Hide trending section
        document.getElementById('infoContainer').style.display = 'flex';

        if (updateHistory) {
            history.pushState({ imdbID }, '', `?movie=${imdbID}`);
        }
    } else {
        alert('Movie not found');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname === '/home.html') {
        const trendingSection = document.getElementById('trending-section');
        trendingSection.style.display = 'block'; // Show trending section on home page
    }
});
