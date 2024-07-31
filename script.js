document.getElementById('movieName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchMovies();
    }
});

async function searchMovies(page = 1) {
    const movieName = document.getElementById('movieName').value;
    const query = `s=${encodeURIComponent(movieName)}&page=${page}`;
    const apiKey = '212011c';
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&${query}`);
    const data = await response.json();

    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (data.Response === "True") {
        data.Search.forEach(movie => {
            const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150';
            const movieElement = document.createElement('div');
            movieElement.className = 'movie-item';
            movieElement.innerHTML = `
                <img src="${poster}" alt="${movie.Title}">
                <h3>${movie.Title}</h3>
            `;
            movieElement.onclick = () => {
                console.log(`Clicked on ${movie.Title}`); // Debugging line
                loadMovie(movie.imdbID, movie.Type);
            };
            searchResults.appendChild(movieElement);
        });

        const totalResults = parseInt(data.totalResults);
        const totalPages = Math.ceil(totalResults / 10);
        updatePagination(page, totalPages);
    } else {
        searchResults.innerHTML = `<p>We couldn't find any results for the search "${movieName}". Make sure you haven't misspelled anything and try searching again.</p>`;
    }
}

async function loadMovie(imdbID, type) {
    console.log(`Loading movie with ID: ${imdbID}`); // Debugging line
    const apiKey = '212011c';
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === "True") {
        const videoUrl = type === 'series' ? `https://vidsrc.net/embed/${imdbID}/1-1` : `https://vidsrc.net/embed/${imdbID}`;
        document.getElementById('info').innerHTML = `
            <h2>${data.Title}</h2>
            <div class="rating">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="Rotten Tomatoes">
                <span>${data.Ratings.find(rating => rating.Source === 'Rotten Tomatoes')?.Value || 'N/A'}</span>
            </div>
            <p>${data.Plot}</p>
        `;
        document.getElementById('videoContainer').innerHTML = `<iframe src="${videoUrl}" allowfullscreen></iframe>`;

        if (type === 'series') {
            loadSeasons(imdbID);
            document.getElementById('seasonSelect').style.display = 'block';
            document.getElementById('episodeSelect').style.display = 'block';
        } else {
            document.getElementById('seasonSelect').style.display = 'none';
            document.getElementById('episodeSelect').style.display = 'none';
        }

        document.getElementById('searchContainer').style.display = 'none';
        document.getElementById('infoContainer').style.display = 'flex';
    }
}

async function loadSeasons(imdbID) {
    const apiKey = '212011c';
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}&type=series`);
    const data = await response.json();

    if (data.totalSeasons) {
        const seasonSelect = document.getElementById('seasonSelect');
        seasonSelect.innerHTML = '';
        for (let i = 1; i <= data.totalSeasons; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = `Season ${i}`;
            seasonSelect.appendChild(option);
        }
        loadEpisodes(imdbID, 1);

        seasonSelect.onchange = () => {
            const selectedSeason = seasonSelect.value;
            loadEpisodes(imdbID, selectedSeason);
        };
    }
}

async function loadEpisodes(imdbID, season) {
    const apiKey = '212011c';
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}&Season=${season}`);
    const data = await response.json();

    if (data.Episodes) {
        const episodeSelect = document.getElementById('episodeSelect');
        episodeSelect.innerHTML = '';
        data.Episodes.forEach(episode => {
            const option = document.createElement('option');
            option.value = episode.Episode;
            option.textContent = `Episode ${episode.Episode}: ${episode.Title}`;
            episodeSelect.appendChild(option);
        });

        // Load the first episode by default
        loadEpisode(imdbID, season, data.Episodes[0].Episode);

        episodeSelect.onchange = () => {
            const selectedEpisode = episodeSelect.value;
            loadEpisode(imdbID, season, selectedEpisode);
        };
    }
}

function loadEpisode(imdbID, season, episode) {
    const videoUrl = `https://vidsrc.net/embed/${imdbID}/${season}-${episode}`;
    document.getElementById('videoContainer').innerHTML = `<iframe src="${videoUrl}" allowfullscreen></iframe>`;
    const showTitle = document.getElementById('info').querySelector('h2').textContent.split(' - ')[0];
    const episodeTitle = `SE ${season} - EP ${episode}`;
    document.getElementById('info').querySelector('h2').textContent = `${showTitle} - ${episodeTitle}`;
}

function updatePagination(currentPage, totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const createButton = (text, page, disabled = false) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.disabled = disabled;
        if (!disabled) {
            button.onclick = () => searchMovies(page);
        }
        return button;
    };

    const addEllipsis = () => {
        const ellipsis = document.createElement('span');
        ellipsis.textContent = '...';
        pagination.appendChild(ellipsis);
    };

    if (currentPage > 1) {
        pagination.appendChild(createButton('Previous', currentPage - 1));
    } else {
        pagination.appendChild(createButton('Previous', currentPage - 1, true));
    }

    pagination.appendChild(createButton(1, 1));

    if (currentPage > 3) {
        addEllipsis();
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pagination.appendChild(createButton(i, i));
    }

    if (currentPage < totalPages - 2) {
        addEllipsis();
    }

    if (totalPages > 1) {
        pagination.appendChild(createButton(totalPages, totalPages));
    }

    if (currentPage < totalPages) {
        pagination.appendChild(createButton('Next', currentPage + 1));
    } else {
        pagination.appendChild(createButton('Next', currentPage + 1, true));
    }
}
