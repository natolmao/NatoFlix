let currentPage = 1;
const moviesPerPage = 10;
const apiKey = '355c7191de5cb3f569b2a6b34cc274bc'; // Replace with your TMDB API key

document.addEventListener('DOMContentLoaded', function() {
    populateYearOptions();
    document.getElementById('searchButton').addEventListener('click', () => searchMovies());

    const inputFields = document.querySelectorAll('#movieName, #genre, #year, #sort');
    inputFields.forEach(field => {
        field.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault(); // Prevent the default form submission
                searchMovies();
            }
        });
    });

    window.addEventListener('popstate', function(event) {
        if (event.state) {
            const { movieID, page, query } = event.state;
            if (movieID) {
                loadMovie(movieID, false);
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

async function searchMovies(page = 1, updateHistory = true) {
    currentPage = page;
    const movieName = document.getElementById('movieName').value;
    const genre = document.getElementById('genre').value;
    const year = document.getElementById('year').value;
    const sort = document.getElementById('sort').value;

    let query = `&query=${encodeURIComponent(movieName)}&page=${page}`;

    if (genre) query += `&with_genres=${encodeURIComponent(genre)}`;
    if (year) query += `&primary_release_year=${year}`;

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}${query}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.results) {
            displaySearchResults(data.results);
            const totalResults = data.total_results;
            const totalPages = Math.ceil(totalResults / moviesPerPage);
            displayPagination(totalPages);

            if (updateHistory) {
                const queryString = new URLSearchParams({
                    search: movieName,
                    page: currentPage
                }).toString();
                history.pushState({ page: currentPage, query: movieName }, '', `?${queryString}`);
            }
        } else {
            alert('No movies found');
        }
    } catch (error) {
        console.error('Error searching for movies:', error);
        alert('Failed to search for movies');
    }

    document.getElementById('movieName').blur();
    document.getElementById('genre').blur();
    document.getElementById('year').blur();
    document.getElementById('sort').blur();
}

async function loadMovie(movieID, updateHistory = true) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        if (data) {
            const videoUrl = `https://vidsrc.net/embed/${movieID}`;

            document.getElementById('info').innerHTML = `
                <h2>${data.title} (${data.release_date.split('-')[0]})</h2>
                <div class="rating">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="Rotten Tomatoes">
                    <span>${data.vote_average}</span>
                </div>
                <p>${data.overview}</p>
            `;

            document.getElementById('videoContainer').innerHTML = `<iframe src="${videoUrl}" allowfullscreen></iframe>`;

            document.getElementById('searchContainer').style.display = 'none';
            document.getElementById('infoContainer').style.display = 'flex';

            if (updateHistory) {
                history.pushState({ movieID }, '', `?movie=${movieID}`);
            }
        }
    } catch (error) {
        console.error('Error loading movie:', error);
        alert('Failed to load movie details');
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
