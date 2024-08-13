let currentPage = 1;
const moviesPerPage = 10;
const apiKey = '212011c';

document.addEventListener('DOMContentLoaded', function() {
    populateYearOptions();
    document.getElementById('searchButton').addEventListener('click', () => searchMovies());

    // Add an event listener to the input fields to listen for the Enter key
    const inputFields = document.querySelectorAll('#movieName, #genre, #year, #sort');
    inputFields.forEach(field => {
        field.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default form submission
                searchMovies();
            }
        });
    });
});

function populateYearOptions() {
    const yearSelect = document.getElementById('year');
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 1900; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    }
}

async function searchMovies(page = 1) {
    currentPage = page;
    const movieName = document.getElementById('movieName').value;
    const genre = document.getElementById('genre').value;
    const year = document.getElementById('year').value;
    const sort = document.getElementById('sort').value;
    let query = '';

    if (movieName) query += `&s=${encodeURIComponent(movieName)}`;
    if (genre) query += `&genre=${encodeURIComponent(genre)}`;
    if (year) query += `&y=${year}`;
    if (sort) query += `&sort=${sort}`;
    query += `&page=${page}`;

    const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}${query}`);
    const data = await response.json();

    if (data.Response === "True") {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
        data.Search.forEach(movie => {
            const poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150';
            const movieElement = document.createElement('img');
            movieElement.src = poster;
            movieElement.alt = movie.Title;
            movieElement.onclick = () => loadMovie(movie.imdbID);
            searchResults.appendChild(movieElement);
        });

        const totalResults = parseInt(data.totalResults, 20);
        const totalPages = Math.ceil(totalResults / moviesPerPage);
        displayPagination(totalPages);
    } else {
        alert('No movies found');
    }

    // Unfocus the input fields
    document.getElementById('movieName').blur();
    document.getElementById('genre').blur();
    document.getElementById('year').blur();
    document.getElementById('sort').blur();
}

async function loadMovie(imdbID) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === "True") {
        const videoUrl = `https://vidsrc.net/embed/${imdbID}`;

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

function showSearch() {
    // Show the search container and hide the info container
    document.getElementById('searchContainer').style.display = 'block';
    document.getElementById('infoContainer').style.display = 'none';
}

function displayPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    const createPageButton = (text, page) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.disabled = page === currentPage;
        button.onclick = () => searchMovies(page);
        return button;
    };

    if (currentPage > 1) {
        pagination.appendChild(createPageButton('Previous', currentPage - 1));
    }

    pagination.appendChild(createPageButton(1, 1));

    if (currentPage > 3) {
        pagination.appendChild(document.createTextNode('...'));
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        pagination.appendChild(createPageButton(i, i));
    }

    if (currentPage < totalPages - 2) {
        pagination.appendChild(document.createTextNode('...'));
    }

    pagination.appendChild(createPageButton(totalPages, totalPages));

    if (currentPage < totalPages) {
        pagination.appendChild(createPageButton('Next', currentPage + 1));
    }
}
