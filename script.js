// Base code with sample data
const movies = [
    { title: "Young Sheldon", year: 2017, poster: "https://via.placeholder.com/200x300?text=Young+Sheldon" },
    { title: "Other Movie", year: 2020, poster: "https://via.placeholder.com/200x300?text=Other+Movie" },
    // Add more movie objects as needed
];

function displayMovies(movieList) {
    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = ''; // Clear previous content

    movieList.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';

        movieItem.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.year}</p>
        `;

        contentDiv.appendChild(movieItem);
    });
}

document.getElementById('search-bar').addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(searchTerm));
    displayMovies(filteredMovies);
});

// Display all movies on initial load
displayMovies(movies);
