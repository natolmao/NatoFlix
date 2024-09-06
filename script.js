const apiKey = '355c7191de5cb3f569b2a6b34cc274bc'; // Replace with your TMDB API key
let currentPage = 1; // Ensure currentPage is tracked globally

document.addEventListener('DOMContentLoaded', () => {
    fetchTrendingMovies();
    document.getElementById('searchBar').addEventListener('input', (event) => {
        const query = event.target.value.trim();
        if (query) {
            searchMoviesAndTVShows(query);
        } else {
            fetchTrendingMovies();
        }
    });
});

async function fetchTrendingMovies() {
    try {
        const movieResponse = await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`);
        const tvResponse = await fetch(`https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`);
        const movieData = await movieResponse.json();
        const tvData = await tvResponse.json();
        displayResults(movieData.results, tvData.results);
    } catch (error) {
        console.error('Error fetching trending movies and TV shows:', error);
    }
}

async function searchMoviesAndTVShows(query) {
    try {
        const movieResponse = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        const tvResponse = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        const movieData = await movieResponse.json();
        const tvData = await tvResponse.json();
        displayResults(movieData.results, tvData.results);
    } catch (error) {
        console.error('Error searching movies and TV shows:', error);
    }
}

function displayResults(movies, tvShows) {
    const resultsList = document.getElementById('results');
    const headerText = document.getElementById('headerText');
    
    // Check if results are being displayed
    if (movies.length > 0 || tvShows.length > 0) {
        headerText.style.display = 'none'; // Hide the header
    } else {
        headerText.style.display = 'block'; // Show the header
    }

    resultsList.innerHTML = '';

    const allResults = [...movies, ...tvShows];

    allResults.forEach(item => {
        const itemTile = document.createElement('div');
        itemTile.className = 'movie-tile';
        itemTile.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
            <h3>${item.title || item.name}</h3>
        `;
        itemTile.addEventListener('click', () => handleItemClick(item.id, item.media_type));
        resultsList.appendChild(itemTile);
    });
}

async function handleItemClick(itemId, mediaType) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${itemId}/external_ids?api_key=${apiKey}`);
        const data = await response.json();
        const imdbID = data.imdb_id;

        if (imdbID) {
            window.location.href = `movie-player.html?movie=${imdbID}&type=${mediaType}`;
        } else {
            alert('IMDb ID not found');
        }
    } catch (error) {
        console.error('Error fetching IMDb ID:', error);
    }
}

function displayPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = ''; // Clear existing pagination

    const createPageButton = (text, page) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.disabled = page === currentPage; // Disable the current page button
        button.onclick = () => {
            currentPage = page; // Update currentPage when button is clicked
            searchMovies(page); // Call your searchMovies function with the new page number
        };
        return button;
    };

    if (currentPage > 1) {
        pagination.appendChild(createPageButton('Previous', currentPage - 1)); // Create "Previous" button
    }

    pagination.appendChild(createPageButton(1, 1)); // Always show the first page button

    if (currentPage > 3) {
        pagination.appendChild(document.createTextNode('...')); // Add ellipsis if current page is far from the first
    }

    // Show 2 pages before and after the current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 2); i++) {
        pagination.appendChild(createPageButton(i, i));
    }

    if (currentPage < totalPages - 2) {
        pagination.appendChild(document.createTextNode('...')); // Add ellipsis if current page is far from the last
    }

    pagination.appendChild(createPageButton(totalPages, totalPages)); // Always show the last page button

    if (currentPage < totalPages) {
        pagination.appendChild(createPageButton('Next', currentPage + 1)); // Create "Next" button
    }
}
