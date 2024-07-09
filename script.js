async function searchMovies() {
    const movieName = document.getElementById('movieName').value;
    const genre = document.getElementById('genre').value;
    const year = document.getElementById('year').value;
    const sort = document.getElementById('sort').value;
    let query = '';

    if (movieName) query += `&s=${encodeURIComponent(movieName)}`;
    if (genre) query += `&genre=${encodeURIComponent(genre)}`;
    if (year) query += `&y=${year}`;
    if (sort) query += `&sort=${sort}`;

    const apiKey = '212011c';
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
    } else {
        alert('No movies found');
    }

    // Unfocus the input fields
    document.getElementById('movieName').blur();
    document.getElementById('genre').blur();
    document.getElementById('year').blur();
    document.getElementById('sort').blur();
}

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
