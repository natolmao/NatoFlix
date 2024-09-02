
// trending.js
document.addEventListener("DOMContentLoaded", function() {
    const trendingContainer = document.getElementById("trendingResults");

    // Fetch trending movies and TV shows from the TMDb API
    function fetchTrending() {
        const apiKey = '355c7191de5cb3f569b2a6b34cc274bc'; // Replace with your TMDb API key
        const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log("TMDb API Response:", data); // Log the API response

                if (data.results && data.results.length > 0) {
                    displayTrending(data.results);
                } else {
                    trendingContainer.innerHTML = "<p>No trending movies or TV shows found.</p>";
                }
            })
            .catch(error => console.error("Error fetching trending data:", error));
    }

    // Display trending movies and TV shows
    function displayTrending(trendingList) {
        console.log("Trending List:", trendingList); // Log the trending list

        trendingList.forEach(item => {
            const movieElement = document.createElement("div");
            movieElement.innerHTML = `
                <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}" onclick="window.location.href='https://vidsrc.net/embed/${item.id}'">
            `;
            trendingContainer.appendChild(movieElement);
        });
    }

    // Call the fetchTrending function to populate the trending section
    fetchTrending();
});
