document.addEventListener('DOMContentLoaded', function() {
    // Get the movie ID from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('movie');
    
    if (imdbID) {
        loadMovie(imdbID);
    } else {
        alert('No movie ID provided.');
    }
});

async function loadMovie(imdbID) {
    try {
        const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=212011c`);
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
        } else {
            alert('Movie not found');
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
        alert('Failed to load movie data.');
    }
}
