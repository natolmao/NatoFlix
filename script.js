document.getElementById('movieName').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        searchMovies();
    }
});

async function searchMovies(page = 1) {
    const movieName = document.getElementById('movieName').value;
    let query = '';

    if (movieName) query += `&s=${encodeURIComponent(movieName)}`;

    const apiKey = '212011c';
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}${query}&page=${page}`);
    const data = await response.json();

    if (data.Response === "True") {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
        data.Search.forEach(movie => {
            const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150';
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie-item');
            movieElement.innerHTML = `
                <img src="${poster}" alt="${movie.Title}" onclick="loadMovie('${movie.imdbID}')">
                <div class="movie-title">${movie.Title}</div>
            `;
            searchResults.appendChild(movieElement);
        });

        updatePagination(data.totalResults, page);
    } else {
        alert('No movies found');
    }
}

function updatePagination(totalResults, page) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalResults / 9);
    const currentPage = page;

    if (currentPage > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => searchMovies(currentPage - 1);
        pagination.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.onclick = () => searchMovies(i);
        if (i === currentPage) {
            pageButton.disabled = true;
        }
        pagination.appendChild(pageButton);
    }

    if (currentPage < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => searchMovies(currentPage + 1);
        pagination.appendChild(nextButton);
    }
}

async function loadMovie(imdbID) {
    const apiKey = '212011c';
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === "True") {
        let videoUrl;
        if (data.Type === 'movie') {
            videoUrl = `https://vidsrc.net/embed/${imdbID}`;
        } else if (data.Type === 'series') {
            videoUrl = `https://vidsrc.net/embed/${imdbID}/1-1`; // Default to season 1, episode 1
            showSeasonEpisodeSelector(data);
        }

        // Display movie info
        const tomatoRating = data.Ratings.find(rating => rating.Source === 'Rotten Tomatoes')?.Value || 'N/A';
        document.getElementById('info').innerHTML = `
            <h2>${data.Title} (${data.Year})</h2>
            <div class="rating">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="Rotten Tomatoes">
                <span>${tomatoRating}</span>
            </div>
            <p>${data.Plot}</p>
        `;

        // Embed the video
        document.getElementById('videoContainer').innerHTML = `<iframe src="${videoUrl}" allowfullscreen></iframe>`;

        // Hide the search container and show the info container
        document.getElementById('searchContainer').style.display = 'none';
        document.getElementById('infoContainer').style.display = 'flex';
    } else {
        alert('Movie not found');
    }
}

function showSeasonEpisodeSelector(seriesData) {
    // Implementation to show season and episode selector
    // This should dynamically create dropdowns and lists for season and episode selection
}
