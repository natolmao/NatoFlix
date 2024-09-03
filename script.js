const apiKeyOMDB = '212011c'; // OMDB API Key
const apiKeyTMDB = '355c7191de5cb3f569b2a6b34cc274bc'; // TMDB API Key
let currentPage = 1;
const moviesPerPage = 10;

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

    // Handle browser navigation
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

    // Initial page load handling
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
    let query = '';

    if (movieName) query += `&query=${encodeURIComponent(movieName)}`;
    if (genre) query += `&with_genres=${encodeURIComponent(genre)}`;
    if (year) query += `&year=${year}`;
    if (sort) query += `&sort_by=${sort}`;
    query += `&page=${page}`;

    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKeyTMDB}${query}`);
    const data = await response.json();

    if (data.results) {
        const searchResults = document.getElementById('searchResults');
        searchResults.innerHTML = '';
        data.results.forEach(movie => {
            const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/150';
            const movieElement = document.createElement('img');
            movieElement.src = poster;
            movieElement.alt = movie.title;
            movieElement.onclick = () => loadMovie(movie.id, true);
            searchResults.appendChild(movieElement);
        });

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

    // Unfocus the input fields
    document.getElementById('movieName').blur();
    document.getElementById('genre').blur();
    document.getElementById('year').blur();
    document.getElementById('sort').blur();
}

async function loadMovie(tmdbID, updateHistory = true) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${tmdbID}?api_key=${apiKeyTMDB}`);
    const data = await response.json();

    if (data) {
        const imdbID = data.imdb_id;
        const videoUrl = `https://vidsrc.net/embed/${imdbID}`;

        // Display movie info
        const tomatoRating = 'N/A'; // TMDB does not provide Rotten Tomatoes rating directly
        document.getElementById('info').innerHTML = `
            <h2>${data.title} (${data.release_date.split('-')[0]})</h2>
            <div class="rating">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Rotten_Tomatoes.svg" alt="Rotten Tomatoes">
                <span>${tomatoRating}</span>
            </div>
            <p>${data.overview}</p>
        `;

        // Embed the video
        document.getElementById('videoContainer').innerHTML = `<iframe src="${videoUrl}" allowfullscreen></iframe>`;

        // Hide the search container and show the info container
        document.getElementById('searchContainer').style.display = 'none';
        document.getElementById('trendingSection').style.display = 'none';
        document.getElementById('infoContainer').style.display = 'flex';

        if (updateHistory) {
            history.pushState({ imdbID }, '', `?movie=${imdbID}`);
        }
    } else {
        alert('Movie not found');
    }
}

function showSearch() {
    // Show the search container and hide the info container
    document.getElementById('searchContainer').style.display = 'block';
    document.getElementById('infoContainer').style.display = 'none';
    document.getElementById('trendingSection').style.display = 'none';

    // Ensure that the search results are updated based on the URL
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

// Trending Section - Only visible on home.html
if (window.location.pathname === '/home.html') {
    async function loadTrendingMovies() {
        const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${apiKeyTMDB}`);
        const data = await response.json();

        if (data.results) {
            const trendingContainer = document.getElementById('trendingResults');
            trendingContainer.innerHTML = '';
            data.results.forEach(movie => {
                const poster = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/150';
                const movieElement = document.createElement('div');
                movieElement.className = 'movie-item';
                movieElement.innerHTML = `
                    <a href="#" onclick="redirectToEmbedPage('${movie.id}')">
                        <img src="${poster}" alt="${movie.title}">
                        <span>${movie.title}</span>
                    </a>
                `;
                trendingContainer.appendChild(movieElement);
            });
        } else {
            document.getElementById('trendingResults').innerHTML = '<p>No trending movies found.</p>';
        }
    }

    loadTrendingMovies();
}

function redirectToEmbedPage(movieId) {
    const imdbID = ''; // Placeholder. Implement mapping TMDB ID to IMDb ID if needed.
    if (imdbID) {
        loadMovie(imdbID);
    } else {
        alert('IMDb ID not found for this movie.');
    }
}
