function searchMovies() {
    const movieName = document.getElementById('movieName').value;
    console.log(`Searching for: ${movieName}`);
    // Add your search logic here
    alert(`Searching for: ${movieName}`);
}

function handleEnterKeyPress(event) {
    if (event.key === 'Enter') {
        searchMovies();
    }
}

document.getElementById('movieName').addEventListener('keypress', handleEnterKeyPress);
