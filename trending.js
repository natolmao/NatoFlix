
// trending.js

document.addEventListener("DOMContentLoaded", function() {
    const trendingContainer = document.getElementById("trendingResults");

    // Fetch trending movies and TV shows from the OMDB API
    function fetchTrending() {
        const apiKey = '355c7191de5cb3f569b2a6b34cc274bc'; // Replace with your OMDB API key
        const url = `https://www.omdbapi.com/?s=trending&type=movie&apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.Response === "True") {
                    displayTrending(data.Search);
                } else {
                    trendingContainer.innerHTML = "<p>No trending movies or TV shows found.</p>";
                }
            })
            .catch(error => console.error("Error fetching trending data:", error));
    }

    // Display trending movies and TV shows
    function displayTrending(trendingList) {
        trendingList.forEach(item => {
            const movieElement = document.createElement("div");
            movieElement.innerHTML = `
                <img src="${item.Poster !== 'N/A' ? item.Poster : 'placeholder.jpg'}" alt="${item.Title}" onclick="window.location.href='https://vidsrc.net/embed/${item.imdbID}'">
            `;
            trendingContainer.appendChild(movieElement);
        });
    }

    // Call the fetchTrending function to populate the trending section
    fetchTrending();
});
