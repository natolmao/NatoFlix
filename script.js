const apiKey = '212011c'; // Your OMDB API key

document.addEventListener('DOMContentLoaded', function() {
    populateYearOptions();
    document.getElementById('searchButton').addEventListener('click', () => searchMovies());

    const inputFields = document.querySelectorAll('#movieName, #genre, #year, #sort');
    inputFields.forEach(field => {
        field.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchMovies();
            }
        });
    });

    window.addEventListener('popstate', function(event) {
        if (event.state) {
            const { imdbID, page, query } = event.state;
            if (imdbID) {
                loadMovie(imdbID, false);
            } else if (page) {
                searchMovies(page, false);
            } else if (query) {
                document.getElementById('movieName').value = query;
                searchMovies(1, false);
            } else {
                showSearch();
            }
        } else {
            showSearch();
        }
    });

    handleInitialLoad();
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

function loadMovie(imdbID, updateHistory = true) {
    if (updateHistory) {
        history.pushState({ imdbID }, '', `?movie=${imdbID}`);
    }
    // Redirect to the embed page
    window.location.href = `embed.html?movie=${imdbID}`;
}
    document.getElementById('movieName').blur();
    document.getElementById('genre').blur();
    document.getElementById('year').blur();
    document.getElementById('sort').blur();
}

async function loadMovie(imdbID, updateHistory = true) {
    const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${apiKey}`);
    const data = await response.json();

    if (data.Response === "True") {
        const videoUrl = `https://vidsrc.net/embed/${imdbID}`;

        document.getElementById('info').innerHTML = `
            <h2>${data.Title} (${data.Year})</h2>
            <div class="rating">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="Rotten Tomatoes">
                <span>${data.Ratings.find(r => r.Source === 'Rotten Tomatoes')?.Value || 'N/A'}</span>
            </div>
            <p>${data.Plot}</p>
        `;

        document.getElementById('videoContainer').innerHTML = `<iframe src="${videoUrl}" allowfullscreen></iframe>`;

        document.getElementById('searchContainer').style.display = 'none';
        document.getElementById('infoContainer').style.display = 'flex';

        if (updateHistory) {
            history.pushState({ imdbID }, '', `?movie=${imdbID}`);
        }
    } else {
        alert('Movie not found');
    }
}

function showSearch() {
    document.getElementById('searchContainer').style.display = 'block';
    document.getElementById('infoContainer').style.display = 'none';
    handleInitialLoad();
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

function handleInitialLoad() {
    const queryParams = new URLSearchParams(window.location.search);
    const search = queryParams.get('search');
    const movie = queryParams.get('movie');
    const page = queryParams.get('page') || 1;

    if (search) {
        document.getElementById('movieName').value = search;
        searchMovies(parseInt(page), false);
    } else if (movie) {
        loadMovie(movie, false);
    } else {
        showSearch();
    }
}
