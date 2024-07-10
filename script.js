async function searchMovies() {
    const movieName = document.getElementById('movieName').value.trim();
    const apiKey = '212011c';
    let query = `&apikey=${apiKey}`;

    if (movieName) {
        query += `&s=${encodeURIComponent(movieName)}`;
    }

    const response = await fetch(`https://www.omdbapi.com/?${query}`);
    const data = await response.json();

    if (data.Response === "True") {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';

        data.Search.forEach(movie => {
            const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150';
            const movieElement = document.createElement('div');
            movieElement.classList.add('movie');
            movieElement.innerHTML = `
                <img src="${poster}" alt="${movie.Title}" data-imdbid="${movie.imdbID}">
                <p class="movie-title">${movie.Title}</p>
            `;
            movieElement.addEventListener('click', () => loadMovie(movie.imdbID));
            searchResults.appendChild(movieElement);
        });

        // Display pagination if more than one page
        if (data.totalResults > 10) {
            displayPagination(data.totalResults);
        }
    } else {
        alert('No movies found');
    }
}

async function loadMovie(imdbID) {
    const apiKey = '212011c';
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === "True") {
        const videoUrl = data.Type === 'movie' ?
            `https://vidsrc.net/embed/${imdbID}/` :
            `https://vidsrc.net/embed/${imdbID}/1-1/`;

        const title = data.Type === 'movie' ? `${data.Title} (${data.Year})` :
            `${data.Title} - SE 1 - EP 1`;

        const tomatoRating = data.Ratings.find(rating => rating.Source === 'Rotten Tomatoes')?.Value || 'N/A';

        document.getElementById('info').innerHTML = `
            <h2>${title}</h2>
            <div class="rating">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="Rotten Tomatoes">
                <span>${tomatoRating}</span>
            </div>
            <p>${data.Plot}</p>
        `;

        document.getElementById('videoContainer').innerHTML = `
            <iframe src="${videoUrl}" allowfullscreen></iframe>
        `;

        document.getElementById('searchContainer').style.display = 'none';
        document.getElementById('infoContainer').style.display = 'flex';
    } else {
        alert('Movie not found');
    }
}

function displayPagination(totalResults) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const totalPages = Math.ceil(totalResults / 10); // Assuming 10 results per page
    const currentPage = 1;

    const prevButton = createPaginationButton('Previous', currentPage - 1);
    pagination.appendChild(prevButton);

    const firstPageButton = createPaginationButton('1', 1);
    pagination.appendChild(firstPageButton);

    const nextButton = createPaginationButton('Next', currentPage + 1);
    pagination.appendChild(nextButton);

    const lastPageButton = createPaginationButton(`${totalPages}`, totalPages);
    pagination.appendChild(lastPageButton);
}

function createPaginationButton(text, page) {
    const button = document.createElement('button');
    button.textContent = text;
    button.addEventListener('click', () => goToPage(page));
    return button;
}

function goToPage(page) {
    // Implement logic to fetch movies for the specified page
    // This function should call searchMovies or modify search query accordingly
}

// Initial setup
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', searchMovies);

    const searchBar = document.getElementById('movieName');
    searchBar.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            searchMovies();
        }
    });
});
