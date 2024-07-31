document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const movieList = document.getElementById("movieList");

    const movies = [
        { title: "Movie 1", image: "path/to/image1.jpg" },
        { title: "Movie 2", image: "path/to/image2.jpg" },
        { title: "Movie 3", image: "path/to/image3.jpg" }
        // Add more movie objects here
    ];

    function displayMovies(movies) {
        movieList.innerHTML = "";
        movies.forEach(movie => {
            const movieItem = document.createElement("div");
            movieItem.className = "movie-item";
            movieItem.innerHTML = `
                <img src="${movie.image}" alt="${movie.title}">
                <h3>${movie.title}</h3>
            `;
            movieList.appendChild(movieItem);
        });
    }

    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            const query = searchInput.value.toLowerCase();
            const filteredMovies = movies.filter(movie => movie.title.toLowerCase().includes(query));
            displayMovies(filteredMovies);
        }
    });

    displayMovies(movies); // Display all movies by default
});
