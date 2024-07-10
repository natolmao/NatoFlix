document.getElementById('movieName').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchMovies();
    }
});

let currentPage = 1;
const apiKey = '212011c';
let totalResults = 0;
const resultsPerPage = 9;

async function searchMovies(page = 1) {
    const movieName = document.getElementById('movieName').value;
    let query = '';

    if (movieName) query += `&s=${encodeURIComponent(movieName)}`;
    query += `&page=${page}`;

    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}${query}`);
    const data = await response.json();

    const searchResults = document.getElementById('searchResults');
    searchResults.innerHTML = '';

    if (data.Response === "True") {
        totalResults = parseInt(data.totalResults, 10);
        data.Search.forEach(movie => {
            const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150';
            const movieElement = document.createElement('div');
            movieElement.classList.add('tooltip');
            movieElement.innerHTML = `
                <img src="${poster}" alt="${movie.Title}" data-imdbid="${movie.imdbID}" class="movie-poster">
                <span class="tooltiptext">${movie.Title}</span>
            `;
            movieElement.querySelector('.movie-poster').addEventListener('click', () => loadMovie(movie.imdbID));
            searchResults.appendChild(movieElement);
        });
        setupPagination(page);
    } else {
        searchResults.innerHTML = `
            <p>We couldn't find any results for the search "${movieName}". Make sure you haven't misspelled anything and try searching again.</p>
        `;
        document.getElementById('pagination').innerHTML = '';
    }
}

function setupPagination(page) {
    const totalPages = Math.ceil(totalResults / resultsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (page > 1) {
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.onclick = () => searchMovies(page - 1);
        pagination.appendChild(prevButton);
    }

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        if (i === page) {
            pageButton.disabled = true;
        } else {
            pageButton.onclick = () => searchMovies(i);
        }
        pagination.appendChild(pageButton);
    }

    if (page < totalPages) {
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.onclick = () => searchMovies(page + 1);
        pagination.appendChild(nextButton);
    }
}

async function loadMovie(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`);
    const movie = await response.json();

    const searchContainer = document.getElementById('searchContainer');
    const infoContainer = document.getElementById('infoContainer');
    searchContainer.style.display = 'none';
    infoContainer.style.display = 'flex';

    const videoContainer = document.getElementById('videoContainer');
    videoContainer.innerHTML = `<iframe src="https://vidsrc.net/embed/${movie.imdbID}" frameborder="0" allowfullscreen></iframe>`;

    const info = document.getElementById('info');
    info.innerHTML = `
        <h2>${movie.Title}</h2>
        <p>${movie.Plot}</p>
        <div class="rating">
            <img src="https://via.placeholder.com/24" alt="Rating">
            <p>${movie.imdbRating}</p>
        </div>
    `;

    if (movie.Type === 'series') {
        const episodeControls = document.getElementById('episodeControls');
        episodeControls.style.display = 'flex';
        episodeControls.innerHTML = `
            <h3>${movie.Title} - SE ${movie.Season} - EP ${movie.Episode}</h3>
        `;
    }
}
